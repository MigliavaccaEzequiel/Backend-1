const express = require("express");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const manager = new CartManager();

// POST /api/carts
router.post("/", async (req, res) => {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
});

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
    const id = parseInt(req.params.cid);
    const cart = await manager.getCartById(id);

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json(cart);
});

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const result = await manager.addProductToCart(cartId, productId);

    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    res.status(200).json(result);
});

module.exports = router;