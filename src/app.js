const express=require("express")
const PORT=8080
const app=express()

app.use(express.json())

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.get("/", (req, res)=>{
    res.send("Bienvenido al server.")
})

app.listen(PORT, ()=>{
    console.log(`Server online en puerto ${PORT}`)
})