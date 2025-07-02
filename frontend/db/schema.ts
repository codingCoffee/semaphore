import {
  uuid,
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  primaryKey,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { sql, relations } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = process.env.AUTH_DRIZZLE_URL || "";
const pool = postgres(connectionString, { max: 1 });
export const db = drizzle(pool);

import * as authSchema from "@/lib/auth/schema";
export * from "@/lib/auth/schema";

// Models Defined for Semaphore

export const chat = pgTable("chat", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  isPublic: boolean("is_public").default(false),
  createdBy: uuid("created_by").references(() => authSchema.user.id, {
    onDelete: "restrict",
  }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const llmResponse = pgTable("llmResponse", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chat.id, { onDelete: "restrict" }),
  llm: varchar("llm").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  isPending: boolean("is_pending").default(true),
  createdBy: uuid("created_by").references(() => authSchema.user.id, {
    onDelete: "restrict",
  }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const llmResponseCreatorToUserRelations = relations(
  llmResponse,
  ({ one }) => ({
    creator: one(authSchema.user, {
      fields: [llmResponse.createdBy],
      references: [authSchema.user.id],
    }),
  }),
);
