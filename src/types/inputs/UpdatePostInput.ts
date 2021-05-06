import { Field, ID, InputType } from "type-graphql";
import Post from "../Post";

@InputType()
export class UpdatePostInput implements Partial<Post> {
    @Field(() => ID)
    id!: string;

    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    body?: string;

    @Field({ nullable: true })
    published?: boolean;
}
