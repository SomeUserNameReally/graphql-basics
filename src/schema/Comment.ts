import { Field, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
export default class Comment {
    @Field()
    id!: string;

    @Field()
    date!: Date;

    @Field()
    text!: string;

    @Field(() => User!)
    author!: string;
}
