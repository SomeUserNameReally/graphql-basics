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
import { AddPostInput } from "../types/inputs/AddPostInput";
import Post from "../types/Post";
import User from "../types/User";
import { GraphQLContext } from "../typings/global";

@Resolver((_of) => Post)
export class PostResolvers {
    @Query((_returns) => Post, { nullable: true })
    getPost(
        @Ctx() ctx: GraphQLContext,
        @Arg("id")
        id: string
    ): Post | undefined {
        return ctx.db.posts.find((post) => post.id === id);
    }

    @Query((_returns) => [Post]!, { nullable: true })
    posts(
        @Ctx() ctx: GraphQLContext,
        @Arg("query", { nullable: true })
        query?: string
    ): Post[] {
        if (query && query.trim().length > 0) {
            // Prone to overflow attacks
            // Sanitize input!
            const re = new RegExp(query.trim().toLowerCase(), "g");
            return ctx.db.posts.filter((post) =>
                re.exec(post.title.toLowerCase())
            );
        }

        return ctx.db.posts;
    }

    @FieldResolver((_returns) => User, { nullable: true })
    author(@Ctx() ctx: GraphQLContext, @Root() post: Post): User | undefined {
        return ctx.db.users.find((user) => user.id === post.author);
    }

    @FieldResolver((_returns) => [Comment]!, { nullable: true })
    comments(@Ctx() ctx: GraphQLContext, @Root() post: Post): Comment[] {
        return ctx.db.comments.filter((comment) =>
            post.comments.includes(comment.id)
        );
    }

    @Mutation((_returns) => Post!)
    addPost(
        @Ctx() ctx: GraphQLContext,
        @Arg("newPost") newPost: AddPostInput
    ): Post {
        const userExists = ctx.db.users.some(
            (user) => user.id === newPost.author
        );

        if (!userExists) throw new Error("No such user!");

        const post: Post = {
            id: uuidv4(),
            ...newPost,
            comments: []
        };

        ctx.db.posts.push(post);

        return post;
    }

    @Mutation((_returns) => Post!)
    deletePost(@Ctx() ctx: GraphQLContext, @Arg("id") id: string): Post {
        const postIndex = ctx.db.posts.findIndex((post) => post.id === id);

        if (postIndex === -1) throw new Error("No such post!");

        ctx.db.comments = ctx.db.comments.filter(
            (comment) => comment.post !== id
        );

        return ctx.db.posts.splice(postIndex, 1)[0]!;
    }
}
