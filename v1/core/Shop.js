import { checkPositiveNumber, checkProduct } from "../utils/functions.js";
import { ProductNotFoundError, NotEnoughStockError } from "../utils/errors.js";

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
        this.inventory = new Map(); // productId -> InventoryEntry
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
        return entry ? entry.stock : 0;
    }

    hasStock(id, quantity) {
        const entry = this.findProduct(id);
        return entry ? entry.hasStock(quantity) : false;
    }

    getProducts() {
        return Array.from(this.inventory.values());
    }

    getCategories() {
        const categories = this.getProducts().map(entry => entry.product.category);
        return Array.from(new Set(categories));
    }

    // Devuelve las entradas que cumplen los filtros.
    // Un filtro vacío ("") significa "no filtrar por eso".
    filterProducts({ search = "", category = "" } = {}) {
        const term = search.trim().toLowerCase();
        return this.getProducts()
            .filter(entry => category === "" || entry.product.category === category)
            .filter(entry => term === "" || entry.product.title.toLowerCase().includes(term));
    }

    // Regla de negocio: no se puede añadir al carrito más de lo que hay en stock
    // (contando lo que ya está en el carrito).
    addToCart(cart, productId, quantity = 1) {
        const entry = this.findProduct(productId);
        if (!entry) {
            throw new ProductNotFoundError(productId);
        }
        const totalWanted = cart.getQuantity(productId) + quantity;
        if (!entry.hasStock(totalWanted)) {
            throw new NotEnoughStockError(entry.product.title);
        }
        cart.add(entry.product, quantity);
    }
}

export default Shop;
