

import express from 'express';
const router = express.Router();

export default function cartRouter(cartManager) {
    router.post('/', async (req, res) => {
        const carrito = await cartManager.createCart();
        res.send({ mensaje: 'Carrito creado', carrito });
    });

    router.get('/:cid', async (req, res) => {
        const cid = parseInt(req.params.cid); 
        const carrito = await cartManager.getCartById(cid);
        if (!carrito) return res.status(404).send({ error: 'Carrito no encontrado' });
        res.send({ productos: carrito.products });
    });

    router.post('/:cid/product/:pid', async (req, res) => {
        const cid = parseInt(req.params.cid); 
        const pid = parseInt(req.params.pid); 
        const carritoActualizado = await cartManager.addProductToCart(cid, pid);
        if (!carritoActualizado) return res.status(404).send({ error: 'No se pudo agregar el producto' });
        res.send({ mensaje: 'Producto agregado al carrito', carrito: carritoActualizado });
    });

    return router;
}