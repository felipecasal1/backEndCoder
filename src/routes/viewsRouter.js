import { Router } from "express";
import productModel from "../models/product.model.js";
const viewsRouter = Router();

// Ruta principal - Home con productos de MongoDB
viewsRouter.get("/home", async (req, res) => {
    try {
        const productos = (await productModel.find().lean()).map(p => ({ ...p, id: p._id.toString() }));
        res.render("home", { productos });
    } catch (err) {
        console.error("Error cargando productos:", err);
        res.status(500).render("error", { message: "Error interno al cargar productos" });
    }
});

// Productos en tiempo real (socket)
viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const productos = (await productModel.find().lean()).map(p => ({ ...p, id: p._id.toString() }));
        res.render("realTimeProducts", { productos });
    } catch (err) {
        console.error("Error en realtimeproducts:", err);
        res.status(500).render("error", { message: "Error interno del servidor" });
    }
});




export default viewsRouter;