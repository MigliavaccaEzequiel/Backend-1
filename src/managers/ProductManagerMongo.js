const ProductModel = require("../models/product.model")

class ProductManagerMongo {
  async getProducts() {
    return await ProductModel.find().lean()
  }

  async getProductById(id) {
    return await ProductModel.findById(id)
  }

  async addProduct(product) {
    return await ProductModel.create(product)
  }

  async updateProduct(id, product) {
    return await ProductModel.findByIdAndUpdate(id, product, { new: true })
  }

  async deleteProduct(id) {
    return await ProductModel.findByIdAndDelete(id)
  }
}

module.exports = ProductManagerMongo