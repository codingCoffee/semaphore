import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db, pool } from "@/db/index";

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: "./db/migrations" });

// Don't forget to close the connection, otherwise the script will hang
await pool.end();
