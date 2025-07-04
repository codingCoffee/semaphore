import {
  ANYONE_CAN,
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

// NOTES:
// cpmLit -> compare literal
// - https://github.com/rocicorp/mono/blob/ee6e3890917f9a0e9aeda9d2929faa4d997135a4/packages/zql/src/query/expression.ts#L266

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  const allowIfChatCreatorOrNullOrPublicChat = (
    authData: AuthData,
    { or, cmp }: ExpressionBuilder<Schema, "chat">,
  ) =>
    or(
      cmp("createdBy", authData.sub),
      cmp("createdBy", "IS", null),
      cmp("createdBy", "=", ""),
      cmp("isPublic", "IS", true),
    );

  const allowIfLLMResponseChatCreator = (
    authData: AuthData,
    { exists }: ExpressionBuilder<Schema, "llmResponse">,
  ) =>
    exists("chat", (c) =>
      c.whereExists("creator", (u) => u.where("id", authData.sub)),
    );
  const allowIfLLMResponseChatCreatorIsNull = (
    authData: AuthData,
    { exists }: ExpressionBuilder<Schema, "llmResponse">,
  ) => exists("chat", (c) => c.where("createdBy", "IS", null));
  const allowIfLLMResponseChatCreatorIsEmpty = (
    authData: AuthData,
    { exists }: ExpressionBuilder<Schema, "llmResponse">,
  ) => exists("chat", (c) => c.where("createdBy", "=", ""));
  const allowIfLLMResponseChatIsPublic = (
    authData: AuthData,
    { exists }: ExpressionBuilder<Schema, "llmResponse">,
  ) => exists("chat", (c) => c.where("isPublic", "IS", true));

  return {
    user: {
      row: {
        // required to shou user who sent the message to the LLM
        select: ANYONE_CAN,
      },
    },
    llmResponse: {
      row: {
        select: [
          allowIfLLMResponseChatCreator,
          allowIfLLMResponseChatCreatorIsNull,
          allowIfLLMResponseChatCreatorIsEmpty,
          allowIfLLMResponseChatIsPublic,
        ],
      },
    },
    chat: {
      row: {
        select: [allowIfChatCreatorOrNullOrPublicChat],
      },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});
