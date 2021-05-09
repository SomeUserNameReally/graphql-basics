import { IsEmail, Length, Max, Min } from "class-validator";
import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export default class User {
    @Field(() => ID)
    id!: string;

    @Field()
    @Length(2, 255)
    name!: string;

    @Field()
    @IsEmail()
    email!: string;

    @Field(() => Int, { nullable: true })
    @Min(0)
    @Max(200)
    age?: number;
}
