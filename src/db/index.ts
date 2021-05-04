import Comment from "../types/Comment";
import Post from "../types/Post";
import User from "../types/User";

let users: User[] = [
    {
        id: "456",
        age: 25,
        email: "user1@email.com",
        name: "User 1"
    },

    {
        id: "123",
        age: 29,
        email: "user2@email.com",
        name: "User 2"
    }
];

let posts: Post[] = [
    {
        id: "123",
        title: "Post 1",
        body: "Post 1 body",
        published: true,
        author: "456",
        comments: ["daad32sdfdsd"]
    },
    {
        id: "1239d980fdn34kjldsf9034kl",
        title: "Post 2",
        body: "Post 2 body",
        published: false,
        author: "456",
        comments: ["wesffsd89324jhk"]
    },
    {
        id: "456",
        title: "This is my first post!",
        body: "This is the body for my first post!",
        published: true,
        author: "123",
        comments: ["sdf98032rjhi"]
    }
];

let comments: Comment[] = [
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
];

export default {
    users,
    posts,
    comments
};
