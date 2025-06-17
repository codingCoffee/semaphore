ALTER TABLE "LLMResponse" RENAME COLUMN "chat" TO "chat_id";--> statement-breakpoint
ALTER TABLE "LLMResponse" DROP CONSTRAINT "LLMResponse_chat_Chat_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "LLM" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "LLMResponse" ADD CONSTRAINT "LLMResponse_chat_id_Chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."Chat"("id") ON DELETE restrict ON UPDATE no action;