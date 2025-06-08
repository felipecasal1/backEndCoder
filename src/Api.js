import http from "node:http";
import { createServer } from "http";
import { Server} from "socket.io";

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



//cofiguracion de handlebars
app.engine("handlebars", hbs.engine())
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


// Ruta para renderizar home con productos y botón para agregar al carrito

app.use("/home" ,productsRouter)



// Routers para products y carts
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);



const httpServer = app.listen(8080, () => {
    console.log("Servidor corriendo en puerto 8080");
});


// Configuración del servidor HTTP y Socket.IO
const io = new Server(httpServer);
app.set("io", io);



// Middleware para hacer que io esté disponible en las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.get("/", (req, res) => {
    res.render("index"); // Renderiza index.handlebars
});


io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    

    socket.on("deleteProduct", async (id) => {
        await productModel.findByIdAndDelete(id);
        const products = await productModel.find().lean();
        io.emit("productsUpdated", products);
    });
});

