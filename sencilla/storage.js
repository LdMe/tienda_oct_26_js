// Guardar y recuperar el carrito en localStorage.
// Este archivo es IDÉNTICO en las tres versiones.
//
// localStorage solo guarda TEXTO. Si guardáramos el carrito entero con
// JSON.stringify, al leerlo tendríamos objetos normales, no Product ni LineItem
// (se pierden los métodos como getSubtotal o getPriceEuro).
// Por eso guardamos solo lo mínimo: el id de cada producto y su cantidad.
// Al arrancar, cada versión vuelve a buscar el producto y lo añade al carrito,
// así además tiene el precio y el stock actualizados.

const CART_KEY = "cart";

// Guarda: [{ id: 1, quantity: 2 }, { id: 26, quantity: 1 }]
function saveCart(cart) {
    const lines = cart.getLines().map(line => {
        return { id: line.product.id, quantity: line.quantity };
    });
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
}

// Devuelve las líneas guardadas, o [] si no hay nada (o está estropeado)
function loadCartLines() {
    const text = localStorage.getItem(CART_KEY);
    if (text === null) {
        return [];
    }
    try {
        return JSON.parse(text);
    } catch (error) {
        return [];
    }
}

export { saveCart, loadCartLines };
