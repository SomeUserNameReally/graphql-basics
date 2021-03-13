import { Field, ObjectType } from "type-graphql";
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

    @Field(() => User!)
    author!: boolean;
}
