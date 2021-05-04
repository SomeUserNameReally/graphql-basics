import { Field, InputType } from "type-graphql";
import Comment from "../Comment";

@InputType()
export class AddCommentInput implements Partial<Comment> {
    @Field()
    text!: string;

    @Field()
    post!: string;

    @Field()
    author!: string;
}
