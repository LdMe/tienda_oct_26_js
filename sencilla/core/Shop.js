import { checkPositiveNumber, checkProduct } from "../utils/functions.js";

// Un producto del inventario junto con su stock
class InventoryEntry {
    constructor(product, stock) {
        this.product = product;
        this.stock = stock;
    }
    hasStock(quantity) {
        return this.stock >= quantity;
    }
}

class Shop {
    constructor(name) {
        this.name = name;
        this.inventory = new Map(); // id del producto -> InventoryEntry
    }

    addProduct(product, stock) {
        checkProduct(product);
        checkPositiveNumber(stock);
        this.inventory.set(product.id, new InventoryEntry(product, stock));
    }

    findProduct(id) {
        return this.inventory.get(id) || null;
    }

    getStock(id) {
        const entry = this.findProduct(id);
        if (entry) {
            return entry.stock;
        }
        return 0;
    }

    hasStock(id, quantity) {
        const entry = this.findProduct(id);
        if (entry) {
            return entry.hasStock(quantity);
        }
        return false;
    }

    getProducts() {
        return Array.from(this.inventory.values());
    }

    getCategories() {
        const categories = this.getProducts().map(entry => entry.product.category);
        return Array.from(new Set(categories));
    }

    // Devuelve los productos que coinciden con el texto y la categoría.
    // Si el texto o la categoría están vacíos, no se filtra por ellos.
    filterProducts(search, category) {
        const text = search.trim().toLowerCase();

        return this.getProducts().filter(entry => {
            const title = entry.product.title.toLowerCase();
            const matchesText = text === "" || title.includes(text);
            const matchesCategory = category === "" || entry.product.category === category;
            return matchesText && matchesCategory;
        });
    }
}

export default Shop;
