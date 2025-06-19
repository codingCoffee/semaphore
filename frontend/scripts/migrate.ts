import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { authDb, authPool } from "@/db/index";

// This will run migrations on the database, skipping the ones already applied
await migrate(authDb, { migrationsFolder: "./db/migrations" });

// Don't forget to close the connection, otherwise the script will hang
await authPool.end();
