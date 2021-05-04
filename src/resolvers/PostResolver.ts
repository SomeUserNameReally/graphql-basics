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
import { CommentResolvers } from "./CommentResolver";
import { UsersResolvers } from "./UserResolver";

@Resolver((_of) => Post)
export class PostResolvers {
    static posts: Post[] = [
        {
            id: "123",
            title: "Post 1",
            body: "Post 1 body",
            published: true,
            author: "456",
            comments: ["daad32sdfdsd"]
        },
        {
            id: "1239d980fdn34kjldsf9034kl",
            title: "Post 2",
            body: "Post 2 body",
            published: false,
            author: "456",
            comments: ["wesffsd89324jhk"]
        },
        {
            id: "456",
            title: "This is my first post!",
            body: "This is the body for my first post!",
            published: true,
            author: "123",
            comments: ["sdf98032rjhi"]
        }
    ];

    @Query((_returns) => Post, { nullable: true })
    getPost(
        @Arg("id")
        id: string
    ): Post | undefined {
        return PostResolvers.posts.find((post) => post.id === id);
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
            return PostResolvers.posts.filter((post) =>
                re.exec(post.title.toLowerCase())
            );
        }

        return PostResolvers.posts;
    }

    @FieldResolver((_returns) => User, { nullable: true })
    author(@Root() post: Post): User | undefined {
        return UsersResolvers.users.find((user) => user.id === post.author);
    }

    @FieldResolver((_returns) => [Comment]!, { nullable: true })
    comments(@Root() post: Post): Comment[] {
        return CommentResolvers.comments.filter((comment) =>
            post.comments.includes(comment.id)
        );
    }

    @Mutation((_returns) => Post!)
    addPost(@Arg("newPost") newPost: AddPostInput): Post {
        const userExists = UsersResolvers.users.some(
            (user) => user.id === newPost.author
        );

        if (!userExists) throw new Error("No such user!");

        const post: Post = {
            id: uuidv4(),
            ...newPost,
            comments: []
        };

        PostResolvers.posts.push(post);

        return post;
    }

    @Mutation((_returns) => Post!)
    deletePost(@Arg("id") id: string): Post {
        const postIndex = PostResolvers.posts.findIndex(
            (post) => post.id === id
        );

        if (postIndex === -1) throw new Error("No such post!");

        CommentResolvers.comments = CommentResolvers.comments.filter(
            (comment) => comment.post !== id
        );

        return PostResolvers.posts.splice(postIndex, 1)[0]!;
    }
}
