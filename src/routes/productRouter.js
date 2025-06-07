
// export default router;
import express from 'express';
const router = express.Router();
import productModel from '../models/product.model.js';


router.post("/", async (req, res) => {
  try {
    const product = await productModel.create(req.body);
    res.status(201).json({ status: "success", message: "Producto Creado correctamente", product });
  } catch (error) {
    console.error("no se a podido crear el producto error:", error);
    res.status(500).json({ status: "error", message: "Error al crear el producto" });
  }
});
router.get("/:pid", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).lean()
    console.log("el producto traido es:", product)
    res.render("productDetail", {product})
  } catch (error) {
    console.error("no se a podido crear el producto error:", error);
    res.status(500).json({ status: "error", message: "Error al crear el producto" });
  }
});

router.get("/", async (req, res) => {
  try {
    const product = await productModel.find().lean()
    res.render("home", {product})
  } catch (error) {
    console.error("no se a podido traer el producto error:", error);
    res.status(500).json({ status: "error", message: "Error al traer todos los productos" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.pid,         // id del producto a actualizar
      req.body,               // campos a actualizar
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    
    res.status(200).json({ status: "success", message: "Producto actualizado correctamente", product: updatedProduct });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ status: "error", message: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async(req,res) =>{
  try{
    const product = await productModel.findByIdAndDelete(req.params.pid).lean();
    res.status(201).json({status: "succes", message:"Producto eliminado correctamente", product})
  } catch(error) {
    console.error("error al eliminar el producto, este no se encontro", error)
    res.status(500).json({ status: "error", message: "Error al eliminar el producto" });
  }
})
export default router;





