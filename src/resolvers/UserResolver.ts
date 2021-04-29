import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import User from "../schema/User";
import { PostResolvers, PostData } from "./PostResolver";
import Post from "../schema/Post";
import { CommentData, CommentResolvers } from "./CommentResolver";
import Comment from "../schema/Comment";

export interface UserData {
    id: string;
    name: string;
    email: string;
    age?: number;
}

@Resolver(() => User)
export class UsersResolvers {
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

    @Query((_returns) => [User]!, { nullable: true })
    users(
        @Arg("query", { nullable: true }) query?: string
    ): ReadonlyArray<UserData> {
        if (query && query.length > 0) {
            // Prone to overflow attacks
            // Sanitize input!
            return UsersResolvers.users.filter((user) =>
                user.name
                    .toLowerCase()
                    .match(new RegExp(query.toLowerCase(), "g"))
            );
        }

        return UsersResolvers.users;
    }

    @FieldResolver((_returns) => [Post]!, { nullable: true })
    posts(@Root() user: User): ReadonlyArray<PostData> {
        return PostResolvers.posts.filter((post) => post.author === user.id);
    }

    @FieldResolver((_returns) => [Comment]!, { nullable: true })
    comments(@Root() user: User): ReadonlyArray<CommentData> {
        return CommentResolvers.comments.filter(
            (comment) => comment.author === user.id
        );
    }
}
