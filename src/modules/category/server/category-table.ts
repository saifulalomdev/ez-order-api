// src/features/category/server/category-table.ts
import { generateUnixMSTimestamp } from "@/utils/generate-timestamp";
import { generateUUID } from "@/utils/generate-uuid";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const categoryTable = sqliteTable("category", {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    createdAt: integer("created_at")
        .notNull()
        .$defaultFn(generateUnixMSTimestamp),
    updatedAt: integer("updated_at")
        .notNull()
        .$defaultFn(generateUnixMSTimestamp)
        .$onUpdateFn(generateUnixMSTimestamp),
});