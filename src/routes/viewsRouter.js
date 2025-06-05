import { Router } from "express";
import productModel from "../models/product.model.js";
const viewsRouter = Router();

// Ruta principal - Home con productos de MongoDB
viewsRouter.get("/", async (req, res) => {
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

// Detalle de un producto
viewsRouter.get("/products/:pid", async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean();
        if (!product) {
            return res.status(404).render("error", { message: "Producto no encontrado" });
        }
        product.id = productModel._id.toString();
        res.render("productDetail", { product });
    } catch (err) {
        console.error("Error cargando producto:", err);
        res.status(500).render("error", { message: "Error interno al cargar producto" });
    }
});

// // Detalle de carrito
// viewsRouter.get("/carts/:cid", async (req, res) => {
//     try {
//         const cart = await Cart.findById(req.params.cid)
//             .populate("products.product")
//             .lean();

//         if (!cart) {
//             return res.status(404).render("error", { message: "Carrito no encontrado" });
//         }

//         cart.id = cart._id.toString();

//         if (cart.products && Array.isArray(cart.products)) {
//             cart.products = cart.products.map(item => {
//                 if (item.product?._id) {
//                     item.product.id = item.product._id.toString();
//                 }
//                 return item;
//             });
//         }

//         res.render("cartDetail", { cart });
//     } catch (err) {
//         console.error("Error cargando carrito:", err);
//         res.status(500).render("error", { message: "Error interno al cargar carrito" });
//     }
// });

// // Redireccionar al carrito único basado en cookie
// viewsRouter.get("/mycart", async (req, res) => {
//     try {
//         let cartId = req.cookies?.cartId;

//         if (!cartId) {
//             const newCart = await Cart.create({ products: [] });
//             cartId = newCart._id.toString();

//             res.cookie("cartId", cartId, {
//                 httpOnly: true,
//                 maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
//             });
//         }

//         res.redirect(`/carts/${cartId}`);
//     } catch (err) {
//         console.error("Error creando o redirigiendo al carrito:", err);
//         res.status(500).render("error", { message: "No se pudo acceder al carrito" });
//     }
// });

export default viewsRouter;