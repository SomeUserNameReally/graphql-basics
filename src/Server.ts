import "reflect-metadata";

import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { resolvers } from "./resolvers";
import db from "./db";

export class Server {
    private static server: ApolloServer;

    static async init(): Promise<void> {
        if (Server.server) return;

        // ... Building schema here
        const schema = await buildSchema({
            resolvers,
            emitSchemaFile: true
        });

        // Create the GraphQL server
        Server.server = new ApolloServer({
            schema,
            playground: true,
            context: {
                db
            }
        });

        // Start the server
        const { url } = await Server.server.listen(4000);

        console.log(
            `Server is running, GraphQL Playground available at ${url}`
        );
    }
}
