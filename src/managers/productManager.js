
import fs from "node:fs/promises";
import path, { dirname } from "node:path";
import productModel from "../models/product.model.js";

class ProductManager {



    // Traer productos desde MongoDB

    //Agregar productos desde mongoDB
        async addProduct(product) {
        try {
            // Crea un nuevo documento
            const nuevoProducto = new productModel(product);
            
            await nuevoProducto.save();
            console.log("Se añadió un nuevo producto");
            return nuevoProducto;
        } catch (error) {
            console.error("Error agregando un producto:", error);
        }
    }



    // // acceder a un producto por id
    // async getProductById(id) {
    //     const products = await this.getProducts();
    //     const product = products.find((p) => p.id === id);
    //     return product;
    // }


   // Agregar un producto a MongoDB

    // //actualizar un producto por id
    // async updateProduct(id, updatedProduct) {
    //     const {
    //         title,
    //         description,
    //         code,
    //         price,
    //         status,
    //         stock,
    //         category,
    //         thumbnail,
    //     } = updatedProduct;
    //     const products = await this.getProducts();
    //     const productIndex = products.findIndex((product) => product.id == id);
    //     if (productIndex !== -1) {
    //         products[productIndex] = { ...products[productIndex], ...updatedProduct };
    //         await this.writeDocument(products);
    //         console.log("se actualizo el producto")
    //     }
    // }


    // async deleteProduct(id) {
    //     const products = await this.getProducts();
    //     const productIndex = products.findIndex((product) => product.id == id);
    //     if (productIndex !== -1) {
    //         products.splice(productIndex, 1);
    //         await this.writeDocument(products);
    //         console.log("se elimino el producto")
    //     }
    // }




}


export default ProductManager;