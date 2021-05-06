import { Field, ID, InputType } from "type-graphql";
import Comment from "../Comment";

@InputType()
export class UpdateCommentInput implements Partial<Comment> {
    @Field(() => ID)
    id!: string;

    @Field()
    text!: string;
}
