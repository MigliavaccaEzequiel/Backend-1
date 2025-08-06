const fs = require("fs").promises;
const path = require("path");

const productsPath = path.join(__dirname, "../data/products.json");

class ProductManager {
    async getProducts() {
        try {
            const data = await fs.readFile(productsPath, "utf-8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id) || null;
    }

    async addProduct(productData) {
        const products = await this.getProducts();

        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            status: true,
            ...productData
        };

        products.push(newProduct);
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, fields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        const updatedProduct = {
            ...products[index],
            ...fields,
            id: products[index].id // aseguramos que no se modifique el ID
        };

        products[index] = updatedProduct;
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
        return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filtered = products.filter(p => p.id !== id);
        if (products.length === filtered.length) return false;

        await fs.writeFile(productsPath, JSON.stringify(filtered, null, 2));
        return true;
    }
}

module.exports = ProductManager;