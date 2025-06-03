import e from "express";
import fs from "node:fs/promises";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

class ProductManager {
    constructor(filePath) {
        this.path = path.resolve(filePath);
    }
;

    async readDocument() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error leyendo los documentos", error);
            return null;
        }
    }

    async writeDocument(data) {
        const dataString = JSON.stringify(data, null, 2);
        try {
            await fs.writeFile(this.path, dataString);
            console.log("Documento escrito correctamente");
        } catch {
            console.error({ error: "Error writing products file" });
        }
    }


    // traer el listado de productos
    async getProducts() {
        try {
            const data = await this.readDocument()
            console.log("se leccionaron los productos");
            return data;
        } catch (error) {
            console.error("Error reading products file:", error);
            return [];
        }
    }


    // acceder a un producto por id
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find((p) => p.id === id);
        return product;
    }

    //creacion de un producto
    async addProduct(product) {
        const {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        } = product;

        const products = await this.getProducts();
        const newProduct = {
            id: products.length + 1,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        };
        products.push(newProduct);
        await this.writeDocument(products);
        console.log("se añadio un nuevo producto")
    }

    //actualizar un producto por id
    async updateProduct(id, updatedProduct) {
        const {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        } = updatedProduct;
        const products = await this.getProducts();
        const productIndex = products.findIndex((product) => product.id == id);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...updatedProduct };
            await this.writeDocument(products);
            console.log("se actualizo el producto")
        }
    }


    async deleteProduct(id) {
        const products = await this.getProducts();
        const productIndex = products.findIndex((product) => product.id == id);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            await this.writeDocument(products);
            console.log("se elimino el producto")
        }
    }




}


export default ProductManager;