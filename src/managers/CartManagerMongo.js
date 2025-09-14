const CartModel = require("../models/cart.model")

class CartManagerMongo {
  async createCart() {
    try {
      return await CartModel.create({ products: [] })
    } catch (err) {
      console.error("Error al crear carrito:", err)
      throw err
    }
  }

  async getCarts() {
    try {
      return await CartModel.find().populate("products.product").lean()
    } catch (err) {
      console.error("Error al obtener carritos:", err)
      throw err
    }
  }

  async getCartById(id) {
    try {
      return await CartModel.findById(id).populate("products.product").lean()
    } catch (err) {
      console.error(`Error al obtener carrito con id ${id}:`, err)
      throw err
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await CartModel.findById(cartId)
      if (!cart) return null

      const index = cart.products.findIndex(
        (p) => p.product.toString() === productId
      )

      if (index >= 0) {
        cart.products[index].quantity += quantity
      } else {
        cart.products.push({ product: productId, quantity })
      }

      await cart.save()
      return await cart.populate("products.product")
    } catch (err) {
      console.error("Error al agregar producto al carrito:", err)
      throw err
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId)
      if (!cart) return null

      cart.products = cart.products.filter(
        (p) => p.product.toString() !== productId
      )

      await cart.save()
      return await cart.populate("products.product")
    } catch (err) {
      console.error("Error al eliminar producto del carrito:", err)
      throw err
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId)
      if (!cart) return null

      cart.products = []
      await cart.save()
      return cart
    } catch (err) {
      console.error("Error al vaciar carrito:", err)
      throw err
    }
  }

  async deleteCart(cartId) {
    try {
      return await CartModel.findByIdAndDelete(cartId)
    } catch (err) {
      console.error("Error al eliminar carrito:", err)
      throw err
    }
  }

  async updateProductQuantity(cartId, productId, action) {
    try {
      const cart = await CartModel.findById(cartId).populate("products.product");
      if (!cart) return null

      const item = cart.products.find(
        (p) => p.product._id.toString() === productId
      )
      if (!item) return null

      if (action === "add") {
        item.quantity += 1
      } else if (action === "subtract") {
        item.quantity -= 1
        if (item.quantity <= 0) {
          cart.products = cart.products.filter(
            (p) => p.product._id.toString() !== productId
          )
        }
      }

      await cart.save()
      return cart
    } catch (err) {
      console.error("Error al actualizar cantidad de producto:", err)
      throw err
    }
  }
}

module.exports = CartManagerMongo;