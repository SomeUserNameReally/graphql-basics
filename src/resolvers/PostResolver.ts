import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import Post from "../schema/Post";
import User from "../schema/User";
import { UsersResolvers, UserData } from "./UserResolver";

export interface PostData {
    id: string;
    title: string;
    body: string;
    published: boolean;
    author: string;
}

@Resolver((_of) => Post)
export class PostResolvers {
    static readonly posts: ReadonlyArray<PostData> = Object.freeze([
        {
            id: "123",
            title: "Post 1",
            body: "Post 1 body",
            published: true,
            author: "456"
        },
        {
            id: "456",
            title: "Post 2",
            body: "Post 2 body",
            published: false,
            author: "456"
        },
        {
            id: "1239d980fdn34kjldsf9034kl",
            title: "This is my first post!",
            body: "This is the body for my first post!",
            published: true,
            author: "123"
        }
    ]);

    @Query((_returns) => Post!)
    getBasePost(): PostData {
        return PostResolvers.posts[2]!;
    }

    @Query((_returns) => Post, { nullable: true })
    getPost(
        @Arg("id")
        id: string
    ): PostData | undefined {
        return PostResolvers.posts.find((post) => post.id === id);
    }

    @Query((_returns) => [Post]!, { nullable: true })
    posts(
        @Arg("query", { nullable: true })
        query?: string
    ): ReadonlyArray<PostData> {
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
    author(@Root() post: Post): UserData | undefined {
        return UsersResolvers.users.find((user) => user.id === post.author);
    }
}
