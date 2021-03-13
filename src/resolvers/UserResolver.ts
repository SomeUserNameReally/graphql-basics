import { Arg, Query, Resolver } from "type-graphql";
import User from "../shcemas/User";

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

    @Query(() => User)
    me(): UserData {
        return {
            id: "abc123",
            name: "Ajay",
            email: "abc@email.com"
        };
    }

    @Query(() => User)
    user(@Arg("id") id: string): UserData | undefined {
        if (id === "123") {
            return {
                id: "123",
                name: "Ajay Singh",
                email: "123@email.com"
            };
        }

        return;
    }

    @Query(() => [User!]!)
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
}
