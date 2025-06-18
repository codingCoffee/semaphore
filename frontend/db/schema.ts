import {
  uuid,
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { sql, relations } from "drizzle-orm";

export const User = pgTable(
  "User",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    username: varchar("username", { length: 255 }).notNull().unique(),
    hashedPassword: text("hashed_password").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      usernameIndex: uniqueIndex("usernameIndex").on(table.username),
    };
  },
);

export const Chat = pgTable("Chat", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  isPublic: boolean("is_public").default(false),
  createdBy: uuid("created_by").references(() => User.id, {
    onDelete: "restrict",
  }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const LLMResponse = pgTable("LLMResponse", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => Chat.id, { onDelete: "restrict" }),
  llm: varchar("llm").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  isPending: boolean("is_pending").default(true),
  createdBy: uuid("created_by").references(() => User.id, {
    onDelete: "restrict",
  }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
