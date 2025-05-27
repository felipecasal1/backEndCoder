import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://juliancorrea108:CoderHouseBackend1@dessinger.txlopdh.mongodb.net/");
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("❌ Error al conectar a MongoDB:", error);
        process.exit(1);
    }
};

const generateProducts = (count) => {
    const products = [];
    for (let i = 1; i <= count; i++) {
        products.push({
            title: `Producto ${i}`,
            description: `Descripción del producto número ${i}`,
            code: `CODE${1000 + i}`,
            price: Math.floor(Math.random() * 10000) / 100, // precio entre 0 y 100 (con decimales)
            status: true,
            stock: Math.floor(Math.random() * 100), // stock aleatorio entre 0 y 99
            category: ["Electronica", "Ropa", "Hogar", "Juguetes"][i % 4],
            thumbnails: [`https://picsum.photos/200?random=${i}`], // imagen random
        });
    }
    return products;
};

const seed = async () => {
    await connectDB();

    // Eliminar productos anteriores (opcional)
    await ProductModel.deleteMany({});
    console.log("Productos anteriores eliminados");

    // Crear productos nuevos
    const products = generateProducts(50);
    await ProductModel.insertMany(products);
    console.log("50 productos creados y guardados");

    mongoose.disconnect();

};

seed();
