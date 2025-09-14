const express = require("express")
const mongoose = require("mongoose")
const CartManager = require("../managers/CartManagerMongo")

const router = express.Router()
const manager = new CartManager()

router.get("/", async (req, res) => {
    try {
        const carts = await manager.getCarts()
        res.status(200).json(carts)
    } catch (error) {
        console.error("Error al obtener los carritos:", error.message)
        res.status(500).json({ error: "No se pudieron obtener los carritos" })
    }
})

router.post("/", async (req, res) => {
    try {
        const newCart = await manager.createCart()
        res.status(201).json(newCart)
    } catch (error) {
        console.error("Error al crear el carrito:", error.message)
        res.status(500).json({ error: "No se pudo crear el carrito" })
    }
})

router.get("/:cid", async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid)

    if (!cart) {
      return res.status(404).send("Carrito no encontrado")
    }

    const total = cart.products.reduce(
      (acc, p) => acc + p.product.price * p.quantity,
      0
    )

    res.render("cart", { cart, total });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener carrito");
  }
})

router.get("/:cid/json", async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid)
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" })
    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al obtener carrito" })
  }
})


router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: "ID de carrito o producto inválido" })
        }

        const result = await manager.addProductToCart(cid, pid)

        if (!result) {
            return res.status(404).json({ error: "Carrito no encontrado" })
        }

        res.status(200).json(result)
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error.message)
        res.status(500).json({ error: "No se pudo agregar el producto al carrito" })
    }
})

router.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { action } = req.body

  try {
    const updatedCart = await manager.updateProductQuantity(cid, pid, action)

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" })
    }

    res.status(200).json(updatedCart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al actualizar cantidad" })
  }
});


module.exports = router;