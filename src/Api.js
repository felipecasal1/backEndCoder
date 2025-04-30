import http from "node:http";
import express from "express";
import hbs from "express-handlebars";
import fs from "node:fs/promises";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import ProductManager from "./product/productManager.js";
import cartsManager from "./carts/cartsManager.js";
import e from "express";


const app = express()
const PORT = 8080;
const httpServer = http


app.use(express.json());

app.engine("handlebars", hbs.engine())

app.set("views", import.meta.dirname + "/views");
app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars"); // Cambia "views engine" por "view engine"
app.set("views", path.join(dirname(fileURLToPath(import.meta.url)), "/views")); // Configura correctamente la ruta de las vistas
app.use(express.static(import.meta.dirname + "/views"));



const cartsPath = path.join(
    dirname(fileURLToPath(import.meta.url)),
    "./carts/carts.json"
);



//pagina principal
app.get("/api", (req, res) => {
    res.send("bienvenido a la api")
})

//acceder a la lista de productos
app.get("/api/products", async (req, res) => {
    
    let products = await ProductManager.getProducts()
    res.render("index", { products });

})

app.get("/api/info ", async (req, res) => {

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





// ----------------- crea un crrito nuevo -----------------------

app.get("/api/carts", async (req, res) => {
    await cartsManager.addCart();
    res.send(await cartsManager.getCarts());
});

//------------------ agrega un producto al carrito --------------------
app.post("/api/carts/:cid/products/:pid", async (req, res) => {
    let objCart = [];
    objCart.push(await cartsManager.getCarts());
    let objProducts = [];
    objProducts.push(await ProductManager.getProducts());
    
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const newItem = {
        id: pid,
        quantity: 1,
        title: objProducts[0].find((product) => product.id === pid).title,
        description: objProducts[0].find((product) => product.id === pid).description,
        code: objProducts[0].find((product) => product.id === pid).code,
        price: objProducts[0].find((product) => product.id === pid).price,
        status: objProducts[0].find((product) => product.id === pid).status,
        stock: objProducts[0].find((product) => product.id === pid).stock,
        thumbnail: objProducts[0].find((product) => product.id === pid).thumbnail,  
    };
    
    const cart = objCart[0].find((cart) => cart.id === cid);

    if (!cart) {
        res.status(404).json({ error: "Carrito no encontrado" });
        res.send("carrito no encontrado")
    } else {
        const product = objProducts[0].find((product) => product.id === pid);
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
        } else {
            const item = cart.products.find((item) => item.id === pid);
            if (item) {
                item.quantity++;
            } else {
                cart.products.push(newItem);
            }
            await fs.writeFile(cartsPath, JSON.stringify(objCart[0], null, 2));
            res.json(cart);
        }
    }
});


//------------------- Carrito -------------------

//----------------------- acceder al carrito por ID ------------------------
app.get("/api/carts/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);

    if (cartsManager.getCartById(cid)) {
        res.json(await cartsManager.getCartById(cid));
    } else {
        res.status(404).json({ error: "Carrito no encontrado" });
        res.send("carrito no encontrado")
    }
});



app.listen(PORT, () => {
    console.log("servidor escuchando en el puerto " + PORT)
})