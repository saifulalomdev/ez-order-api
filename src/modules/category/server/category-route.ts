import { createRoute } from "@hono/zod-openapi";
import {
    createCategorySchema,
    updateCategorySchema,
    categoryQuerySchema,
    categoryIdParamsSchema,
    categorySlugParamsSchema,
    singleCategoryResponseSchema,
    paginatedCategoryResponseSchema,
    deleteCategoryResponseSchema,
} from "../category-schema";
import { jsonRequestBody, jsonContent } from "@/lib/openapi-helpers";
import { requireAdmin } from "@/modules/auth/server/auth-middleware";
import { standardErrorSchema } from "@/shared/schema/common";

// CREATE CATEGORY
export const createCategoryRoute = createRoute({
    method: "post",
    path: "/",
    tags: ["Category"],
    middleware: [requireAdmin],
    request: {
        body: jsonRequestBody(createCategorySchema),
    },
    responses: {
        201: jsonContent(singleCategoryResponseSchema, "Category created successfully."),
        409: jsonContent(standardErrorSchema, "Category name or slug already exists."),
    },
});

// LIST CATEGORIES
export const listCategoriesRoute = createRoute({
    method: "get",
    path: "/",
    tags: ["Category"],
    request: {
        query: categoryQuerySchema,
    },
    responses: {
        200: jsonContent(paginatedCategoryResponseSchema, "Categories retrieved successfully."),
    },
});

// GET CATEGORY BY ID
export const getCategoryByIdRoute = createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Category"],
    request: {
        params: categoryIdParamsSchema,
    },
    responses: {
        200: jsonContent(singleCategoryResponseSchema, "Category found."),
        404: jsonContent(standardErrorSchema, "Category not found."),
    },
});

// GET CATEGORY BY SLUG
export const getCategoryBySlugRoute = createRoute({
    method: "get",
    path: "/slug/{slug}",
    tags: ["Category"],
    request: {
        params: categorySlugParamsSchema,
    },
    responses: {
        200: jsonContent(singleCategoryResponseSchema, "Category found."),
        404: jsonContent(standardErrorSchema, "Category not found."),
    },
});

// UPDATE CATEGORY
export const updateCategoryRoute = createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Category"],
    middleware: [requireAdmin],
    request: {
        params: categoryIdParamsSchema,
        body: jsonRequestBody(updateCategorySchema),
    },
    responses: {
        200: jsonContent(singleCategoryResponseSchema, "Category updated successfully."),
        409: jsonContent(standardErrorSchema, "Category slug already exists."),
        404: jsonContent(standardErrorSchema, "Category not found."),
    },
});

// DELETE CATEGORY
export const deleteCategoryRoute = createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Category"],
    middleware: [requireAdmin],
    request: {
        params: categoryIdParamsSchema,
    },
    responses: {
        200: jsonContent(
            deleteCategoryResponseSchema,
            "Category deleted successfully."
        ),
        404: jsonContent(standardErrorSchema, "Category not found."),
    },
});