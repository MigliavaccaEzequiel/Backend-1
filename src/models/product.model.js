const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const productSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  description: String,
  code: { type: String, unique: true, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  category: { type: String, required: true },
  thumbnails: { type: String, default: [] }
  },
  {timestamps: true}
)

productSchema.plugin(mongoosePaginate)

const ProductModel = mongoose.model("Product", productSchema)

module.exports = ProductModel