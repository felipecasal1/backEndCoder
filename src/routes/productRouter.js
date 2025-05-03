
// export default router;
import express from 'express';
const router = express.Router();

export default function productRouter(productManager, io) {
    router.get('/', async (req, res) => {
        const productos = await productManager.getProducts();
        res.send({ productos });
    });

    router.get('/:pid', async (req, res) => {
        const pid = parseInt(req.params.pid);
        const producto = await productManager.getProductById(pid);
        if (!producto) return res.status(404).send({ error: 'Producto no encontrado' });
        res.send({ producto });
    });

    router.post('/', async (req, res) => {
        const nuevoProducto = await productManager.addProduct(req.body);
        const productos = await productManager.getProducts();
        io.emit('actualizarProductos', productos); 
        res.send({ mensaje: 'Producto agregado', producto: nuevoProducto });
    });

    router.put('/:pid', async (req, res) => {
        const pid = parseInt(req.params.pid); 
        const productoActualizado = await productManager.updateProduct(pid, req.body);
        if (!productoActualizado) return res.status(404).send({ error: 'Producto no encontrado' });
        const productos = await productManager.getProducts();
        io.emit('actualizarProductos', productos); 
        res.send({ mensaje: 'Producto actualizado', producto: productoActualizado });
    });

    router.delete('/:pid', async (req, res) => {
        const pid = parseInt(req.params.pid); 
        const result = await productManager.deleteProduct(pid);
        if (!result) return res.status(404).send({ error: 'Producto no encontrado' });
        const productos = await productManager.getProducts();
        io.emit('actualizarProductos', productos); 
        res.send({ mensaje: 'Producto eliminado' });
    });

    return router;
}