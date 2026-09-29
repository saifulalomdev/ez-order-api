// src/features/category/server/category-repository.ts
import { eq, count, like, asc, desc, SQL } from "drizzle-orm";
import { categoryTable } from "./category-table";
import type { DBInstance } from "@/db/client";
import type {
    CategoryId,
    CategoryResponse,
    CategoryQuery,
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../category-types";

export class CategoryRepository {
    constructor(private db: DBInstance) { }

    async create(data: CreateCategoryInput): Promise<CategoryResponse> {
        const [result] = await this.db
            .insert(categoryTable)
            .values(data)
            .returning();
        return result;
    }

    async findById(id: CategoryId): Promise<CategoryResponse | undefined> {
        const [result] = await this.db
            .select()
            .from(categoryTable)
            .where(eq(categoryTable.id, id));
        return result;
    }

    async findBySlug(slug: string): Promise<CategoryResponse | undefined> {
        const [result] = await this.db
            .select()
            .from(categoryTable)
            .where(eq(categoryTable.slug, slug));
        return result;
    }

    async updateById(
        id: CategoryId,
        data: UpdateCategoryInput
    ): Promise<CategoryResponse | undefined> {
        const [result] = await this.db
            .update(categoryTable)
            .set(data)
            .where(eq(categoryTable.id, id))
            .returning();
        return result;
    }

    async deleteById(id: CategoryId): Promise<boolean> {
        const result = await this.db
            .delete(categoryTable)
            .where(eq(categoryTable.id, id))
            .returning();
        return result.length > 0;
    }

    async list(query: CategoryQuery) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const offset = (page - 1) * limit;

        // Search filter
        const whereClause: SQL | undefined = search
            ? like(categoryTable.name, `%${search}%`)
            : undefined;

        // Explicitly map sortBy string to Drizzle column schema
        const getSortColumn = (key: CategoryQuery["sortBy"]) => {
            switch (key) {
                case "name":
                    return categoryTable.name;
                case "updatedAt":
                    return categoryTable.updatedAt;
                case "createdAt":
                default:
                    return categoryTable.createdAt;
            }
        };

        const sortColumn = getSortColumn(sortBy);
        const orderByClause =
            sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

        const [data, [{ total }]] = await Promise.all([
            this.db
                .select()
                .from(categoryTable)
                .where(whereClause)
                .orderBy(orderByClause)
                .limit(limit)
                .offset(offset),
            this.db
                .select({ total: count() })
                .from(categoryTable)
                .where(whereClause),
        ]);

        return {
            items: data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
}