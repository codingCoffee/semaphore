import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle({ client: pool, logger: true });

export const authPool = new Pool({
  connectionString: process.env.AUTH_DRIZZLE_URL,
});
export const authDb = drizzle({ client: authPool, logger: true });
