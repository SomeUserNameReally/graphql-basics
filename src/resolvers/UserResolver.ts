import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import User from "../shcemas/User";
import PostResolvers, { PostData } from "./PostResolver";
import Post from "../shcemas/Post";

export interface UserData {
    id: string;
    name: string;
    email: string;
    age?: number;
}

@Resolver(() => User)
export default class UsersResolvers {
    static readonly defaultUser: Readonly<UserData> = Object.freeze({
        email: "default@default.com",
        name: "default",
        age: -1,
        id: "no-user"
    });

    static readonly users: ReadonlyArray<UserData> = Object.freeze([
        {
            id: "123",
            age: 29,
            email: "me@me.com",
            name: "ajay"
        },

        {
            id: "456",
            age: 25,
            email: "jennie@me.com",
            name: "Jennie"
        }
    ]);

    @Query((_returns) => User!)
    me(): UserData {
        return UsersResolvers.users[1]!;
    }

    @Query((_returns) => User, { nullable: true })
    user(@Arg("id") id: string): UserData | undefined {
        return UsersResolvers.users.find((user) => user.id === id);
    }

    @Query((_returns) => [User!]!)
    users(
        @Arg("query", { nullable: true }) query?: string
    ): ReadonlyArray<UserData> {
        if (query && query.length > 0) {
            // Prone to overflow attacks
            return UsersResolvers.users.filter((user) =>
                user.name
                    .toLowerCase()
                    .match(new RegExp(query.toLowerCase(), "g"))
            );
        }

        return UsersResolvers.users;
    }

    @FieldResolver((_returns) => [Post!]!)
    posts(@Root() user: User): ReadonlyArray<PostData> {
        return PostResolvers.posts.filter((post) => post.author === user.id);
    }
}
