
import { Router } from "express";
import cartSchema from "../models/cart.model.js"
import productModel from "../models/product.model.js"
import mongoose from "mongoose";

const router = Router();

// Crear un nuevo carrito
router.post("/create", async (req, res) => {
  try {
    const newCart = await cartSchema.create({ products: [] });
    res.status(201).json({ message: "Carrito creado", cart: newCart });
  } catch (error) {
    console.error("Error creando carrito:", error);
    res.status(500).json({ error: "Error al crear carrito" });
  }
});



// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartSchema.findById(req.params.cid)
      .populate("products.product")
      .lean();
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.render("cartDetail", { cart });
  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});


// Agregar un producto a un carrito por IDs de carrito y producto
router.post("/:cid/products/:pid", async (req, res) => {

  try {
    const { cid, pid } = req.params;

    const cart = await cartSchema.findById(cid)
    console.log("se creo un carrito " ,cart)
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = await productModel.findById(pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    
    
    const productIndex = cart.products.findIndex(p => p.product.equals(pid));

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

  
    await cart.save();


    const io = req.app.get("io");
    io.emit("cartUpdated", cart);

    console.log("producto agregado al carrito. producto :", product)
  } catch (error) {
    console.error("Error agregando producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }

    const cart = await cartSchema.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(p => p.product.equals(pid));

    if (productIndex < 0) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json({ message: "Cantidad actualizada", cart });
  } catch (error) {
    console.error("Error actualizando cantidad:", error);
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartSchema.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();

     // Emite el evento con el carrito actualizado.
    const io = req.app.get("io");
    io.emit("cartUpdated", cart);



  } catch (error) {
    console.error("Error eliminando producto del carrito:", error);
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
});

// Vaciar un carrito completo
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await cartSchema.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    const io = req.app.get("io");
    io.emit("cartUpdated", cart);


  } catch (error) {
    console.error("Error vaciando carrito:", error);
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
});


export default router;