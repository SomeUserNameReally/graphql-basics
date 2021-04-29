import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import Comment from "../schema/Comment";
import User from "../schema/User";
import { UsersResolvers, UserData } from "./UserResolver";

export interface CommentData {
    id: string;
    date: Date;
    text: string;
    author: string;
}

@Resolver((_of) => Comment)
export class CommentResolvers {
    static readonly comments: ReadonlyArray<CommentData> = Object.freeze([
        {
            id: "daad32sdfdsd",
            date: new Date(),
            text: "Comment 1",
            author: "456"
        },
        {
            id: "sdf98032rjhi",
            date: new Date(),
            text: "Comment 2",
            author: "456"
        },
        {
            id: "wesffsd89324jhk",
            date: new Date(),
            text: "Comment 3",
            author: "123"
        }
    ]);

    @Query((_returns) => Comment!)
    getBaseComment(): CommentData {
        return CommentResolvers.comments[2]!;
    }

    @Query((_returns) => Comment, { nullable: true })
    getComment(
        @Arg("id")
        id: string
    ): CommentData | undefined {
        return CommentResolvers.comments.find((comment) => comment.id === id);
    }

    @Query((_returns) => [Comment]!, { nullable: true })
    comments(
        @Arg("query", { nullable: true })
        query?: string
    ): ReadonlyArray<CommentData> {
        if (query && query.trim().length > 0) {
            // Prone to overflow attacks
            // Sanitize input!
            const re = new RegExp(query.trim().toLowerCase(), "g");
            return CommentResolvers.comments.filter((comment) =>
                re.exec(comment.text.toLowerCase())
            );
        }

        return CommentResolvers.comments;
    }

    @FieldResolver((_returns) => User, { nullable: true })
    author(@Root() comment: Comment): UserData | undefined {
        return UsersResolvers.users.find((user) => user.id === comment.author);
    }
}
