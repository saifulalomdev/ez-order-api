import { z } from "@hono/zod-openapi";
import {
  categoryIdSchema,
  categoryIdParamsSchema,
  categorySlugParamsSchema,
  categoryResponseSchema,
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
  singleCategoryResponseSchema,
  paginatedCategoryResponseSchema,
} from "./category-schema";

export type CategoryId = z.infer<typeof categoryIdSchema>;
export type CategoryIdParams = z.infer<typeof categoryIdParamsSchema>;
export type CategorySlugParams = z.infer<typeof categorySlugParamsSchema>;
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQuery = z.infer<typeof categoryQuerySchema>;

export type SingleCategoryResponse = z.infer<typeof singleCategoryResponseSchema>;
export type PaginatedCategoryResponse = z.infer<typeof paginatedCategoryResponseSchema>;