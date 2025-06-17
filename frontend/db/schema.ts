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
  is_public: boolean("is_public").default(false),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => User.id, { onDelete: "restrict" }),
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
  // llm: uuid("llm")
  //   .notNull()
  //   .references(() => LLM.id, { onDelete: "restrict" }),
  question: text("question").notNull(),
  answer: text("answer"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const LLM = pgTable("LLM", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
