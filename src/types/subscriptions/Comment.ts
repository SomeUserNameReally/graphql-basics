import { Field, ObjectType } from "type-graphql";
import { SubscriptionMutationPayload } from "../../typings/enums/subscriptions";
import Comment from "../Comment";
import BaseSubscriptionPayload from "./Base";

@ObjectType()
export default class CommentSubscriptionPayload
    implements BaseSubscriptionPayload {
    @Field()
    mutation!: SubscriptionMutationPayload;

    @Field(() => Comment!)
    comment!: Comment;
}
