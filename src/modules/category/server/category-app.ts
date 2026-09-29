// src/features/category/server/category-app.ts
import {
  createCategoryRoute,
  listCategoriesRoute,
  getCategoryByIdRoute,
  getCategoryBySlugRoute,
  updateCategoryRoute,
  deleteCategoryRoute,
} from "./category-route";
import {
  handleCreateCategory,
  handleListCategories,
  handleGetCategoryById,
  handleGetCategoryBySlug,
  handleUpdateCategory,
  handleDeleteCategory,
} from "./category-controller";
import { errorHandler } from "@/lib/error-handler";
import { createApp } from "@/lib/create-app";

const categoryApp = createApp()
  .openapi(createCategoryRoute, handleCreateCategory)
  .openapi(listCategoriesRoute, handleListCategories)
  .openapi(getCategoryByIdRoute, handleGetCategoryById)
  .openapi(getCategoryBySlugRoute, handleGetCategoryBySlug)
  .openapi(updateCategoryRoute, handleUpdateCategory)
  .openapi(deleteCategoryRoute, handleDeleteCategory);

categoryApp.onError(errorHandler);

export { categoryApp };