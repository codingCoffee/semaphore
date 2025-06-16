ALTER TABLE "LLMResponse" DROP CONSTRAINT "LLMResponse_llm_LLM_id_fk";
--> statement-breakpoint
ALTER TABLE "LLMResponse" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "LLMResponse" ALTER COLUMN "llm" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "LLMResponse" ALTER COLUMN "answer" DROP NOT NULL;