import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import Post from "../shcemas/Post";
import UsersResolvers, { UserData } from "./UserResolver";

interface PostData {
    id: string;
    title: string;
    body: string;
    published: boolean;
    author: string;
}

@Resolver((_of) => Post)
export default class PostResolvers {
    static readonly posts: ReadonlyArray<PostData> = Object.freeze([
        {
            id: "123",
            title: "Post 1",
            body: "Post 1 body",
            published: true,
            author: "456"
            //     UsersResolvers.users.find((user) => user.id === "456") ||
            //     UsersResolvers.defaultUser
        },
        {
            id: "456",
            title: "Post 2",
            body: "Post 2 body",
            published: false,
            author: "456"
            //     UsersResolvers.users.find((user) => user.id === "456") ||
            //     UsersResolvers.defaultUser
        }
    ]);

    @Query((_returns) => Post)
    getBasePost(): PostData {
        return {
            id: "1239d980fdn34kjldsf9034kl",
            title: "This is my first post!",
            body: "This is the body for my first post!",
            published: true,
            author: "123"
        };
    }

    @Query((_returns) => [Post!]!)
    posts(
        @Arg("query", { nullable: true })
        query?: string
    ): ReadonlyArray<PostData> {
        if (query && query.trim().length > 0) {
            // Prone to overflow attacks
            const re = new RegExp(query.trim().toLowerCase(), "g");
            return PostResolvers.posts.filter((post) =>
                re.exec(post.title.toLowerCase())
            );
        }

        return PostResolvers.posts;
    }

    @FieldResolver()
    author(@Root() post: Post): UserData {
        const foundUser = UsersResolvers.users.find(
            (user) => user.id === post.author
        );
        return foundUser || UsersResolvers.defaultUser;
    }
}
