import Comment from "../types/Comment";
import Post from "../types/Post";
import User from "../types/User";

const users: User[] = [
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

const posts: Post[] = [
    {
        id: "123",
        title: "Post 1",
        body: "Post 1 body",
        published: true,
        author: "456",
        comments: ["4754"]
    },
    {
        id: "1221",
        title: "Post 2",
        body: "Post 2 body",
        published: false,
        author: "456",
        comments: ["1111"]
    },
    {
        id: "456",
        title: "This is my first post!",
        body: "This is the body for my first post!",
        published: true,
        author: "123",
        comments: ["3527"]
    }
];

const comments: Comment[] = [
    {
        id: "4754",
        date: new Date(),
        text: "Comment 1",
        post: "123",
        author: "456"
    },
    {
        id: "3527",
        date: new Date(),
        text: "Comment 2",
        post: "456",
        author: "456"
    },
    {
        id: "1111",
        date: new Date(),
        text: "Comment 3",
        post: "1221",
        author: "123"
    }
];

export default {
    users,
    posts,
    comments
};
