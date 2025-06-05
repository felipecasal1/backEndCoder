
// export default router;
import express from 'express';
const router = express.Router();
import productModel from '../models/product.model.js';

console.log("productRouter cargado");




export default router;







//     router.post('/', async (req, res) => {
//         const nuevoProducto = await productManager.addProduct(req.body);
//         const productos = await productManager.getProducts();
//         io.emit('actualizarProductos', productos); 
//         res.send({ mensaje: 'Producto agregado', producto: nuevoProducto });
//     });



//     router.put('/:pid', async (req, res) => {
//         const pid = parseInt(req.params.pid); 
//         const productoActualizado = await productManager.updateProduct(pid, req.body);
//         if (!productoActualizado) return res.status(404).send({ error: 'Producto no encontrado' });
//         const productos = await productManager.getProducts();
//         io.emit('actualizarProductos', productos); 
//         res.send({ mensaje: 'Producto actualizado', producto: productoActualizado });
//     });



//     router.delete('/:pid', async (req, res) => {
//         const pid = parseInt(req.params.pid); 
//         const result = await productManager.deleteProduct(pid);
//         if (!result) return res.status(404).send({ error: 'Producto no encontrado' });
//         const productos = await productManager.getProducts();
//         io.emit('actualizarProductos', productos); 
//         res.send({ mensaje: 'Producto eliminado' });
//     });

    
//     return router;
// }

