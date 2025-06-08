import mongoose from "mongoose";

const cartModel = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, default: 1 },
        },
    ],
});

const cartSchema = mongoose.model("Cart", cartModel);
export default cartSchema;