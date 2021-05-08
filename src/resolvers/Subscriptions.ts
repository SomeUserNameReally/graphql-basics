import { Subscription, Resolver, Root, Arg } from "type-graphql";
import Comment from "../types/Comment";
import CommentSubscriptionPayload from "../types/subscriptions/Comment";
import PostSubscriptionPayload from "../types/subscriptions/Post";

@Resolver()
export class Subscriptions {
    @Subscription(() => Comment!, {
        topics: ({ args }) => `COMMENT ${args.post}`
    })
    comment(
        @Root("comment") payload: CommentSubscriptionPayload,
        @Arg("post") post: string
    ) {
        return {
            ...payload,
            post
        };
    }

    @Subscription(() => PostSubscriptionPayload!, {
        topics: "POST"
    })
    post(@Root() payload: PostSubscriptionPayload) {
        return {
            ...payload
        };
    }
}
