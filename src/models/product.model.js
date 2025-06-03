import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    id:Number,
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    code: {
        type: String,
        unique: true, // Asegura que el código sea único
    },
});

const productModel = mongoose.model("products", productSchema);

export default productModel;