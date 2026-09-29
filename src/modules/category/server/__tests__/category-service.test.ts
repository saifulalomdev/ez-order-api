// src/features/category/server/__tests__/category-service.test.ts
import { describe, it, expect, beforeEach, vi, type Mocked } from "vitest";
import { CategoryService } from "../category-service";
import type { CategoryRepository } from "../category-repository";
import type { CategoryResponse } from "../../category-types";

describe("CategoryService Unit Tests", () => {
  let service: CategoryService;
  let mockRepository: Mocked<CategoryRepository>;

  const mockCategory: CategoryResponse = {
    id: "cat_123",
    name: "Tech Posts",
    slug: "tech-posts",
    description: "Technology related posts",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      updateById: vi.fn(),
      deleteById: vi.fn(),
      list: vi.fn(),
    } as unknown as Mocked<CategoryRepository>;

    service = new CategoryService(mockRepository);
  });

  describe("createCategory", () => {
    it("should successfully create a category if slug is unique", async () => {
      mockRepository.findBySlug.mockResolvedValue(undefined);
      mockRepository.create.mockResolvedValue(mockCategory);

      const input = { name: "Tech Posts", slug: "tech-posts" };
      const result = await service.createCategory(input);

      expect(mockRepository.findBySlug).toHaveBeenCalledWith("tech-posts");
      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockCategory);
    });

    it("should throw an error if category slug already exists", async () => {
      mockRepository.findBySlug.mockResolvedValue(mockCategory);

      const input = { name: "Tech Posts", slug: "tech-posts" };

      await expect(service.createCategory(input)).rejects.toThrow(
        "Category with slug 'tech-posts' already exists."
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("getCategoryById", () => {
    it("should return category when found by ID", async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);

      const result = await service.getCategoryById("cat_123");

      expect(mockRepository.findById).toHaveBeenCalledWith("cat_123");
      expect(result).toEqual(mockCategory);
    });

    it("should throw an error when category ID is not found", async () => {
      mockRepository.findById.mockResolvedValue(undefined);

      await expect(service.getCategoryById("non_existent")).rejects.toThrow(
        "Category with ID 'non_existent' not found."
      );
    });
  });

  describe("getCategoryBySlug", () => {
    it("should return category when found by slug", async () => {
      mockRepository.findBySlug.mockResolvedValue(mockCategory);

      const result = await service.getCategoryBySlug("tech-posts");

      expect(mockRepository.findBySlug).toHaveBeenCalledWith("tech-posts");
      expect(result).toEqual(mockCategory);
    });

    it("should throw an error when category slug is not found", async () => {
      mockRepository.findBySlug.mockResolvedValue(undefined);

      await expect(service.getCategoryBySlug("non_existent")).rejects.toThrow(
        "Category with slug 'non_existent' not found."
      );
    });
  });

  describe("updateCategory", () => {
    it("should update category successfully when keeping same slug", async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);
      mockRepository.updateById.mockResolvedValue({
        ...mockCategory,
        name: "Updated Name",
      });

      const updateData = { name: "Updated Name", slug: "tech-posts" };
      const result = await service.updateCategory("cat_123", updateData);

      expect(mockRepository.findById).toHaveBeenCalledWith("cat_123");
      expect(mockRepository.findBySlug).not.toHaveBeenCalled();
      expect(mockRepository.updateById).toHaveBeenCalledWith(
        "cat_123",
        updateData
      );
      expect(result.name).toBe("Updated Name");
    });

    it("should update category successfully when changing to a unique new slug", async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);
      mockRepository.findBySlug.mockResolvedValue(undefined);
      mockRepository.updateById.mockResolvedValue({
        ...mockCategory,
        slug: "new-slug",
      });

      const updateData = { slug: "new-slug" };
      const result = await service.updateCategory("cat_123", updateData);

      expect(mockRepository.findBySlug).toHaveBeenCalledWith("new-slug");
      expect(mockRepository.updateById).toHaveBeenCalledWith(
        "cat_123",
        updateData
      );
      expect(result.slug).toBe("new-slug");
    });

    it("should throw error if updated slug already exists for another category", async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);
      mockRepository.findBySlug.mockResolvedValue({
        ...mockCategory,
        id: "other_cat",
        slug: "existing-slug",
      });

      const updateData = { slug: "existing-slug" };

      await expect(
        service.updateCategory("cat_123", updateData)
      ).rejects.toThrow("Category with slug 'existing-slug' already exists.");

      expect(mockRepository.updateById).not.toHaveBeenCalled();
    });

    it("should throw error if category to update is not found", async () => {
      mockRepository.findById.mockResolvedValue(undefined);

      await expect(
        service.updateCategory("non_existent", { name: "New Name" })
      ).rejects.toThrow("Category with ID 'non_existent' not found.");
    });
  });

  describe("deleteCategory", () => {
    it("should delete category successfully", async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);
      mockRepository.deleteById.mockResolvedValue(true);

      const result = await service.deleteCategory("cat_123");

      expect(mockRepository.findById).toHaveBeenCalledWith("cat_123");
      expect(mockRepository.deleteById).toHaveBeenCalledWith("cat_123");
      expect(result).toBe(true);
    });

    it("should throw error if category to delete does not exist", async () => {
      mockRepository.findById.mockResolvedValue(undefined);

      await expect(service.deleteCategory("non_existent")).rejects.toThrow(
        "Category with ID 'non_existent' not found."
      );
      expect(mockRepository.deleteById).not.toHaveBeenCalled();
    });
  });

  describe("listCategories", () => {
    it("should call repository list with provided parameters", async () => {
      const mockListResult = {
        items: [mockCategory],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      mockRepository.list.mockResolvedValue(mockListResult);

      const query = {
        page: 1,
        limit: 10,
        sortBy: "createdAt" as const,
        sortOrder: "desc" as const,
      };
      const result = await service.listCategories(query);

      expect(mockRepository.list).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockListResult);
    });
  });
});