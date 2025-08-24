const express=require("express")
const PORT=8080
const app=express()
const {Server} =require("socket.io")
const {engine} =require("express-handlebars")

app.engine("hbs", engine({extname:"hbs"}))
app.set("view engine", "hbs")
app.set("views", "./src/views")
app.use(express.json())

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const vistasRouter = require("./routes/views.router")

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/vistasRouter", vistasRouter)

app.get("/", (req, res)=>{
    res.send("Bienvenido al server.")
})

app.listen(PORT, ()=>{
    console.log(`Server online en puerto ${PORT}`)
})