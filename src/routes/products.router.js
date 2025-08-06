const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = await manager.getProducts();

    if (limit && !isNaN(limit)) {
        return res.status(200).json(products.slice(0, limit));
    }

    res.status(200).json(products);
});

router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const product = await manager.getProductById(id);

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
});

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const newProduct = await manager.addProduct({ title, description, code, price, stock, category, thumbnails });
    res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
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
});

router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const deleted = await manager.deleteProduct(id);

    if (!deleted) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente" });
});

module.exports = router;