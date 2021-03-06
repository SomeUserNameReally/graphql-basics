import {
    Arg,
    Ctx,
    FieldResolver,
    Mutation,
    PubSub,
    Query,
    Resolver,
    Root
} from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import { commentChannelGenerator } from "../helpers/subscriptions/channelGenerators";
import PubSubImplementation from "../PubSub";
import Comment from "../types/Comment";
import { AddCommentInput } from "../types/inputs/AddCommentInput";
import { UpdateCommentInput } from "../types/inputs/UpdateCommentInput";
import Post from "../types/Post";
import CommentSubscriptionPayload from "../types/subscriptions/Comment";
import User from "../types/User";
import { SubscriptionMutationPayload } from "../typings/enums/subscriptions";
import { GraphQLContext } from "../typings/global";

@Resolver((_of) => Comment)
export class CommentResolvers {
    @Query((_returns) => Comment, { nullable: true })
    getComment(
        @Ctx() { db }: GraphQLContext,
        @Arg("id")
        id: string
    ): Comment | undefined {
        return db.comments.find((comment) => comment.id === id);
    }

    @Query((_returns) => [Comment]!, { nullable: true })
    comments(
        @Ctx() { db }: GraphQLContext,
        @Arg("query", { nullable: true })
        query?: string
    ): Comment[] {
        if (query && query.trim().length > 0) {
            // Sanitize input!
            const re = new RegExp(query.trim().toLowerCase(), "g");
            return db.comments.filter((comment) =>
                re.exec(comment.text.toLowerCase())
            );
        }

        return db.comments;
    }

    @FieldResolver((_returns) => User, { nullable: true })
    author(
        @Ctx() { db }: GraphQLContext,
        @Root() comment: Comment
    ): User | undefined {
        return db.users.find((user) => user.id === comment.author);
    }

    @FieldResolver((_returns) => Post, { nullable: true })
    post(
        @Ctx() { db }: GraphQLContext,
        @Root() comment: Comment
    ): Post | undefined {
        return db.posts.find((post) => post.id === comment.post);
    }

    @Mutation((_returns) => Comment!)
    addComment(
        @Ctx() { db }: GraphQLContext,
        @Arg("newComment") newComment: AddCommentInput,
        @PubSub() pubsub: PubSubImplementation
    ): Comment {
        const userExists = db.users.some(
            (user) => user.id === newComment.author
        );

        const postExists = db.posts.some(
            (post) => post.id === newComment.post && post.published
        );

        if (!userExists) throw new Error("User not found!");
        if (!postExists) throw new Error("Post not found!");

        const comment: Comment = {
            id: uuidv4(),
            date: new Date(),
            ...newComment
        };

        db.comments.push(comment);
        pubsub.publish<string, CommentSubscriptionPayload>(
            commentChannelGenerator(newComment.post),
            { comment, mutation: SubscriptionMutationPayload.CREATED }
        );

        return comment;
    }

    @Mutation((_returns) => Comment!)
    deleteComment(
        @Ctx() { db }: GraphQLContext,
        @Arg("id") id: string,
        @PubSub() pubsub: PubSubImplementation
    ): Comment {
        const commentIndex = db.comments.findIndex(
            (comment) => comment.id === id
        );

        if (commentIndex === -1) throw new Error("No such Comment!");
        const comment = db.comments[commentIndex]!;

        pubsub.publish<string, CommentSubscriptionPayload>(
            commentChannelGenerator(comment.post),
            {
                mutation: SubscriptionMutationPayload.DELETED,
                comment
            }
        );

        return db.comments.splice(commentIndex, 1)[0]!;
    }

    @Mutation((_returns) => Comment!)
    updateComment(
        @Ctx() { db }: GraphQLContext,
        @Arg("updatedComment") updatedComment: UpdateCommentInput,
        @PubSub() pubsub: PubSubImplementation
    ): Comment {
        const commentIndex = db.comments.findIndex(
            (comment) => comment.id === updatedComment.id
        );
        if (updatedComment.text.trim().length === 0 || commentIndex === -1)
            throw new Error("Invalid comment!");
        // Run other checks

        const newComment: Comment = {
            ...db.comments[commentIndex]!
        };

        newComment.date = new Date();
        newComment.text = updatedComment.text;

        pubsub.publish<string, CommentSubscriptionPayload>(
            commentChannelGenerator(newComment.post),
            {
                mutation: SubscriptionMutationPayload.UPDATED,
                comment: newComment
            }
        );

        return newComment;
    }
}
