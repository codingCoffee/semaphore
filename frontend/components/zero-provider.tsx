"use client";

import { Zero, ZeroOptions, CustomMutatorDefs } from "@rocicorp/zero";
// import { ZeroProvider as ZeroProviderImpl } from "@rocicorp/zero/react";
import { ZeroProvider as ZeroProviderBase } from "@rocicorp/zero/react";
import { useEffect, useState } from "react";
import { schema, type Schema } from "@/zero-schema.gen";

export type ZeroProviderProps<
  S extends Schema,
  M extends CustomMutatorDefs<S> = {},
> = ZeroOptions<S, M> & {
  children: React.ReactNode;
  inspect?: boolean;
  init?: (zero: Zero<S, M>) => void;
};

export function ZeroProvider<
  S extends Schema,
  M extends CustomMutatorDefs<S> = {},
>({ children, inspect, init, ...opts }: ZeroProviderProps<S, M>) {
  const zero = useZero(opts, init);
  useExposeZero(zero, inspect ?? false);

  if (!zero) {
    return null;
  }

  return <ZeroProviderBase zero={zero}>{children}</ZeroProviderBase>;
}

function useZero<S extends Schema, MD extends CustomMutatorDefs<S>>(
  opts: ZeroOptions<S, MD>,
  init?: (zero: any) => void,
) {
  const [zero, setZero] = useState<any | undefined>(undefined);

  useEffect(() => {

    console.log("THIS IS ON CLIENT 1 ###################################################")
    const z = new Zero({
      userID: "bypass",
      schema,
      server: process.env.NEXT_PUBLIC_SERVER,
      kvStore: process.env.NODE_ENV === "development" ? "mem" : "idb",
    });
    if (init) {
      init(z);
    }

    setZero(z);

    return () => {
      zero?.close();
      setZero(undefined);
    };
  }, [init, ...Object.values(opts)]);

  return zero;
}

function useExposeZero<S extends Schema, MD extends CustomMutatorDefs<S>>(
  zero: Zero<S, MD> | undefined,
  inspect: boolean,
) {
  useEffect(() => {
    let canceled = false;

    if (!zero || !inspect) {
      return;
    }

    (window as any).__zero = zero;
    zero.inspect().then((inspector) => {
      if (!canceled) {
        (window as any).__inspector = inspector;
      }
    });

    return () => {
      (window as any).__zero = undefined;
      (window as any).__inspector = undefined;
      canceled = true;
    };
  }, [zero]);
}
