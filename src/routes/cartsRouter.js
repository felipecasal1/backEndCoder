import express from "express";
const router = express.Router();
import cartsManager from "../carts/cartsManager.js";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
//traer todos los carritos
router.get("/api/carts", async (req, res) => {
    await cartsManager.addCart();
    res.send(await cartsManager.getCarts());
});

//agregar un producto al carrito
router.post("/api/carts/:cid/products/:pid", async (req, res) => {
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

//traer un carrito por id
router.get("/api/carts/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);

    if (cartsManager.getCartById(cid)) {
        res.json(await cartsManager.getCartById(cid));
    } else {
        res.status(404).json({ error: "Carrito no encontrado" });
        res.send("carrito no encontrado")
    }
});


const cartsPath = path.join(
    dirname(fileURLToPath(import.meta.url)),
    "./carts/carts.json"
);    



export default router;