const ProductManager = require('../managers/ProductManager.js')
const Router=require('express').Router;
const router=Router()

const pm=new ProductManager("./src/data/products.json")

router.get('/products', async (req, res)=>{
    try {
        let products= await pm.getProducts()
        res.render("products", { products })
    } catch(error) {
        console.error(error)
        res.status(500).send("Error al obtener los productos")
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

module.exports=router