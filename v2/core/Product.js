import { checkPositiveNumber, checkProduct, formatPrice } from "../utils/functions.js";

class Product {
    constructor(id, title, description, category, price, image, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price; // en céntimos
        this.image = image;
        this.stock = stock; // en esta versión el stock viene con el producto, como en la API
    }

    // Convierte un objeto del JSON (o de la API) en un Product.
    // Math.round y no parseInt: 9.99 * 100 = 998.9999..., parseInt daría 998.
    static fromJson({ id, title, description, category, price, images, stock }) {
        return new Product(id, title, description, category, Math.round(price * 100), images[0], stock);
    }

    getPriceEuro() {
        return formatPrice(this.price);
    }
}

// Una línea del carrito: qué producto, cuántas unidades y a qué precio.
class LineItem {
    constructor(product, quantity, price) {
        checkProduct(product);
        checkPositiveNumber(quantity);
        checkPositiveNumber(price);
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

    getSubtotal() {
        return this.quantity * this.price;
    }
}

export default Product;
export {
    LineItem,
    Product
}
