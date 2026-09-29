// src/features/category/server/category-service.ts
import createError from "http-errors";
import type { CategoryRepository } from "./category-repository";
import type {
  CategoryId,
  CategoryResponse,
  CategoryQuery,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../category-types";

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(data: CreateCategoryInput): Promise<CategoryResponse> {
    const existingCategory = await this.categoryRepository.findBySlug(data.slug);
    if (existingCategory) {
      throw createError.Conflict(`Category with slug '${data.slug}' already exists.`);
    }

    return await this.categoryRepository.create(data);
  }

  async getCategoryById(id: CategoryId): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw createError.NotFound(`Category with ID '${id}' not found.`);
    }

    return category;
  }

  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw createError.NotFound(`Category with slug '${slug}' not found.`);
    }

    return category;
  }

  async updateCategory(
    id: CategoryId,
    data: UpdateCategoryInput
  ): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw createError.NotFound(`Category with ID '${id}' not found.`);
    }

    if (data.slug && data.slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findBySlug(data.slug);
      if (existingSlug) {
        throw createError.Conflict(`Category with slug '${data.slug}' already exists.`);
      }
    }

    const updated = await this.categoryRepository.updateById(id, data);
    if (!updated) {
      throw createError.InternalServerError(`Failed to update category with ID '${id}'.`);
    }

    return updated;
  }

  async deleteCategory(id: CategoryId): Promise<boolean> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw createError.NotFound(`Category with ID '${id}' not found.`);
    }

    return await this.categoryRepository.deleteById(id);
  }

  async listCategories(query: CategoryQuery) {
    return await this.categoryRepository.list(query);
  }
}