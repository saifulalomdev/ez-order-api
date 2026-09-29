// src/lib/error-handler.ts
import type { ContentfulStatusCode } from "hono/utils/http-status"; 
import type { ErrorHandler } from "hono";
import { isHttpError } from "http-errors";
import { env } from "cloudflare:workers";

export const errorHandler: ErrorHandler = (err: any, c) => {
    const { NODE_ENV } = env;

    // Suppress error logging during tests
    if (NODE_ENV === "production") {
        console.error(err);
    }

    if (isHttpError(err)) {
        return c.json(
            { success: false, message: err.message },
            err.statusCode as ContentfulStatusCode
        );
    }

    return c.json({ success: false, message: "Internal Server Error" }, 500);
};