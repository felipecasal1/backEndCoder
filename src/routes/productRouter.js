import express from "express";
const router = express.Router();
import ProductManager from "../product/productManager.js";

//acceder a la lista de productos

router.get("/api/products", async (req, res) => {

    let products = await ProductManager.getProducts()
    res.render("index", { products });

})

//acceder a un producto por id
router.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const product = await ProductManager.getProductById(id)
    if (product) {
        res.send(product)
    } else {
        res.status(404).send("producto no encontrado")
    }
})

//añadir un producto
router.post("/api/products", async (req, res) => {
    const product = req.body
    if (!product.stock || !product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.thumbnail) {
        return res.status(400).send("falta un campo")
    } else {
        await ProductManager.addProduct(product)
        res.send("producto añadido")
    }
})
//actualizar un producto por id
router.put("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const updatedProduct = req.body
    const product = await ProductManager.getProductById(id)
    if (product) {
        await ProductManager.updateProduct(id, updatedProduct)
        res.send("producto actualizado")
    } else {
        res.status(404).send("producto no encontrado")
    }
})

//eliminar un producto por id
router.delete("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const product = await ProductManager.getProductById(id)
    if (product) {
        await ProductManager.deleteProduct(id)
        res.send("producto eliminado")
    } else {
        res.status(404).send("producto no encontrado")
    }
})





export default router;