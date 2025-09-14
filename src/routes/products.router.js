const express = require("express")
const ProductManager = require("../managers/ProductManagerMongo")
const mongoose = require("mongoose")

const router = express.Router()
const manager = new ProductManager()

router.get("/", async (req, res) => {
  try {
    let { limit = 5, page = 1, sort, query } = req.query;
    limit = parseInt(limit) || 5;
    page = parseInt(page) || 1;

    const filter = {};
    if (query) {
    if (query.includes(":")) {
        const [k, v] = query.split(":");
        if (k === "available") {
        filter.stock = v === "true" ? { $gt: 0 } : 0;
        } else {
        filter[k] = isNaN(v) ? v : Number(v);
        }
    } else {
        const categories = ["pizzas", "bebidas", "sandwiches"]; 
        if (categories.includes(query.toLowerCase())) {
        filter.category = query;
        } else {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
        ];
        }
    }
    }

    const options = { page, limit, lean: true };
    if (sort) options.sort = { price: sort === "asc" ? 1 : -1 };

    const result = await manager.getProductsPaginated(filter, options);

    const base = "/api/products";
    const prevLink = result.hasPrevPage
      ? `${base}?page=${result.prevPage}&limit=${limit}`
      : null;
    const nextLink = result.hasNextPage
      ? `${base}?page=${result.nextPage}&limit=${limit}`
      : null;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({ error: "No se pudieron obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const product = await manager.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error.message);
        res.status(500).json({ error: "No se pudo obtener el producto" });
    }
});

router.post("/", async (req, res) => {
    try{
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        const priceNum = Number(price);
        const stockNum = parseInt(stock);

        if (!title || !description || !code || price == null || stock == null || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios menos imagen" })
        }
        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({ error: "Precio inválido" })
        }
        if (isNaN(stockNum) || stockNum < 0) {
            return res.status(400).json({ error: "Stock no puede ser negativo" })
        }

        const newProduct = await manager.addProduct({ title, description, code, price: priceNum, stock: stockNum, category, thumbnails })
        res.status(201).json(newProduct)
        console.log(req.body)
    } catch (error) {
        console.error("Error al crear el producto:", error.message)
        res.status(500).json({ error: "No se pudo crear el producto" })
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const id = req.params.pid
        const updateFields = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" })
        }

        if (updateFields.id) {
            return res.status(400).json({ error: "No se puede modificar el ID del producto" })
        }

        const updated = await manager.updateProduct(id, updateFields)

        if (!updated) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        res.status(200).json(updated);
    } catch (error) {
        console.error("Error al modificar el producto:", error.message)
        res.status(500).json({ error: "No se pudo modificar el producto" })
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" })
        }

        const deleted = await manager.deleteProduct(id)

        if (!deleted) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        res.status(200).json({ message: "Producto eliminado correctamente" })
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message)
        res.status(500).json({ error: "No se pudo eliminar el producto" })
    }
})

module.exports = router;