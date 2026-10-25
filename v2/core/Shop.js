import { ProductNotFoundError, NotEnoughStockError } from "../utils/errors.js";

// En esta versión la tienda NO guarda los productos: sabe DÓNDE pedirlos
// (el repositorio). Lo que le queda son las reglas de la tienda.
class Shop {
    constructor(name, productRepository) {
        this.name = name;
        this.products = productRepository;
    }

    // Estos métodos solo delegan en el repositorio. Así el resto de la app
    // habla siempre con Shop y no sabe si los datos vienen de memoria o de una API.
    search(params) {
        return this.products.search(params);
    }

    getCategories() {
        return this.products.getCategories();
    }

    getProduct(id) {
        return this.products.getById(id);
    }

    // Regla de negocio: no se puede añadir al carrito más de lo que hay en stock
    // (contando lo que ya está en el carrito).
    // Ojo: en una tienda real esto es solo orientativo; la comprobación
    // definitiva la hace el servidor al comprar.
    addToCart(cart, productId, quantity = 1) {
        const product = this.getProduct(productId);
        if (!product) {
            throw new ProductNotFoundError(productId);
        }
        const totalWanted = cart.getQuantity(productId) + quantity;
        if (product.stock < totalWanted) {
            throw new NotEnoughStockError(product.title);
        }
        cart.add(product, quantity);
    }
}

export default Shop;
