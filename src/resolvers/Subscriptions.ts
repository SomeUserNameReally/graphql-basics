import { Subscription, Resolver, Root, Arg } from "type-graphql";
import Comment from "../types/Comment";

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
}
