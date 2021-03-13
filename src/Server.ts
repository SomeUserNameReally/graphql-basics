import "reflect-metadata";

import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

import UserResolver from "./resolvers/UserResolver";
import PostResolver from "./resolvers/PostResolver";

export class Server {
    static server: ApolloServer;
    static running = false;
    static async init(): Promise<void> {
        if (this.running) return;

        // ... Building schema here
        const schema = await buildSchema({
            resolvers: [UserResolver, PostResolver],
            emitSchemaFile: true
        });

        // Create the GraphQL server
        this.server = new ApolloServer({
            schema,
            playground: true
        });

        // Start the server
        const { url } = await this.server.listen(4000);
        this.running = true;

        console.log(
            `Server is running, GraphQL Playground available at ${url}`
        );
    }
}
