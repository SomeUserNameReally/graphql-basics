import { Field, ObjectType } from "type-graphql";
import Comment from "./Comment";
import User from "./User";

@ObjectType()
export default class Post {
    @Field()
    id!: string;

    @Field()
    title!: string;

    @Field()
    body!: string;

    @Field(() => Boolean!)
    published!: boolean;

    @Field(() => [Comment]!, { nullable: true })
    comments!: string[];

    @Field(() => User!)
    author!: string;
}
