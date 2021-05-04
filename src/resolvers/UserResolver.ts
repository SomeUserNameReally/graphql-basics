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

@Resolver(() => User)
export class UsersResolvers {
    @Query((_returns) => User, { nullable: true })
    user(@Ctx() ctx: GraphQLContext, @Arg("id") id: string): User | undefined {
        return ctx.db.users.find((user) => user.id === id);
    }

    @Query((_returns) => [User]!, { nullable: true })
    users(
        @Ctx() ctx: GraphQLContext,
        @Arg("query", { nullable: true }) query?: string
    ): User[] {
        if (query && query.length > 0) {
            // Prone to overflow attacks
            // Sanitize input!
            return ctx.db.users.filter((user) =>
                user.name
                    .toLowerCase()
                    .match(new RegExp(query.toLowerCase(), "g"))
            );
        }

        return ctx.db.users;
    }

    @FieldResolver((_returns) => [Post]!, { nullable: true })
    posts(@Ctx() ctx: GraphQLContext, @Root() user: User): Post[] {
        return ctx.db.posts.filter((post) => post.author === user.id);
    }

    @FieldResolver((_returns) => [Comment]!, { nullable: true })
    comments(@Ctx() ctx: GraphQLContext, @Root() user: User): Comment[] {
        return ctx.db.comments.filter((comment) => comment.author === user.id);
    }

    @Mutation((_returns) => User!)
    addUser(
        @Ctx() ctx: GraphQLContext,
        @Arg("newUser") newPost: AddUserInput
    ): User {
        const userExists = ctx.db.users.some(
            (user) => user.email === newPost.email
        );

        if (userExists) throw new Error("Duplicate user!");

        const user: User = {
            id: uuidv4(),
            ...newPost
        };

        ctx.db.users.push(user);

        return user;
    }

    @Mutation((_returns) => User!)
    deleteUser(@Ctx() ctx: GraphQLContext, @Arg("id") id: string): User {
        const foundUserIndex = ctx.db.users.findIndex((user) => user.id === id);

        if (foundUserIndex === -1) throw new Error("No such user!");

        ctx.db.posts = ctx.db.posts.filter((post) => {
            const match = post.author !== id;

            if (match) {
                ctx.db.comments = ctx.db.comments.filter(
                    (comment) => comment.post !== post.id
                );
            }

            return !match;
        });

        ctx.db.comments = ctx.db.comments.filter(
            (comment) => comment.author !== id
        );

        return ctx.db.users.splice(foundUserIndex, 1)[0]!;
    }
}
