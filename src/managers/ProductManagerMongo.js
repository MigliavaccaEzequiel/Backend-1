const ProductModel = require("../models/product.model")
const mongoosePaginate = require("mongoose-paginate-v2")

class ProductManagerMongo {
  async getProducts() {
    return await ProductModel.find().lean()
  }

  async getProductsPaginated(filter, options) {
    return await ProductModel.paginate(filter, options)
  }

  async getProductById(id) {
    return await ProductModel.findById(id).lean()
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

module.exports = ProductManagerMongo;