import {
    Arg,
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
import db from "../db";

@Resolver((_of) => Post)
export class PostResolvers {
    @Query((_returns) => Post, { nullable: true })
    getPost(
        @Arg("id")
        id: string
    ): Post | undefined {
        return db.posts.find((post) => post.id === id);
    }

    @Query((_returns) => [Post]!, { nullable: true })
    posts(
        @Arg("query", { nullable: true })
        query?: string
    ): Post[] {
        if (query && query.trim().length > 0) {
            // Prone to overflow attacks
            // Sanitize input!
            const re = new RegExp(query.trim().toLowerCase(), "g");
            return db.posts.filter((post) => re.exec(post.title.toLowerCase()));
        }

        return db.posts;
    }

    @FieldResolver((_returns) => User, { nullable: true })
    author(@Root() post: Post): User | undefined {
        return db.users.find((user) => user.id === post.author);
    }

    @FieldResolver((_returns) => [Comment]!, { nullable: true })
    comments(@Root() post: Post): Comment[] {
        return db.comments.filter((comment) =>
            post.comments.includes(comment.id)
        );
    }

    @Mutation((_returns) => Post!)
    addPost(@Arg("newPost") newPost: AddPostInput): Post {
        const userExists = db.users.some((user) => user.id === newPost.author);

        if (!userExists) throw new Error("No such user!");

        const post: Post = {
            id: uuidv4(),
            ...newPost,
            comments: []
        };

        db.posts.push(post);

        return post;
    }

    @Mutation((_returns) => Post!)
    deletePost(@Arg("id") id: string): Post {
        const postIndex = db.posts.findIndex((post) => post.id === id);

        if (postIndex === -1) throw new Error("No such post!");

        db.comments = db.comments.filter((comment) => comment.post !== id);

        return db.posts.splice(postIndex, 1)[0]!;
    }
}
