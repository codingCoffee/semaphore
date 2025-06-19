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
import type { AdapterAccountType } from "next-auth/adapters";

const connectionString = process.env.AUTH_DRIZZLE_URL || "";
const pool = postgres(connectionString, { max: 1 });
export const db = drizzle(pool);

export const users = pgTable(
  "user",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),

    username: varchar("username", { length: 255 }).unique(),
    hashedPassword: text("hashedPassword"),
    createdAt: timestamp("createdAt", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "string" })
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

export const accounts = pgTable(
  "account",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable(
  "authenticator",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

// Models Defined for Semaphore

export const chats = pgTable("chat", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  isPublic: boolean("is_public").default(false),
  createdBy: uuid("createdBy").references(() => users.id, {
    onDelete: "restrict",
  }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const llmResponses = pgTable("llmResponse", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "restrict" }),
  llm: varchar("llm").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  isPending: boolean("is_pending").default(true),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "restrict",
  }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
