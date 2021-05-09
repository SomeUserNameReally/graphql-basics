import { Subscription, Resolver, Root, Arg } from "type-graphql";
import { COMMENT_CHANNEL_GENERATOR } from "../helpers/subscriptions/channelGenerators";
import CommentSubscriptionPayload from "../types/subscriptions/Comment";
import PostSubscriptionPayload from "../types/subscriptions/Post";
import { StaticSubscriptionChannelNames } from "../typings/enums/subscriptions";

@Resolver()
export class Subscriptions {
    @Subscription(() => CommentSubscriptionPayload!, {
        topics: ({ args }) => COMMENT_CHANNEL_GENERATOR(args.post)
    })
    comment(
        @Root() payload: CommentSubscriptionPayload, // @Root decorator must not take any arguments for name of variable for an object type!
        @Arg("post") _post: string // This variable is needed for the dynamic topic function in the decorator to work!
    ): CommentSubscriptionPayload {
        return {
            ...payload
        };
    }

    @Subscription(() => PostSubscriptionPayload!, {
        topics: StaticSubscriptionChannelNames.POST
    })
    post(
        @Root()
        payload: PostSubscriptionPayload // @Root decorator must not take any arguments for name of variable for an object type!
    ): PostSubscriptionPayload {
        return {
            ...payload
        };
    }
}
