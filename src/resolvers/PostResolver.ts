import { Arg, Query, Resolver } from "type-graphql";
import Post from "../shcemas/Post";
import UsersResolvers, { UserData } from "./UserResolver";

interface PostData {
    id: string;
    title: string;
    body: string;
    published: boolean;
    author: UserData;
}

@Resolver(() => Post)
export default class PostResolvers {
    static readonly posts: ReadonlyArray<PostData> = Object.freeze([
        {
            id: "123",
            title: "Post 1",
            body: "Post 1 body",
            published: true,
            author:
                UsersResolvers.users.find((user) => user.id === "456") ||
                UsersResolvers.defaultUser
        },
        {
            id: "456",
            title: "Post 2",
            body: "Post 2 body",
            published: false,
            author:
                UsersResolvers.users.find((user) => user.id === "456") ||
                UsersResolvers.defaultUser
        }
    ]);

    @Query(() => Post)
    getBasePost(): PostData {
        return {
            id: "1239d980fdn34kjldsf9034kl",
            title: "This is my first post!",
            body: "This is the body for my first post!",
            published: true,
            author:
                UsersResolvers.users.find((user) => user.id === "123") ||
                UsersResolvers.defaultUser
        };
    }

    @Query(() => [Post!]!)
    posts(
        @Arg("query", { nullable: true }) query?: string
    ): ReadonlyArray<PostData> {
        if (query && query.length > 0) {
            // Prone to overflow attacks
            return PostResolvers.posts.filter((post) =>
                post.title
                    .toLowerCase()
                    .match(new RegExp(query.toLowerCase(), "g"))
            );
        }

        return PostResolvers.posts;
    }
}
