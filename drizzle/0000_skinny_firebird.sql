-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "CourseList" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"level" varchar(255) NOT NULL,
	"courseOutput" jsonb NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"userName" varchar(255),
	"userProfileImage" varchar(255),
	"includeVideo" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE POLICY "select_policy" ON "_prisma_migrations" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() IS NOT NULL));
*/