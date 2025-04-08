import express from "express";
import json from "./dataProducts.js"

const app = express()
const PORT = 8080;


let data = [...json]

app.use(express.json());



//pagina principal
app.get("/api", (req, res) => {
    res.send("hola, Bienvenidos a la api : utilizar la ruta /api/products para ver todos los productos")
})
app.get("/api/products", (req, res) => {
    res.json(data)
})

app.get("/api/carts", (req, res) => {
    res.send("hola, es el carrito")
})

//encontrar un product por id
app.get("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const found = data.find((b) => b.id === parseInt(id));
    if (!found) return res.status(404).json({ error: "libro no encontrado" });
    res.json(found);
  });











app.put("/", (req, res) => {
})
app.delete("/", (req, res) => {
})

app.listen(PORT, () => {
    console.log("servidor escuchando en el puerto " + PORT)
})