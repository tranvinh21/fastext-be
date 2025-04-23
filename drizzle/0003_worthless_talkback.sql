ALTER TABLE "conversation_members" ALTER COLUMN "conversation_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conversation_members" ADD COLUMN "nickname" varchar(255);--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "chat_key" varchar(255) NOT NULL;