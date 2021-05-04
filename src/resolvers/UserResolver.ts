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
import Post from "../types/Post";
import Comment from "../types/Comment";
import { AddUserInput } from "../types/inputs/AddUserInput";
import db from "../db";

@Resolver(() => User)
export class UsersResolvers {
    @Query((_returns) => User, { nullable: true })
    user(@Arg("id") id: string): User | undefined {
        return db.users.find((user) => user.id === id);
    }

    @Query((_returns) => [User]!, { nullable: true })
    users(@Arg("query", { nullable: true }) query?: string): User[] {
        if (query && query.length > 0) {
            // Prone to overflow attacks
            // Sanitize input!
            return db.users.filter((user) =>
                user.name
                    .toLowerCase()
                    .match(new RegExp(query.toLowerCase(), "g"))
            );
        }

        return db.users;
    }

    @FieldResolver((_returns) => [Post]!, { nullable: true })
    posts(@Root() user: User): Post[] {
        return db.posts.filter((post) => post.author === user.id);
    }

    @FieldResolver((_returns) => [Comment]!, { nullable: true })
    comments(@Root() user: User): Comment[] {
        return db.comments.filter((comment) => comment.author === user.id);
    }

    @Mutation((_returns) => User!)
    addUser(@Arg("newUser") newPost: AddUserInput): User {
        const userExists = db.users.some(
            (user) => user.email === newPost.email
        );

        if (userExists) throw new Error("Duplicate user!");

        const user: User = {
            id: uuidv4(),
            ...newPost
        };

        db.users.push(user);

        return user;
    }

    @Mutation((_returns) => User!)
    deleteUser(@Arg("id") id: string): User {
        const foundUserIndex = db.users.findIndex((user) => user.id === id);

        if (foundUserIndex === -1) throw new Error("No such user!");

        db.posts = db.posts.filter((post) => {
            const match = post.author !== id;

            if (match) {
                db.comments = db.comments.filter(
                    (comment) => comment.post !== post.id
                );
            }

            return !match;
        });

        db.comments = db.comments.filter((comment) => comment.author !== id);

        return db.users.splice(foundUserIndex, 1)[0]!;
    }
}
