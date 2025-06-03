import http from "node:http";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import hbs from "express-handlebars";
import fs from "node:fs/promises";

import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";


import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import productsRouter from "./routes/productRouter.js";


import ProductManager from "./managers/productManager.js";
import CartsManager from "./managers/cartsManager.js";






const app = express()
const PORT = process.env.PORT ;
const httpServer = createServer(app);
const io = new Server(httpServer);


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tuDB";
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado a MongoDB"))
    .catch((error) => console.error("Error conectando a MongoDB:", error));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurar carpeta pública para archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

//cofiguracion de handlebars
app.engine("handlebars", hbs.engine())
app.set("views", path.join(dirname(fileURLToPath(import.meta.url)), "views"));
app.set("view engine", "handlebars"); 



const productManager = new ProductManager("./data/products.json");
const cartManager = new CartsManager('./data/carts.json');

// Middleware para hacer que io esté disponible en las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.get("/", (req, res) => {
    res.render("index"); // Renderiza index.handlebars
});

app.get("/realtimeproducts", async (req, res) => {
    const productos = await productManager.getProducts(); // Obtén los productos
    res.render("realTimeProducts", { productos }); // Renderiza realTimeProducts.handlebars con datos
});

app.get("/home", async (req, res) => {
    const productos = await productManager.getProducts(); // Obtén los productos
    res.render("home", { productos }); // Renderiza home.handlebars con datos
});

// Pasar productManager a productRouter para actualizaciones en tiempo real
app.use('/api/products', productsRouter(productManager, io));
app.use('/api/carts', cartsRouter(cartManager));

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});        


httpServer.listen(PORT, () => {
    console.log("servidor escuchando en el puerto " + PORT )
})


