import { Field, InputType } from "type-graphql";
import Post from "../Post";

@InputType()
export class AddPostInput implements Partial<Post> {
    @Field()
    title!: string;

    @Field()
    body!: string;

    @Field()
    author!: string;

    @Field()
    published!: boolean;
}
