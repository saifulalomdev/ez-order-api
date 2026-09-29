// @ts-ignore
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
    test: {
        projects: [
            {
                resolve: {
                    tsconfigPaths: true
                },
                plugins: [
                    cloudflareTest(async () => {
                        const migrationsPath = path.join(import.meta.dirname, "migrations");
                        const migrations = await readD1Migrations(migrationsPath);

                        return {
                            main: "./tests/test-worker.ts",
                            wrangler: { configPath: "./wrangler.jsonc" },
                            miniflare: {
                                bindings: {
                                    TEST_MIGRATIONS: migrations,
                                    R2_ACCOUNT_ID: "mock-account-id",
                                    R2_ACCESS_KEY_ID: "mock-access-key-id",
                                    R2_SECRET_ACCESS_KEY: "mock-secret-access-key",
                                    R2_BUCKET_NAME: "mock-bucket",
                                },
                            },
                        };
                    }),
                ],
                test: {
                    name: "server-workers",
                    globals: true,
                    include: ["**/__tests__/**/*.ts"],
                    setupFiles: ["./tests/helpers/apply-migrations.ts"],

                },
            },
            {
                resolve: {
                    tsconfigPaths: true
                },
                test: {
                    name: "client-ui",
                    globals: true,
                    include: ["**/__tests__/**/*.tsx"],
                    environment: "jsdom",
                },
            },
        ],
    },
});