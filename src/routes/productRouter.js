
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

      const {
      page = 1,
      limit = 10,
      category,
      sort,
      query
    } = req.query;


  
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean:true,
    };

if (sort === 'price_asc') {
      options.sort = { price: 1 }; // 1 para ascendente
    } else if (sort === 'price_desc') {
      options.sort = { price: -1 }; // -1 para descendente
    }


    const product = await productModel.paginate({}, options);
    console.log(options)
  
  
    const currentLimit = options.limit; 
    const currentSort = sort || ''; // Si no hay sort, que sea una cadena vacía
  
    let prevlink = null;
    if (product.hasPrevPage) {
        prevlink = `${PATH}?page=${product.prevPage}&limit=${currentLimit}`;
        if (currentSort) prevlink += `&sort=${currentSort}`;
    }

    let nextlink = null;
    if (product.hasNextPage) {
        nextlink = `${PATH}?page=${product.nextPage}&limit=${currentLimit}`;
        if (currentSort) nextlink += `&sort=${currentSort}`;
    }

    delete product.offset

 let productNew = product.docs; // Tus productos actuales

 console.log(product.currentPage)
    // console.log para depuración (opcional, ya sabes que los títulos salen aquí)
    // productNew.forEach(e => console.log(e.title));

    // Renderizar la vista home con los datos
    res.render("home", {
      productNew, // Tus productos paginados
      // Propiedades de paginación para la plantilla
      totalPages: product.totalPages,
      currentPage: product.page,
      hasPrevPage: product.hasPrevPage,
      hasNextPage: product.hasNextPage,
      prevPage: product.prevPage,
      nextPage: product.nextPage,
      prevLink: prevlink, // Links ya construidos con sort y query
      nextLink: nextlink,
      // Puedes pasar el 'sort' y 'query' actual si los necesitas para inputs en el HTML
      currentSort: currentSort,
      product
    });


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





