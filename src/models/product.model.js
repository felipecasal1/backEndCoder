import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

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

mongoosePaginate.paginate.options = {
    customLabels: {
        offset: false,
        page:"currentPage",
        pagingCounter:false,
        totalDocs:false
    }
}
productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model("products", productSchema);

export default productModel;