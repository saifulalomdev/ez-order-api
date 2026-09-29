// src/features/category/server/__tests__/category-repository.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { categoryTable } from "../category-table";
import { CategoryRepository } from "../category-repository";
import { db } from "@/db/client";

describe("CategoryRepository Integration Tests", () => {
  let repository: CategoryRepository;

  beforeEach(async () => {
    await db.delete(categoryTable);
    repository = new CategoryRepository(db);
  });

  it("should create a new category", async () => {
    const newCategory = {
      name: "Electronics",
      slug: "electronics",
      description: "Gadgets and devices",
    };

    const result = await repository.create(newCategory);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe("Electronics");
    expect(result.slug).toBe("electronics");
  });

  it("should find a category by ID", async () => {
    const created = await repository.create({
      name: "Books",
      slug: "books",
    });

    const found = await repository.findById(created.id);

    expect(found).toBeDefined();
    expect(found?.name).toBe("Books");
  });

  it("should return undefined if category ID does not exist", async () => {
    const found = await repository.findById("non_existing_id");
    expect(found).toBeUndefined();
  });

  it("should find a category by slug", async () => {
    const created = await repository.create({
      name: "Clothing",
      slug: "clothing",
    });

    const found = await repository.findBySlug("clothing");

    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });

  it("should update a category by ID", async () => {
    const created = await repository.create({
      name: "Home",
      slug: "home",
    });

    const updated = await repository.updateById(created.id, {
      name: "Home & Kitchen",
    });

    expect(updated).toBeDefined();
    expect(updated?.name).toBe("Home & Kitchen");
  });

  it("should delete a category by ID", async () => {
    const created = await repository.create({
      name: "Toys",
      slug: "toys",
    });

    const deleted = await repository.deleteById(created.id);
    expect(deleted).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeUndefined();
  });

  it("should list categories with correct pagination math", async () => {
    await repository.create({ name: "Cat 1", slug: "cat-1" });
    await repository.create({ name: "Cat 2", slug: "cat-2" });
    await repository.create({ name: "Cat 3", slug: "cat-3" });

    const result = await repository.list({
      page: 1,
      limit: 2,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    expect(result.items.length).toBe(2);
    expect(result.pagination.total).toBe(3);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(2);
    expect(result.pagination.totalPages).toBe(2);
  });
});