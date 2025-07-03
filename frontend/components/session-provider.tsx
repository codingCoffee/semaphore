"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Cookies, useCookies } from "react-cookie";

export type SessionContextType = {
  data:
    | {
        userID: string;
        email: string;
        name: string;
        image: string;
        jwt: string;
      }
    | undefined;
  login: () => void;
  logout: () => void;
  zeroAuth: () => () => Promise<string | undefined>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [cookies] = useCookies(["userid", "email", "name", "image", "jwt"]);

  const data = useMemo(() => {
    if (!cookies.userid || !cookies.email) {
      return undefined;
    }
    return {
      userID: cookies.userid,
      name: cookies.name,
      email: cookies.email,
      image: cookies.image,
    };
  }, [cookies.userid, cookies.email]);

  const context = useMemo(() => {
    return {
      data,
      login,
      logout,
      zeroAuth: zeroAuth(cookies.jwt),
    };
  }, [data, login, logout, zeroAuth]);

  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  );
}

function login() {
  const callbackURL = location.href;
  authClient.signIn.social({
    provider: "google",
    callbackURL,
    errorCallbackURL: callbackURL,
    newUserCallbackURL: callbackURL,
  });
}

function logout() {
  authClient.signOut();
}

// Return a function suitable for using with Zero's auth() parameter.
// The slightly tricky bit is that we want to use the JWT from the cookie once
// for performance. But the next time Zero calls the function, we want to
// refresh from server.
//
// Zero team should make this a little easier.
function zeroAuth(initialJWT: string | undefined) {
  return () => {
    let ranOnce = false;
    return async () => {
      if (!ranOnce) {
        ranOnce = true;
        return Promise.resolve(initialJWT);
      }

      await fetch("/api/auth/refresh", {
        credentials: "include",
      });
      return new Cookies().get("jwt") as string | undefined;

      // const response = await fetch("/api/auth/token", {
      //   method: "GET",
      //   credentials: "include",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const data = await response.json();
      // return data.token;
    };
  };
}
