import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import Comment from "../types/Comment";
import Post from "../types/Post";
import User from "../types/User";
import { PostResolvers } from "./PostResolver";
import { UsersResolvers } from "./UserResolver";

@Resolver((_of) => Comment)
export class CommentResolvers {
    static readonly comments: ReadonlyArray<Comment> = Object.freeze([
        {
            id: "daad32sdfdsd",
            date: new Date(),
            text: "Comment 1",
            post: "123",
            author: "456"
        },
        {
            id: "sdf98032rjhi",
            date: new Date(),
            text: "Comment 2",
            post: "456",
            author: "456"
        },
        {
            id: "wesffsd89324jhk",
            date: new Date(),
            text: "Comment 3",
            post: "1239d980fdn34kjldsf9034kl",
            author: "123"
        }
    ]);

    @Query((_returns) => Comment!)
    getBaseComment(): Comment {
        return CommentResolvers.comments[2]!;
    }

    @Query((_returns) => Comment, { nullable: true })
    getComment(
        @Arg("id")
        id: string
    ): Comment | undefined {
        return CommentResolvers.comments.find((comment) => comment.id === id);
    }

    @Query((_returns) => [Comment]!, { nullable: true })
    comments(
        @Arg("query", { nullable: true })
        query?: string
    ): ReadonlyArray<Comment> {
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
    author(@Root() comment: Comment): User | undefined {
        return UsersResolvers.users.find((user) => user.id === comment.author);
    }

    @FieldResolver((_returns) => Post, { nullable: true })
    post(@Root() comment: Comment): Post | undefined {
        return PostResolvers.posts.find((post) => post.id === comment.post);
    }
}
