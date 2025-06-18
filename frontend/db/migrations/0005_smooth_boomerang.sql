ALTER TABLE "Chat" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "LLMResponse" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "LLMResponse" ADD CONSTRAINT "LLMResponse_created_by_User_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE no action;