import { Field, ID, InputType, Int } from "type-graphql";
import User from "../User";

@InputType()
export class UpdateUserInput implements Partial<User> {
    @Field(() => ID)
    id!: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;

    @Field(() => Int, { nullable: true })
    age?: number;
}
