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
import { PostResolvers } from "./PostResolver";
import Post from "../types/Post";
import { CommentResolvers } from "./CommentResolver";
import Comment from "../types/Comment";
import { AddUserInput } from "../types/inputs/AddUserInput";

@Resolver(() => User)
export class UsersResolvers {
    static users: User[] = [
        {
            id: "456",
            age: 25,
            email: "user1@email.com",
            name: "User 1"
        },

        {
            id: "123",
            age: 29,
            email: "user2@email.com",
            name: "User 2"
        }
    ];

    @Query((_returns) => User!)
    me(): User {
        return UsersResolvers.users[1]!;
    }

    @Query((_returns) => User, { nullable: true })
    user(@Arg("id") id: string): User | undefined {
        return UsersResolvers.users.find((user) => user.id === id);
    }

    @Query((_returns) => [User]!, { nullable: true })
    users(
        @Arg("query", { nullable: true }) query?: string
    ): ReadonlyArray<User> {
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
    posts(@Root() user: User): ReadonlyArray<Post> {
        return PostResolvers.posts.filter((post) => post.author === user.id);
    }

    @FieldResolver((_returns) => [Comment]!, { nullable: true })
    comments(@Root() user: User): ReadonlyArray<Comment> {
        return CommentResolvers.comments.filter(
            (comment) => comment.author === user.id
        );
    }

    @Mutation((_returns) => User!)
    addUser(@Arg("newUser") newPost: AddUserInput): User {
        const userExists = UsersResolvers.users.some(
            (user) => user.email === newPost.email
        );

        if (userExists) throw new Error("Duplicate user!");

        const user: User = {
            id: uuidv4(),
            ...newPost
        };

        UsersResolvers.users.push(user);

        return user;
    }

    @Mutation((_returns) => User!)
    deleteUser(@Arg("id") id: string): User {
        const foundUserIndex = UsersResolvers.users.findIndex(
            (user) => user.id === id
        );

        if (foundUserIndex === -1) throw new Error("No such user!");

        PostResolvers.posts = PostResolvers.posts.filter((post) => {
            const match = post.author !== id;

            if (match) {
                CommentResolvers.comments = CommentResolvers.comments.filter(
                    (comment) => comment.post !== post.id
                );
            }

            return !match;
        });

        CommentResolvers.comments = CommentResolvers.comments.filter(
            (comment) => comment.author !== id
        );

        return UsersResolvers.users.splice(foundUserIndex, 1)[0]!;
    }
}
