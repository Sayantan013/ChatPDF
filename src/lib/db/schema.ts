import {
  integer,
  pgTable,
  text,
  serial,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["system", "user"]);

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  // filekey helps retrieve pdf file from AWS S3 bucket
  fileKey: text("file_key").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: roleEnum("role").notNull(),
});
