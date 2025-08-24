const ProductManager = require('../managers/ProductManager.js')
const Router=require('express').Router;
const router=Router()
const productManager=new ProductManager()

router.get('/products', async (req, res)=>{
    let products= await productManager.getProducts()
    res.render("products", { products })
})

module.exports=router