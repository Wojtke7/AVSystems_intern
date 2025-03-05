import { pgTable, serial, varchar, uuid, json, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});


export const jsons = pgTable("jsons", {
  id: uuid("id").defaultRandom().primaryKey(),
  input: json("input"),
  output: json("output"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: varchar("file_name", { length: 255 }).notNull(),
});