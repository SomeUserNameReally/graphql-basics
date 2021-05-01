import { Field, ObjectType } from "type-graphql";
import Post from "./Post";
import User from "./User";

@ObjectType()
export default class Comment {
    @Field()
    id!: string;

    @Field()
    date!: Date;

    @Field()
    text!: string;

    @Field(() => Post!)
    post!: string;

    @Field(() => User!)
    author!: string;
}
