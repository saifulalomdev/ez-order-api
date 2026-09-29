import { generateUUID } from "@/utils";
import { generateUnixMSTimestamp } from "@/utils";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const uploadTable = sqliteTable("uploadTable", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileKey: text("file_key").notNull(),
  mimeType: text("mime_type"),
  size: integer("size"),
  createdAt: integer("created_at").notNull().$defaultFn(generateUnixMSTimestamp),
});