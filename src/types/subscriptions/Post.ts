import { Field, ObjectType } from "type-graphql";
import { SubscriptionMutationPayload } from "../../typings/enums/subscriptions";
import Post from "../Post";
import BaseSubscriptionPayload from "./Base";

@ObjectType()
export default class PostSubscriptionPayload
    implements BaseSubscriptionPayload {
    @Field(() => SubscriptionMutationPayload)
    mutation!: SubscriptionMutationPayload;

    @Field(() => Post!)
    data!: Post;
}
