import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { authDb } from "@/db/index";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(authDb),
  providers: [Google],
});
