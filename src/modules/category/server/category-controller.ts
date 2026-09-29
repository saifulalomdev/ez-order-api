// src/features/category/server/category-controller.ts
import type { RouteHandler } from "@hono/zod-openapi";
import type {
  createCategoryRoute,
  listCategoriesRoute,
  getCategoryByIdRoute,
  getCategoryBySlugRoute,
  updateCategoryRoute,
  deleteCategoryRoute,
} from "./category-route";
import { CategoryRepository } from "./category-repository";
import { CategoryService } from "./category-service";
import { db } from "@/db/client";

export const handleCreateCategory: RouteHandler<
  typeof createCategoryRoute,
  { Bindings: Env }
> = async (c) => {
  const validatedBody = c.req.valid("json");

  const categoryRepository = new CategoryRepository(db);
  const categoryService = new CategoryService(categoryRepository);

  const newCategory = await categoryService.createCategory(validatedBody);

  return c.json(
    {
      success: true,
      message: "Category created successfully",
      data: newCategory,
    },
    201
  );
};

export const handleListCategories: RouteHandler<
  typeof listCategoriesRoute,
  { Bindings: Env }
> = async (c) => {
  const query = c.req.valid("query");

  const categoryRepository = new CategoryRepository(db);
  const categoryService = new CategoryService(categoryRepository);

  const result = await categoryService.listCategories(query);

  return c.json(
    {
      success: true,
      message: "Categories fetched successfully",
      data: {
        items: result.items,
        pagination: result.pagination,
      },
    },
    200
  );
};

export const handleGetCategoryById: RouteHandler<
  typeof getCategoryByIdRoute,
  { Bindings: Env }
> = async (c) => {
  const { id } = c.req.valid("param");

  const categoryRepository = new CategoryRepository(db);
  const categoryService = new CategoryService(categoryRepository);

  const category = await categoryService.getCategoryById(id);

  return c.json(
    {
      success: true,
      message: "Category fetched successfully",
      data: category,
    },
    200
  );
};

export const handleGetCategoryBySlug: RouteHandler<
  typeof getCategoryBySlugRoute,
  { Bindings: Env }
> = async (c) => {
  const { slug } = c.req.valid("param");

  const categoryRepository = new CategoryRepository(db);
  const categoryService = new CategoryService(categoryRepository);

  const category = await categoryService.getCategoryBySlug(slug);

  return c.json(
    {
      success: true,
      message: "Category fetched successfully",
      data: category,
    },
    200
  );
};

export const handleUpdateCategory: RouteHandler<
  typeof updateCategoryRoute,
  { Bindings: Env }
> = async (c) => {
  const { id } = c.req.valid("param");
  const validatedBody = c.req.valid("json");

  const categoryRepository = new CategoryRepository(db);
  const categoryService = new CategoryService(categoryRepository);

  const updated = await categoryService.updateCategory(id, validatedBody);

  return c.json(
    {
      success: true,
      message: "Category updated successfully",
      data: updated,
    },
    200
  );
};

export const handleDeleteCategory: RouteHandler<
  typeof deleteCategoryRoute,
  { Bindings: Env }
> = async (c) => {
  const { id } = c.req.valid("param");

  const categoryRepository = new CategoryRepository(db);
  const categoryService = new CategoryService(categoryRepository);

  await categoryService.deleteCategory(id);

  return c.json(
    {
      success: true,
      message: "Category deleted successfully",
      data: null,
    },
    200
  );
};