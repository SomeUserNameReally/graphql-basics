import { Field, InputType, Int } from "type-graphql";
import User from "../User";

@InputType()
export class AddUserInput implements Partial<User> {
    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field(() => Int, { nullable: true })
    age?: number;
}
