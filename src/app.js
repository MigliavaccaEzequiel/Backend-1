const express = require("express")
const app = express()
const { Server } = require("socket.io")
const { engine } = require("express-handlebars")
const path = require("path")
const ProductManager = require("./managers/ProductManagerMongo")
const CartManager = require("./managers/CartManagerMongo")
const pm = new ProductManager()
const cm = new CartManager()
const mongoose = require("mongoose")
const conectarDB = require("./config/db")
const config = require("./config/config")

app.engine("hbs", engine({ extname: "hbs" }))
app.set("view engine", "hbs")
app.set("views", "./src/views")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))

conectarDB(config.MONGO_URL, config.DB_NAME)

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const vistasRouter = require("./routes/views.router")

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", vistasRouter)

app.get("/", (req, res) => {
  res.send("Bienvenido al server.")
});

const serverHTTP = app.listen(config.PORT, () => {
  console.log(`Server online en puerto ${config.PORT}`)
});

const serverSocket = new Server(serverHTTP)

serverSocket.on("connection", async (socket) => {
  console.log("Cliente conectado")

  try {
    const products = await pm.getProducts()
    socket.emit("updateProducts", products)
    const carts = await cm.getCarts()
    socket.emit("allCarts", carts)
  } catch (error) {
    console.error("Error al enviar datos iniciales:", error.message)
  }

  socket.on("addToCart", async ({ cartId, productId }) => {
    try {
      const updatedCart = await cm.addProductToCart(cartId, productId)
      socket.emit("cartUpdated", updatedCart)
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message)
      socket.emit("error", { message: "No se pudo agregar el producto al carrito" })
    }
  })

  socket.on("updateQuantity", async ({ cartId, productId, action }) => {
    try {
      const updatedCart = await cm.updateProductQuantity(cartId, productId, action)
      socket.emit("cartUpdated", updatedCart)
    } catch (error) {
      console.error("Error al actualizar cantidad:", error.message)
      socket.emit("error", { message: "No se pudo actualizar la cantidad" })
    }
  })

  socket.on("removeFromCart", async ({ cartId, productId }) => {
    try {
      const updatedCart = await cm.removeProductFromCart(cartId, productId)
      socket.emit("cartUpdated", updatedCart)
    } catch (error) {
      console.error("Error al eliminar producto:", error.message)
      socket.emit("error", { message: "No se pudo eliminar el producto" })
    }
  })

  socket.on("newCart", async () => {
    try {
      const newCart = await cm.createCart()
      const carts = await cm.getCarts()
      serverSocket.emit("allCarts", carts)
      socket.emit("cartUpdated", newCart)
    } catch (err) {
      console.error(err)
      socket.emit("error", { message: "No se pudo crear el carrito" })
    }
  })

  socket.on("newProduct", async (data) => {
    try {
      await pm.addProduct(data)
      const products = await pm.getProducts()
      socket.emit("updateProducts", products)
    } catch (err) {
      console.error("Error al crear producto:", err)
    }
  })

  socket.on("deleteProduct", async (id) => {
    try {
      await pm.deleteProduct(id)
      const products = await pm.getProducts()
      socket.emit("updateProducts", products)
    } catch (err) {
      console.error("Error al eliminar producto:", err)
    }
  })
});