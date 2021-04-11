import { UsersResolvers } from "./UserResolver";
import { PostResolvers } from "./PostResolver";
import { NonEmptyArray } from "type-graphql";

// Explicit typing needed
export const resolvers: NonEmptyArray<Function> = [
    UsersResolvers,
    PostResolvers
];
