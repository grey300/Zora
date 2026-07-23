import { pgTable, pgPolicy, varchar, timestamp, text, integer, serial, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
}, (table) => [
	pgPolicy("select_policy", { as: "permissive", for: "select", to: ["public"], using: sql`(auth.uid() IS NOT NULL)` }),
]);

export const courseList = pgTable("CourseList", {
	id: serial().primaryKey().notNull(),
	courseId: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	category: varchar({ length: 255 }).notNull(),
	level: varchar({ length: 255 }).notNull(),
	courseOutput: jsonb().notNull(),
	createdBy: varchar({ length: 255 }).notNull(),
	userName: varchar({ length: 255 }),
	userProfileImage: varchar({ length: 255 }),
	includeVideo: varchar({ length: 255 }).notNull(),
});
