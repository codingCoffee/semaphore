import {
  ANYONE_CAN_DO_ANYTHING,
  definePermissions,
  PermissionsConfig,
  ExpressionBuilder,
} from "@rocicorp/zero";

import { schema, type Schema } from "@/zero/zero-autogen-schema.gen";
export { schema, type Schema };

type AuthData = {
  // The logged-in user.
  sub: string;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  const allowIfChatCreatorOrNull = (
    authData: AuthData,
    { or, cmp }: ExpressionBuilder<Schema, "chat">,
  ) => {
    return or(
      cmp("createdBy", authData.sub),
      cmp("createdBy", "IS", null),
      cmp("createdBy", "=", ""),
    );
  };

  return {
    user: ANYONE_CAN_DO_ANYTHING,
    llmResponse: ANYONE_CAN_DO_ANYTHING,
    chat: {
      row: {
        select: [allowIfChatCreatorOrNull],
      },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});
