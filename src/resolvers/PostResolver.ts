import {
    Arg,
    Ctx,
    FieldResolver,
    Mutation,
    PubSub,
    PubSubEngine,
    Query,
    Resolver,
    Root
} from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import Comment from "../types/Comment";
import { AddPostInput } from "../types/inputs/AddPostInput";
import { UpdatePostInput } from "../types/inputs/UpdatePostInput";
import Post from "../types/Post";
import User from "../types/User";
import { SubscriptionMutationPayload } from "../typings/enums/subscriptions";
import { GraphQLContext } from "../typings/global";

@Resolver((_of) => Post)
export class PostResolvers {
    @Query((_returns) => Post, { nullable: true })
    getPost(
        @Ctx() { db }: GraphQLContext,
        @Arg("id")
        id: string
    ): Post | undefined {
        return db.posts.find((post) => post.id === id);
    }

    @Query((_returns) => [Post]!, { nullable: true })
    posts(
        @Ctx() { db }: GraphQLContext,
        @Arg("query", { nullable: true })
        query?: string
    ): Post[] {
        if (query && query.trim().length > 0) {
            // Sanitize input!
            const re = new RegExp(query.trim().toLowerCase(), "g");
            return db.posts.filter((post) => re.exec(post.title.toLowerCase()));
        }

        return db.posts;
    }

    @FieldResolver((_returns) => User, { nullable: true })
    author(
        @Ctx() { db }: GraphQLContext,
        @Root() post: Post
    ): User | undefined {
        return db.users.find((user) => user.id === post.author);
    }

    @FieldResolver((_returns) => [Comment]!, { nullable: true })
    comments(@Ctx() { db }: GraphQLContext, @Root() post: Post): Comment[] {
        return db.comments.filter((comment) =>
            post.comments.includes(comment.id)
        );
    }

    @Mutation((_returns) => Post!)
    addPost(
        @Ctx() { db }: GraphQLContext,
        @Arg("newPost") newPost: AddPostInput,
        @PubSub() pubsub: PubSubEngine
    ): Post {
        const userExists = db.users.some((user) => user.id === newPost.author);

        if (!userExists) throw new Error("No such user!");

        const post: Post = {
            id: uuidv4(),
            ...newPost,
            comments: []
        };

        db.posts.push(post);
        if (post.published)
            pubsub.publish("POST", {
                data: post,
                mutation: SubscriptionMutationPayload.CREATED
            });

        return post;
    }

    @Mutation((_returns) => Post!)
    deletePost(
        @Ctx() { db }: GraphQLContext,
        @Arg("id") id: string,
        @PubSub() pubsub: PubSubEngine
    ): Post {
        const postIndex = db.posts.findIndex((post) => post.id === id);

        if (postIndex === -1) throw new Error("No such post!");

        db.comments = db.comments.filter((comment) => comment.post !== id);
        if (db.posts[postIndex]!.published) {
            pubsub.publish("POST", {
                data: db.posts[postIndex],
                mutation: SubscriptionMutationPayload.DELETED
            });
        }

        return db.posts.splice(postIndex, 1)[0]!;
    }

    @Mutation((_returns) => Post!)
    updatePost(
        @Ctx() { db }: GraphQLContext,
        @Arg("updatedPost") updatedPost: UpdatePostInput
    ): Post {
        const postIndex = db.posts.findIndex(
            (post) => post.id === updatedPost.id
        );
        if (postIndex === -1) throw new Error("No such post!");

        // Run checks
        // Then

        const newPost: Post = {
            ...db.posts[postIndex]!
        };

        if (updatedPost.title) newPost.title = updatedPost.title;
        if (updatedPost.body) newPost.body = updatedPost.body;
        if (updatedPost.published) newPost.published = updatedPost.published;

        db.posts[postIndex] = newPost;

        return newPost;
    }
}
