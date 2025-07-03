import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index";
import { must } from "@/lib/must";
import * as schema from "@/lib/auth/schema";
import { createAuthMiddleware, jwt } from "better-auth/plugins";
import cookie from "cookie";
import { v4 as uuidv4 } from "uuid";

const gClientID = must(
  process.env.GOOGLE_CLIENT_ID,
  "GOOGLE_CLIENT_ID is required",
);
const gClientSecret = must(
  process.env.GOOGLE_CLIENT_SECRET,
  "GOOGLE_CLIENT_SECRET is required",
);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    jwt({
      jwt: {
        // This is now long your websockets will be able to stay up. When the
        // websocket is closed, all the queries are dematerialized on the
        // server. So making the socket lifetime too short is bad for
        // performance.
        //
        // The Zero team is working on some improvements to auth that will
        // enable shorter-lived tokens.
        expirationTime: "1h",
      },
      jwks: {
        // disablePrivateKeyEncryption: true,
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519",
        },
      },
    }),
  ],
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },
  socialProviders: {
    google: {
      clientId: gClientID,
      clientSecret: gClientSecret,
    },
  },
  hooks: {
    // We set the JWT, email, and userid in cookies to avoid needing an extra
    // round-trip to get them on startup.
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.indexOf("/callback/") !== -1) {
        const headers = must(ctx.context.responseHeaders);
        const setCookieHeader = ctx.context.responseHeaders?.get("set-cookie");
        const cookieVal = setCookieHeader?.split(";")[0];

        const session = await auth.api.getSession({
          headers: new Headers({
            cookie: cookieVal ?? "",
          }),
        });
        const token = await auth.api.getToken({
          headers: new Headers({
            cookie: cookieVal ?? "",
          }),
        });

        if (session && token) {
          setCookies(headers, {
            userid: session.user.id,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image || "",
            jwt: token.token,
          });
        }
        return;
      }

      if (ctx.path.indexOf("/sign-out") !== -1) {
        const headers = must(ctx.context.responseHeaders);
        setCookies(headers, {
          userid: "",
          email: "",
          name: "",
          image: "",
          jwt: "",
        });
        return;
      }
    }),
  },
});

export function setCookies(
  headers: Headers,
  cookies: {
    userid: string;
    email: string;
    jwt: string;
    name: string;
    image: string;
  },
) {
  const opts = {
    // 1 year. Note that it doesn't really matter what this is as the JWT has
    // its own, much shorter expiry above. It makes sense for it to be long
    // since by default better auth will extend its own session indefinitely
    // as long as you keep calling getSession().
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  };
  for (const [key, value] of Object.entries(cookies)) {
    headers.append("Set-Cookie", cookie.serialize(key, value, opts));
  }
}
