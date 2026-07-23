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
} from "drizzle-orm/pg-core";

// Original CourseList and Chapters schema
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
});

// Game-related schemas
export const gameTypeEnum = pgEnum("game_type", ["mcq", "open_ended"]);

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
    .references(() => Game.id),
  options: json("options"),
  percentageCorrect: numeric("percentageCorrect", { precision: 4, scale: 2 }),
  isCorrect: boolean("isCorrect"),
  questionType: gameTypeEnum("questionType").notNull(),
  userAnswer: varchar("userAnswer", { length: 1000 }),
});

// Add indexes
export const gameUserIdIndex = index("game_user_id_idx", game.userId);
export const questionGameIdIndex = index(
  "question_game_id_idx",
  Question.gameId
);
