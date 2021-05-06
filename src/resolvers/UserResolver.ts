import {
    Arg,
    Ctx,
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
import { GraphQLContext } from "../typings/global";
import { UpdateUserInput } from "../types/inputs/UpdateUserInput";

@Resolver(() => User)
export class UsersResolvers {
    @Query((_returns) => User, { nullable: true })
    user(
        @Ctx() { db }: GraphQLContext,
        @Arg("id") id: string
    ): User | undefined {
        return db.users.find((user) => user.id === id);
    }

    @Query((_returns) => [User]!, { nullable: true })
    users(
        @Ctx() { db }: GraphQLContext,
        @Arg("query", { nullable: true }) query?: string
    ): User[] {
        if (query && query.length > 0) {
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
    posts(@Ctx() { db }: GraphQLContext, @Root() user: User): Post[] {
        return db.posts.filter((post) => post.author === user.id);
    }

    @FieldResolver((_returns) => [Comment]!, { nullable: true })
    comments(@Ctx() { db }: GraphQLContext, @Root() user: User): Comment[] {
        return db.comments.filter((comment) => comment.author === user.id);
    }

    @Mutation((_returns) => User!)
    addUser(
        @Ctx() { db }: GraphQLContext,
        @Arg("newUser") newPost: AddUserInput
    ): User {
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
    deleteUser(@Ctx() { db }: GraphQLContext, @Arg("id") id: string): User {
        const foundUserIndex = db.users.findIndex((user) => user.id === id);

        if (foundUserIndex === -1) throw new Error("No such user!");

        db.posts = db.posts.filter((post) => {
            const match = post.author === id;

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

    @Mutation((_returns) => User!)
    updateUser(
        @Ctx() { db }: GraphQLContext,
        @Arg("userInfo") userInfo: UpdateUserInput
    ): User {
        const userIndex = db.users.findIndex((user) => user.id === userInfo.id);

        if (userIndex === -1) throw new Error("No such user");

        if (userInfo.email && userInfo.email.trim().length === 0)
            throw new Error("Must provide a valid email!");
        // Other checks...

        const emailTaken = db.users.some(
            (user) => user.email === userInfo.email
        );
        if (emailTaken) throw new Error("Email taken!");

        const newUser: User = {
            ...db.users[userIndex]!
        };

        if (userInfo.name) newUser.name = userInfo.name;
        if (userInfo.email) newUser.email = userInfo.email;
        if (userInfo.age !== undefined) newUser.age = userInfo.age;

        db.users[userIndex] = { ...newUser };

        return newUser;
    }
}
