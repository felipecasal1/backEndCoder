
// export default router;
import express from 'express';
const router = express.Router();
import productModel from '../models/product.model.js';
import cartSchema from '../models/cart.model.js';

const PATH = "http://localhost:8080/api/products"

//crear un nuevo producto 
router.post("/", async (req, res) => {
  try {
    const product = await productModel.create(req.body);
    res.status(201).json({ status: "success", message: "Producto Creado correctamente", product });
  } catch (error) {
    console.error("no se a podido crear el producto error:", error);
    res.status(500).json({ status: "error", message: "Error al crear el producto" });
  }
});


// traer todos los productos
router.get("/", async (req, res) => {
  try {

    const {page} = req.query;
    const product = await productModel.paginate({},{page, limit:10})


    let prevLink =null;
    let nextLink =null;

    if(product.hasPrevPage){
      prevLink = `${PATH}/?page=${product.prevPage}`}

    if(product.hasNextPage){ 
    nextLink = `${PATH}/?page=${product.nextPage}`}


    delete product.offset
    product.status = "success"
    product.prevLink = prevLink;
    product.nextLink = nextLink;


      let productNew = product.docs
      
      console.log(product)
      res.render("home", {product})

  } catch (error) {
    console.error("no se a podido traer el producto error:", error);
    res.status(500).json({ status: "error", message: "Error al traer todos los productos" });
  }
});

//traer un producto por id
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


// editar un producto por id
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

//eliminar un producto por id 
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





