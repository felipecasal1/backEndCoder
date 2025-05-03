import express from 'express';
import ProductManager from '../managers/productManager.js';

const router = express.Router();
const productManager = new ProductManager('../data/products.json');

router.get('/home', async (req, res) => {
    const productos = await productManager.getProducts();
    res.render('home', { productos });
});

router.get('/realtimeproducts', async (req, res) => {
    const productos = await productManager.getProducts();
    res.render('realTimeProducts', { productos });
});

export default router;