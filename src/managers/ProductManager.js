const fs = require("fs").promises
const path = require("path")

const productsPath = path.join(__dirname, "../data/products.json")

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
        try {
            const products = await this.getProducts()
            return products.find(p => p.id === id) || null
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error.message)
        }
    }

    async addProduct(productData) {
        try {
            const products = await this.getProducts();

            if (!productData.title || !productData.code || typeof productData.price !== "number") {
                throw new Error("Asegurate de ingresar los datos neecsarios o de forma correcta.");
            }

            const codeExists = products.some(p => p.code === productData.code);
            if (codeExists) {
                throw new Error(`Ya existe un producto con el código "${productData.code}"`);
            }

            const newProduct = {
                //id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                status: true,
                ...productData
            };
    
            products.push(newProduct);
            await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            throw new Error("Error al agregar el producto: " + error.message);
        }

    }

    async updateProduct(id, fields) {
        try {
            const products = await this.getProducts();
            const i = products.findIndex(p => p.id === id);
            if (i === -1) return null;
    
            const updatedProduct = {
                ...products[i],
                ...fields,
                id: products[i].id
            };
    
            products[i] = updatedProduct;
            await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
            return updatedProduct;            
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const idNumerico = Number(id);
            const filtered = products.filter(p => p.id !== idNumerico);
            if (products.length === filtered.length) return false;
    
            await fs.writeFile(productsPath, JSON.stringify(filtered, null, 2));
            console.log(`Producto eliminado`)
            return true;            
        } catch (error) {
            throw new Error("Error al eliminar el producto: " + error.message);
        }
    }
}

module.exports = ProductManager;