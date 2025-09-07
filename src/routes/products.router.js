const express = require("express");
const ProductManager = require("../managers/ProductManagerMongo");

const router = express.Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await manager.getProducts();

        if (limit && !isNaN(limit) || limit>= 0) {
            return res.status(200).json(products.slice(0, limit));
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
        res.status(500).json({ error: "No se pudieron obtener los productos" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
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

        if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const newProduct = await manager.addProduct({ title, description, code, price, stock, category, thumbnails });
        res.status(201).json(newProduct);
        console.log(req.body)
    } catch (error) {
        console.error("Error al crear el producto:", error.message);
        res.status(500).json({ error: "No se pudo crear el producto" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const updateFields = req.body;

        if (updateFields.id) {
            return res.status(400).json({ error: "No se puede modificar el ID del producto" });
        }

        const updated = await manager.updateProduct(id, updateFields);

        if (!updated) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json(updated);
    } catch (error) {
        console.error("Error al modificar el producto:", error.message);
        res.status(500).json({ error: "No se pudo modificar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const deleted = await manager.deleteProduct(id);

        if (!deleted) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        res.status(500).json({ error: "No se pudo eliminar el producto" });
    }
});

module.exports = router;