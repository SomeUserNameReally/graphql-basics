import db from "../db";

export interface GraphQLContext {
    db: typeof db;
}
