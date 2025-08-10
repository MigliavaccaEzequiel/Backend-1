const express = require("express");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const manager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await manager.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error al obtener los carritos:", error.message);
        res.status(500).json({ error: "No se pudieron obtener los carritos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito:", error.message);
        res.status(500).json({ error: "No se pudo crear el carrito" });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const cart = await manager.getCartById(id);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message);
        res.status(500).json({ error: "No se pudo obtener el carrito" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const result = await manager.addProductToCart(cartId, productId);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error.message);
        res.status(500).json({ error: "No se pudo agregar el producto al carrito" });
    }
});

module.exports = router;