import { CustomMutatorDefs } from "@rocicorp/zero";
import { schema } from "@/zero/schema";

export function createMutators(_: any) {
  return {} as const satisfies CustomMutatorDefs<typeof schema>;
}

export type Mutators = ReturnType<typeof createMutators>;
