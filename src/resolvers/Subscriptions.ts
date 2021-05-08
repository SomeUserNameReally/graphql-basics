import { Subscription, Resolver, Root, Arg } from "type-graphql";
import Comment from "../types/Comment";
import Post from "../types/Post";

@Resolver()
export class Subscriptions {
    @Subscription(() => Comment!, {
        topics: ({ args }) => `COMMENT ${args.post}`
    })
    comment(
        @Root("comment") payload: { comment: Comment },
        @Arg("post") post: string
    ) {
        return {
            ...payload,
            post
        };
    }

    @Subscription(() => Post!, {
        topics: "POST"
    })
    post(@Root("post") payload: { post: Post }) {
        return {
            ...payload
        };
    }
}
