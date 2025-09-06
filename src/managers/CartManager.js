const fs = require("fs").promises;
const path = require("path");
const ProductManager = require("./ProductManager");
const productManager = new ProductManager();

const cartsPath = path.join(__dirname, "../data/carts.json");

class CartManager {
    async getCarts() {
        try {
            const data = await fs.readFile(cartsPath, "utf-8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async saveCarts(carts) {
        try {
            await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error("No se pudo guardar el carrito" + error.message);
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
                products: []
            };
    
            carts.push(newCart);
            await this.saveCarts(carts);
            return newCart;
        } catch (error) {
            throw new Error("No se pudo crear el carrito" + error.message);
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            return carts.find(c => c.id === id) || null;
        } catch (error) {
            throw new Error("No se pudo obtener el carrito" + error.message);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            const products = await productManager.getProducts();
            const product = products.find(p => p.id === productId);
            if (!product) {
                throw new Error(`El producto con id ${productId} no existe`)
            }
    
            const existingProduct = cart.products.find(p => p.productId === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ productId, quantity: 1 });
            }
    
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error("No se pudo agregar el producto al carrito: " + error.message);
        }
    }
}

module.exports = CartManager;