import {
    Arg,
    FieldResolver,
    Mutation,
    Query,
    Resolver,
    Root
} from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import User from "../types/User";
import { PostResolvers, PostData } from "./PostResolver";
import Post from "../types/Post";
import { CommentData, CommentResolvers } from "./CommentResolver";
import Comment from "../types/Comment";
import { AddUserInput } from "../types/AddUser";

export interface UserData {
    id: string;
    name: string;
    email: string;
    age?: number;
}

@Resolver(() => User)
export class UsersResolvers {
    static users: UserData[] = [
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
    ];

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

    @Mutation((_returns) => User!)
    addUser(@Arg("newUser") { name, email, age }: AddUserInput): UserData {
        const userExists = UsersResolvers.users.some(
            (user) => user.email === email
        );

        if (userExists) throw new Error("Duplicate user!");

        const newUser: UserData = {
            id: uuidv4(),
            email,
            name,
            age
        };

        UsersResolvers.users.push(newUser);

        return newUser;
    }
}
