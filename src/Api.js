import http from "node:http";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import hbs from "express-handlebars";
import fs from "node:fs/promises";

import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";


import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import productsRouter from "./routes/productRouter.js";


import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import cartSchema from "./models/cart.model.js";
import productModel from "./models/product.model.js"


const app = express()
const PORT = process.env.PORT;


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tuDB";
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado a MongoDB"))
    .catch((error) => console.error("Error conectando a MongoDB:", error));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurar carpeta pública para archivos estáticos
app.use(express.static(path.join(__dirname, "public")));


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

// Middleware para manejar carrito único con cookie cartId
app.use(async (req, res, next) => {
    if (!req.cookies.cartId) {
        const newCart = await cartSchema.create({ products: [] });
        res.cookie("cartId", newCart._id.toString(), { httpOnly: true });
        req.cartId = newCart._id.toString();
    } else {
        req.cartId = req.cookies.cartId;
    }
    next();
});


//cofiguracion de handlebars
app.engine("handlebars", hbs.engine())

app.set("views", path.join(dirname(fileURLToPath(import.meta.url)), "views"));
app.set("view engine", "handlebars");


app.engine("handlebars", engine({
    helpers: {
        multiply: (a, b) => a * b,
        sumTotal: (products) => {
            return products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        }
    }
}));

app.post("/cart/add/:pid", async (req, res) => {
    try {
        const cartId = req.cartId;
        const productId = req.params.pid;

        if (!cartId) return res.status(400).send("Carrito no encontrado");

        const cart = await cartSchema.findById(cartId);
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
app.get("/cart", async (req, res) => {
    try {
        const cart = await cartSchema.findById(req.cartId).populate("products.product").lean();
        if (!cart) return res.redirect("/products");

        res.render("cartDetail", { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el carrito");
    }
});

// Endpoint para eliminar un producto del carrito
app.post("/api/carts/:cid/products/:pid", methodOverride("_method"), async (req, res) => {
    if (req.method === "DELETE") {
        try {
            const { cid, pid } = req.params;
            const cart = await cartSchema.findById(cid);
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

app.delete("/api/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartSchema.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al vaciar carrito");
  }
});




// Middleware para hacer que io esté disponible en las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.get("/", (req, res) => {
    res.render("index"); // Renderiza index.handlebars
});



// Routers para api/products y views
app.use("/api/products", productsRouter);
app.use("/", viewsRouter); /////////////////////

const httpServer = app.listen(8080, () => {
    console.log("Servidor corriendo en puerto 8080");
});




// Configuración del servidor HTTP y Socket.IO
const io = new Server(httpServer);
app.set("io", io);



io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("newProduct", async (productData) => {
        await productModel.create(productData);
        const products = await productModel.find().lean();
        io.emit("productsUpdated", products);
    });

    socket.on("deleteProduct", async (id) => {
        await productModel.findByIdAndDelete(id);
        const products = await productModel.find().lean();
        io.emit("productsUpdated", products);
    });
});

