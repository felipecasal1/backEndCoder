import ProductModel from "../models/product.model.js";

import mongoosePaginate from "mongoose-paginate-v2";

productSchema.plugin(mongoosePaginate);

export class ProductDAO {
    static async getProducts({ limit = 10, page = 1, query, sort }) {
        const filter = {};

        if (query) {
            if (query === "available") {
                filter.status = true;
            } else {
                filter.category = query;
            }
        }

        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

        const result = await ProductModel.paginate(filter, {
            limit,
            page,
            sort: sortOption,
            lean: true
        });

        return {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
        };
    }
}
