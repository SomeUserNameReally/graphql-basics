import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export default class User {
    @Field()
    id!: string;

    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field(() => Int, { nullable: true })
    age?: number;
}
