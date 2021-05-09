import { IsBoolean, Length } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import Comment from "./Comment";
import User from "./User";

@ObjectType()
export default class Post {
    @Field(() => ID)
    id!: string;

    @Field()
    @Length(10, 255)
    title!: string;

    @Field()
    @Length(10, 65535) // 2^16 - 1
    body!: string;

    @Field(() => Boolean!)
    @IsBoolean()
    published!: boolean;

    @Field(() => [Comment]!, { nullable: true })
    comments!: string[];

    @Field(() => User!)
    author!: string;
}
