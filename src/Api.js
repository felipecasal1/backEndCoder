import http from "node:http";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

import hbs from "express-handlebars";
import fs from "node:fs/promises";

import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import productsRouter from "./routes/productRouter.js";
import cartsRouter from "./routes/cartsRouter.js";

import ProductManager from "./product/productManager.js";
import cartsManager from "./carts/cartsManager.js";



const app = express()
const PORT = 8080;
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());

app.engine("handlebars", hbs.engine())

app.set("views", import.meta.dirname + "/views");
app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars"); // Cambia "views engine" por "view engine"
app.set("views", path.join(dirname(fileURLToPath(import.meta.url)), "/views")); // Configura correctamente la ruta de las vistas
app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), "public")));


let messages = [] //array para guardar los mensajes de los usuarios
io.on("connection", (socket) => {
    console.log("nuevo cliente conectado")

    socket.on("message", (data) => {
        console.log("mensaje recivido : ",data)
        messages.push(data)
        io.emit("message", {
            socketId: socket.id,
            messages: data
        })
    })
})

//pagina principal
app.get("/api", (req, res) => {
    res.send("bienvenido a la api")
})

app.get("/chat", (req, res) => {
    res.sendFile(path.join(dirname(fileURLToPath(import.meta.url)), "/public/index.html"))
})

app.use("/", productsRouter); // Usa el router de productos



app.use("/", cartsRouter); // Usa el router de productos








httpServer.listen(PORT, () => {
    console.log("servidor escuchando en el puerto " + PORT + " y en el socket " + io.path())
})

