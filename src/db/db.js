import mongoose from "mongoose";


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(" Conectado a MongoDB Atlas");
    } catch (error) {
        console.error(" Error al conectar a MongoDB Atlas:");
    }
};