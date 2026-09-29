import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";
import { categoryTable } from "./server/category-table";
import {
    createSuccessSchema,
    createPaginatedSchema,
} from "@/shared/schema/common";

// Field Schemas
export const categoryIdSchema = z
    .string({ message: "Category ID is required" })
    .trim()
    .min(1, "Category ID cannot be empty")
    .openapi("CategoryId");

export const categorySlugParamSchema = z
    .string({ message: "Slug parameter is required" })
    .trim()
    .min(1, "Slug cannot be empty")
    .openapi("CategorySlugParam");

// Route Parameter Schemas
export const categoryIdParamsSchema = z.object({
    id: categoryIdSchema,
}).openapi("CategoryIdParams");

export const categorySlugParamsSchema = z.object({
    slug: categorySlugParamSchema,
}).openapi("CategorySlugParams");

// Base Insert Schema
export const baseCategorySchema = createInsertSchema(categoryTable, {
    id: categoryIdSchema,
    name: z.string().trim().min(2).max(50),
    slug: z.string().trim().toLowerCase().min(2).max(60),
    description: z.string().trim().max(200).optional().nullable().or(z.literal("")),
});

// Select Response Schema
export const categoryResponseSchema = createSelectSchema(categoryTable, {
    description: z.string().nullable(),
}).openapi("CategoryResponse");

// Input Mutation Schemas
export const createCategorySchema = baseCategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).openapi("CategoryInsert");

export const updateCategorySchema = baseCategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).partial().openapi("CategoryUpdate");

export const categoryQuerySchema = z.object({
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
}).openapi("CategoryQuery");

// Unified Response Schemas (Single Source of Truth)
export const singleCategoryResponseSchema = createSuccessSchema(
    categoryResponseSchema,
    "Category processed successfully"
).openapi("SingleCategoryResponse");

export const paginatedCategoryResponseSchema = createPaginatedSchema(
    categoryResponseSchema,
    "Categories retrieved successfully"
).openapi("PaginatedCategoryResponse");

export const deleteCategoryResponseSchema = createSuccessSchema(
    z.null(),
    "Category deleted successfully"
).openapi("DeleteCategoryResponse");