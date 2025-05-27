import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = {};
        if (query) {
            if (query === "true" || query === "false") {
                filter.status = query === "true";
            } else {
                filter.category = query;
            }
        }

        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOption,
            lean: true
        };

        const result = await Product.paginate(filter, options);

        res.json({
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
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ message: "Producto creado", product: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
        res.json({ message: "Producto actualizado", product: updated });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.pid);
        if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
