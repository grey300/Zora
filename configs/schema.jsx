import {
  json,
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
  numeric,
  pgEnum,
  index,
  uniqueIndex,
  timestamp,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm"; // ✅ import relations from drizzle-orm

// Auth / user-management schemas
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const Users = pgTable("users", {
  id: varchar("id").primaryKey(), // uuid generated in app code
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  image: varchar("image", { length: 1000 }),
  passwordHash: varchar("passwordHash", { length: 255 }), // null for Google-only accounts
  role: roleEnum("role").notNull().default("user"),
  provider: varchar("provider", { length: 50 }).notNull().default("credentials"),
  banned: boolean("banned").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Course-related schemas
export const CourseList = pgTable("courseList", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  level: varchar("level").notNull(),
  includeVideo: varchar("includeVideo").notNull().default("Yes"),
  courseOutput: json("courseOutput").notNull(),
  createdBy: varchar("createdBy").notNull(),
  userName: varchar("userName").notNull(),
  userProfileImage: varchar("userProfileImage").notNull(),
  courseBanner: varchar("courseBanner").default("/placeholder.png"),
  publish: boolean("publish").default(false),
});

export const Chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseid").notNull(),
  chapterId: integer("chapterId").notNull(),
  content: json("content").notNull(),
  videoId: varchar("videoId").notNull(),
  quiz: json("quiz"), // MCQs generated for this chapter: [{question, correct_answer, options}]
});

// Ratings on published courses (one rating per user per course)
export const CourseRatings = pgTable(
  "course_ratings",
  {
    id: serial("id").primaryKey(),
    courseId: varchar("courseId").notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    userName: varchar("userName", { length: 255 }),
    rating: integer("rating").notNull(), // 1..5
    review: varchar("review", { length: 500 }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("course_ratings_course_user_idx").on(table.courseId, table.userId)]
);

// Game-related schemas
export const gameTypeEnum = pgEnum("game_type", ["mcq", "open_ended", "mixed"]);

export const game = pgTable("game", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  timeStarted: varchar("timeStarted", { length: 255 }).notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  timeEnded: varchar("timeEnded", { length: 255 }),
  gameType: gameTypeEnum("gameType").notNull(),
});

export const TopicCount = pgTable("topic_count", {
  id: serial("id").primaryKey(),
  topic: varchar("topic", { length: 255 }).notNull().unique(),
  count: integer("count").notNull(),
});

export const Question = pgTable("question", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 1000 }).notNull(),
  answer: varchar("answer", { length: 1000 }).notNull(),
  gameId: integer("gameId")
    .notNull()
    .references(() => game.id),
  options: json("options"),
  percentageCorrect: numeric("percentageCorrect", { precision: 4, scale: 2 }),
  isCorrect: boolean("isCorrect"),
  questionType: gameTypeEnum("questionType").notNull(),
  userAnswer: varchar("userAnswer", { length: 1000 }),
});

export const gameRelations = relations(game, ({ many }) => ({
  questions: many(Question),
}));

export const questionRelations = relations(Question, ({ one }) => ({
  game: one(game, {
    fields: [Question.gameId],
    references: [game.id],
  }),
}));

// Indexes
export const gameUserIdIndex = index("game_user_id_idx", game.userId);
export const questionGameIdIndex = index(
  "question_game_id_idx",
  Question.gameId
);
