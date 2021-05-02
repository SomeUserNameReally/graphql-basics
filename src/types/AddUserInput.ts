import { Field, InputType } from "type-graphql";
import User from "./User";

@InputType()
export class AddUserInput implements Partial<User> {
    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field({ nullable: true })
    age?: number;
}
