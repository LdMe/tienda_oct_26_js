import { checkClient, checkPositiveNumber, checkProduct, formatPrice } from "../utils/functions.js";
import { LineItem } from "./Product.js";

class Cart {
    constructor(client) {
        checkClient(client);
        this.client = client;
        this.items = new Map(); // productId -> LineItem
    }

    getLine(productId) {
        return this.items.get(productId) || null;
    }

    getLines() {
        return Array.from(this.items.values());
    }

    // Unidades de un producto que ya hay en el carrito (0 si no está)
    getQuantity(productId) {
        const line = this.getLine(productId);
        return line ? line.quantity : 0;
    }

    add(product, quantity) {
        checkProduct(product);
        checkPositiveNumber(quantity);
        const line = this.getLine(product.id);
        if (line) {
            line.quantity += quantity;
            line.price = product.price; // actualizamos el precio
        } else {
            this.items.set(product.id, new LineItem(product, quantity, product.price));
        }
    }

    deleteItem(productId) {
        this.items.delete(productId);
    }

    remove(productId, quantity) {
        const line = this.getLine(productId);
        if (!line) return;
        if (line.quantity > quantity) {
            line.quantity -= quantity;
        } else {
            this.deleteItem(productId);
        }
    }

    clear() {
        this.items.clear();
    }

    getTotalPrice(formatted = false) {
        const total = this.getLines().reduce((acc, line) => acc + line.getSubtotal(), 0);
        return formatted ? formatPrice(total) : total;
    }

    getTotalQuantity() {
        return this.getLines().reduce((acc, line) => acc + line.quantity, 0);
    }

    isEmpty() {
        return this.items.size === 0;
    }
}

export default Cart;
