const express=require("express")
const PORT=8080
const app=express()
const {Server} =require("socket.io")
const {engine} =require("express-handlebars")
const ProductManager = require("./managers/ProductManager")
const pm = new ProductManager("./src/data/products.json")

app.engine("hbs", engine({extname:"hbs"}))
app.set("view engine", "hbs")
app.set("views", "./src/views")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static ("./src/public"))

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const vistasRouter = require("./routes/views.router")

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", vistasRouter)

app.get("/", (req, res)=>{
    res.send("Bienvenido al server.")
})

const serverHTTP = app.listen(PORT, ()=>{
    console.log(`Server online en puerto ${PORT}`)
})

const serverSocket = new Server(serverHTTP)

serverSocket.on("connection", async (socket) => {
  console.log("Cliente conectado");

  try {
    const products = await pm.getProducts()
    socket.emit("updateProducts", products)    
  } catch (error) {
    console.error("Error al enviar productos iniciales:", error.message);
    socket.emit("error", { message: "No se pudieron cargar los productos" });
  }

  socket.on("newProduct", async (product) => {
    try {
      await pm.addProduct(product)
      const products = await pm.getProducts()
      serverSocket.emit("updateProducts", products);      
    } catch (error) {
      console.error("Error al agregar producto vía socket:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await pm.deleteProduct(id)
      const products = await pm.getProducts()
      serverSocket.emit("updateProducts", products);      
    } catch (error) {
      console.error("Error al eliminar producto vía socket:", error.message);
      socket.emit("error", { message: error.message });
    }
  });
});