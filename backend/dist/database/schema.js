"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsons = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.varchar)("username", { length: 255 }).notNull(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
});
exports.jsons = (0, pg_core_1.pgTable)("jsons", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    input: (0, pg_core_1.json)("input"),
    output: (0, pg_core_1.json)("output"),
    userId: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
});
