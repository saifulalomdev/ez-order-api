// src/features/category/server/__tests__/category-app.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { app } from "@/server/api";
import { categoryTable } from "../category-table";
import { db } from "@/db/client";

const testEnv = { NODE_ENV: "test" };
const authHeaders = {
  "Content-Type": "application/json",
  "x-bypass-admin": "true",
};

describe("Category App Route Integration Tests", () => {
  beforeEach(async () => {
    await db.delete(categoryTable);
  });

  describe("POST /api/categories", () => {
    it("should return error if slug already exists", async () => {
      // First insert
      await app.request(
        "/api/categories",
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ name: "Technology", slug: "technology" }),
        },
        testEnv
      );

      // Duplicate insert
      const response: any = await app.request(
        "/api/categories",
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ name: "Tech Copy", slug: "technology" }),
        },
        testEnv
      );

      expect(response.status).toBe(409);
    });
  });

  describe("GET /api/categories/{id}", () => {
    it("should return 404 when ID does not exist", async () => {
      const response: any = await app.request(
        "/api/categories/non-existent-id",
        {},
        testEnv
      );

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/categories/slug/{slug}", () => {
    it("should return 404 when slug does not exist", async () => {
      const response: any = await app.request(
        "/api/categories/slug/not-found-slug",
        {},
        testEnv
      );

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/categories/{id}", () => {
    it("should return 404 when deleting non-existent category", async () => {
      const response: any = await app.request(
        "/api/categories/invalid-id",
        {
          method: "DELETE",
          headers: { "x-bypass-admin": "true" },
        },
        testEnv
      );

      expect(response.status).toBe(404);
    });
  });
});