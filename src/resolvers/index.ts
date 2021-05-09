import { UsersResolvers } from "./UserResolver";
import { PostResolvers } from "./PostResolver";
import { NonEmptyArray, registerEnumType } from "type-graphql";
import { CommentResolvers } from "./CommentResolver";
import { Subscriptions } from "./Subscriptions";
import { SubscriptionMutationPayload } from "../typings/enums/subscriptions";

registerEnumType(SubscriptionMutationPayload, {
    name: "SubscriptionMutationPayload",
    description: "Possible subscription mutation states."
});

// Explicit typing needed
export const resolvers: NonEmptyArray<Function> = [
    UsersResolvers,
    PostResolvers,
    CommentResolvers,
    Subscriptions
];
