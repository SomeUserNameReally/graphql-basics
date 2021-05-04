import {
    Arg,
    Ctx,
    FieldResolver,
    Mutation,
    Query,
    Resolver,
    Root
} from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import Comment from "../types/Comment";
import { AddCommentInput } from "../types/inputs/AddCommentInput";
import Post from "../types/Post";
import User from "../types/User";
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
            // Prone to overflow attacks
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
        @Arg("newComment") newComment: AddCommentInput
    ): Comment {
        const userExists = db.users.some(
            (user) => user.id === newComment.author
        );

        const postExists = db.posts.some(
            (post) => post.id === newComment.post && post.published
        );

        if (!userExists) throw new Error("No such user!");
        if (!postExists) throw new Error("Post not found!");

        const comment: Comment = {
            id: uuidv4(),
            date: new Date(),
            ...newComment
        };

        db.comments.push(comment);

        return comment;
    }

    @Mutation((_returns) => Comment!)
    deleteComment(
        @Ctx() { db }: GraphQLContext,
        @Arg("id") id: string
    ): Comment {
        const commentIndex = db.comments.findIndex(
            (comment) => comment.id === id
        );

        if (commentIndex === -1) throw new Error("No such Comment!");

        return db.comments.splice(commentIndex, 1)[0]!;
    }
}
