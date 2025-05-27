import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import viewsRouter from "./routes/viewsRouter.js";
import productsRouter from "./routes/productRouter.js";
import Product from "./models/product.model.js";
import Cart from "./models/cart.model.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride("_method"));
server.use(cookieParser());

// Middleware para manejar carrito único con cookie cartId
server.use(async (req, res, next) => {
  if (!req.cookies.cartId) {
    const newCart = await Cart.create({ products: [] });
    res.cookie("cartId", newCart._id.toString(), { httpOnly: true });
    req.cartId = newCart._id.toString();
  } else {
    req.cartId = req.cookies.cartId;
  }
  next();
});

// Handlebars
server.engine(
  "handlebars",
  engine({
    helpers: {
      multiply: (a, b) => a * b,
    },
  })
);
server.set("view engine", "handlebars");
server.set("views", path.join(__dirname, "/proyecto/views"));

// Ruta para renderizar home con productos y botón para agregar al carrito
server.get("/products", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("home", { products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

// Endpoint para agregar producto al carrito usando cookie cartId
server.post("/cart/add/:pid", async (req, res) => {
  try {
    const cartId = req.cartId;
    const productId = req.params.pid;

    if (!cartId) return res.status(400).send("Carrito no encontrado");

    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).send("Carrito no encontrado en BD");

    const productInCart = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    res.redirect("/cart"); // Redirige a la vista del carrito
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar producto al carrito");
  }
});

// Vista para mostrar carrito y sus productos
server.get("/cart", async (req, res) => {
  try {
    const cart = await Cart.findById(req.cartId).populate("products.product").lean();
    if (!cart) return res.redirect("/products");

    res.render("cartDetail", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito");
  }
});

// Endpoint para eliminar un producto del carrito
server.post("/api/carts/:cid/products/:pid", methodOverride("_method"), async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const { cid, pid } = req.params;
      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).send("Carrito no encontrado");

      cart.products = cart.products.filter(
        (p) => p.product.toString() !== pid
      );

      await cart.save();
      res.redirect("/cart");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al eliminar producto del carrito");
    }
  } else {
    res.status(405).send("Método no permitido");
  }
});

// Endpoint para vaciar carrito
server.post("/api/carts/:cid", methodOverride("_method"), async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const { cid } = req.params;
      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).send("Carrito no encontrado");

      cart.products = [];
      await cart.save();
      res.redirect("/cart");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al vaciar carrito");
    }
  } else {
    res.status(405).send("Método no permitido");
  }
});

// Routers para api/products y views
server.use("/api/products", productsRouter);
server.use("/", viewsRouter);

// Iniciar servidor
const httpServer = server.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});

// WebSockets
const io = new Server(httpServer);
server.set("io", io);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", async (productData) => {
    await Product.create(productData);
    const products = await Product.find().lean();
    io.emit("productsUpdated", products);
  });

  socket.on("deleteProduct", async (id) => {
    await Product.findByIdAndDelete(id);
    const products = await Product.find().lean();
    io.emit("productsUpdated", products);
  });
});

// Vista para mostrar carrito y sus productos
server.get("/cart", async (req, res) => {
  try {
    const cart = await Cart.findById(req.cartId).populate("products.product").lean();
    if (!cart) return res.redirect("/products");

    console.log("Carrito encontrado:", cart);  // <-- Esto es lo nuevo para debuggear
    res.render("cartDetail", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito");
  }
});





