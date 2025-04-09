import express from "express";

import ProductManager from "./product/productManager.js";

const app = express()
const PORT = 8080;




app.use(express.json());



//pagina principal
app.get("/api", (req, res) => {
    res.send("bienvenido a la api")
})

//acceder a la lista de productos
app.get("/api/products", async (req, res) => {
    res.send(await ProductManager.getProducts())
})

//acceder a un producto por id
app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const product = await ProductManager.getProductById(id)
    if (product) {
        res.send(product)
    } else {
        res.status(404).send("producto no encontrado")
    }
})

//añadir un producto
app.post("/api/products", async (req, res) => {
    const product = req.body

    if (!product.stock || !product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.thumbnail) {
        return res.status(400).send("falta un campo")
    } else {
        await ProductManager.addProduct(product)
        res.send("producto añadido")

    }
})


//actualizar un producto por id
app.put("/api/products/:id", async (req, res) => {
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
app.delete("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const product = await ProductManager.getProductById(id)
    if (product) {
        await ProductManager.deleteProduct(id)
        res.send("producto eliminado")
    } else {
        res.status(404).send("producto no encontrado")
    }
})




app.listen(PORT, () => {
    console.log("servidor escuchando en el puerto " + PORT)
})