const mongoose = require("mongoose")
const ProductManager = require("../managers/ProductManagerMongo")
const CartManager = require("../managers/CartManagerMongo")
const Router = require("express").Router
const router = Router()
const pm = new ProductManager()
const cm = new CartManager()

router.get("/home", async (req, res) => {
  try {
    const carts = await cm.getCarts()

    if (carts.length === 0) {
      const newCart = await cm.createCart()
      carts.push(newCart)
    }

    res.render("home", { carts })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al cargar la home")
  }
})

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await pm.getProducts()
        res.render('realtimeProducts', { products })
    } catch (error) {
        console.error(error)
        res.status(500).send("Error al obtener los productos")
    }
})

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cm.getCartById(cid)

    if (!cart) {
      return res.status(404).send("Carrito no encontrado")
    }

    let total = 0;
    cart.products.forEach(p => {
      total += p.quantity * p.product.price;
    })

    res.render("cart", { cart, total })
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito")
  }
})

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send("ID de producto inválido")
    }

    const product = await pm.getProductById(pid)

    if (!product) return res.status(404).send("Producto no encontrado")

    res.render("product", { product })

  } catch (err) {
    console.error("ERROR DETALLADO:",err)
    res.status(500).send("Error al obtener el producto")
  }
})

module.exports = router;