DROP TABLE "LLM" CASCADE;--> statement-breakpoint
ALTER TABLE "LLMResponse" ADD COLUMN "is_pending" boolean DEFAULT true;