// src/modules/upload/server/upload-repository.ts
import { eq } from "drizzle-orm";
import { uploadTable } from "./upload-table";
import type { DBInstance } from "@/db/client";

export type NewUpload = typeof uploadTable.$inferInsert;
export type SelectUpload = typeof uploadTable.$inferSelect;

export const uploadRepository = {
  async create(db: DBInstance, data: NewUpload): Promise<SelectUpload> {
    const [record] = await db.insert(uploadTable).values(data).returning();
    return record;
  },

  async findById(db: DBInstance, id: string): Promise<SelectUpload | null> {
    const [record] = await db.select().from(uploadTable).where(eq(uploadTable.id, id)).execute();
    return record || null;
  },
};