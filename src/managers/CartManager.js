const fs = require("fs").promises;
const path = require("path");

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
        await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };

        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id) || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return { error: "Carrito no encontrado" };

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.saveCarts(carts);
        return cart;
    }
}

module.exports = CartManager;