import { IsDate, Length } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import Post from "./Post";
import User from "./User";

@ObjectType()
export default class Comment {
    @Field(() => ID)
    id!: string;

    @Field()
    @IsDate()
    date!: Date;

    @Field()
    @Length(0, 255)
    text!: string;

    @Field(() => Post!)
    post!: string;

    @Field(() => User!)
    author!: string;
}
