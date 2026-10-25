import Product from "../core/Product.js";
import { Client } from "../core/User.js";
import { NotAProductError, NotPositiveNumberError, NotAClientError } from "./errors.js";

function checkProduct(product) {
    if (!(product instanceof Product)) {
        throw new NotAProductError();
    }
    return true;
}

function checkClient(client) {
    if (!(client instanceof Client)) {
        throw new NotAClientError();
    }
    return true;
}

function checkPositiveNumber(number) {
    if (typeof number !== "number" || number < 0) {
        throw new NotPositiveNumberError();
    }
    return true;
}

// Los precios se guardan en céntimos (enteros) para evitar errores de decimales.
// Esta función los convierte a texto: 1999 -> "19.99€"
function formatPrice(cents) {
    return (cents / 100).toFixed(2) + "€";
}

export {
    checkPositiveNumber,
    checkProduct,
    checkClient,
    formatPrice
}
