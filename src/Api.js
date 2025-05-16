import http from "node:http";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
dotenv.config();


import hbs from "express-handlebars";
import fs from "node:fs/promises";

import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import productsRouter from "./routes/productRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";


import ProductManager from "./managers/productManager.js";
import CartsManager from "./managers/cartsManager.js";



const app = express()
const PORT = process.env.PORT ;
const httpServer = createServer(app);
const io = new Server(httpServer);


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurar carpeta pública para archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

//cofiguracion de handlebars
app.engine("handlebars", hbs.engine())
app.set("views", path.join(dirname(fileURLToPath(import.meta.url)), "views"));
app.set("view engine", "handlebars"); 


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

const productManager = new ProductManager("./data/products.json");
const cartManager = new CartsManager('./data/carts.json');

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


