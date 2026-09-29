import { z } from "@hono/zod-openapi";

// Pagination Metadata Schema
export const paginationMetaSchema = z.object({
  page: z.number().openapi({ example: 1 }),
  limit: z.number().openapi({ example: 10 }),
  total: z.number().openapi({ example: 50 }),
  totalPages: z.number().openapi({ example: 5 }),
}).openapi("PaginationMeta");

// Standard Success Response Wrapper
export function createSuccessSchema<T extends z.ZodType>(itemSchema: T, exampleMessage = "Operation successful") {
  return z.object({
    success: z.literal(true).openapi({ example: true }),
    message: z.string().openapi({ example: exampleMessage }),
    data: itemSchema,
  });
}

// Standard Paginated Response Wrapper
export function createPaginatedSchema<T extends z.ZodType>(itemSchema: T, exampleMessage = "List retrieved successfully") {
  return z.object({
    success: z.literal(true).openapi({ example: true }),
    message: z.string().openapi({ example: exampleMessage }),
    data: z.object({
      items: z.array(itemSchema),
      pagination: paginationMetaSchema,
    }),
  });
}

// Standard Message-Only Success Schema (e.g. for Delete operations)
export const successMessageSchema = z.object({
  success: z.literal(true).openapi({ example: true }),
  message: z.string().openapi({ example: "Operation completed successfully." }),
  data: z.null().default(null).openapi({ example: null }),
}).openapi("SuccessMessageResponse");

// Standard Error Response Schema
export const standardErrorSchema = z.object({
  success: z.literal(false).openapi({ example: false }),
  message: z.string().openapi({ example: "An error occurred during execution." }),
  data: z.null().default(null).openapi({ example: null }),
}).openapi("StandardErrorResponse");