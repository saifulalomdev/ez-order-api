// src/utils/openapi-helpers.ts
import type { ZodType } from "zod";

export const jsonContent = <T extends ZodType>(
  schema: T,
  description?: string
) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    ...(description ? { description } : {}),
  };
};

export const jsonRequestBody = <T extends ZodType>(schema: T) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    required: true,
  };
};