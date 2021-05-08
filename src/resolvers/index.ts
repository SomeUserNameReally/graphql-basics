import { UsersResolvers } from "./UserResolver";
import { PostResolvers } from "./PostResolver";
import { NonEmptyArray } from "type-graphql";
import { CommentResolvers } from "./CommentResolver";
import { Subscriptions } from "./Subscriptions";

// Explicit typing needed
export const resolvers: NonEmptyArray<Function> = [
    UsersResolvers,
    PostResolvers,
    CommentResolvers,
    Subscriptions
];
