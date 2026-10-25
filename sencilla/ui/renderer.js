// Funciones que SOLO crean o pintan elementos del DOM.
// No deciden qué pasa al hacer click: eso se hace en index.js.

import { formatPrice } from "../utils/functions.js";

// Crea la tarjeta de un producto y la devuelve (todavía no está en la página)
function createProductCard(product, stock) {
    const article = document.createElement("article");
    article.classList.add("product-card");

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;

    const title = document.createElement("h3");
    title.textContent = product.title;

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("p");
    price.textContent = product.getPriceEuro();

    const stockText = document.createElement("p");
    stockText.textContent = "Stock: " + stock;

    const button = document.createElement("button");
    button.textContent = "Buy";
    button.classList.add("buy-button");

    article.append(image, title, description, price, stockText, button);
    return article;
}

// Añade una <option> al <select> por cada categoría
function renderCategoryOptions(select, categories) {
    for (const category of categories) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.append(option);
    }
}

// Pinta las líneas del carrito y el total dentro de "section"
function renderCart(section, cart) {
    section.innerHTML = "";

    if (cart.isEmpty()) {
        section.textContent = "The cart is empty";
        return;
    }

    for (const line of cart.getLines()) {
        const article = document.createElement("article");
        article.classList.add("product-line");

        const image = document.createElement("img");
        image.src = line.product.image;
        image.alt = line.product.title;

        const title = document.createElement("h3");
        title.textContent = line.product.title;

        const quantity = document.createElement("p");
        quantity.textContent = "x" + line.quantity;

        const subtotal = document.createElement("p");
        subtotal.textContent = formatPrice(line.getSubtotal());

        article.append(image, title, quantity, subtotal);
        section.append(article);
    }

    const total = document.createElement("p");
    total.classList.add("total");
    total.textContent = "Total: " + cart.getTotalPrice(true);
    section.append(total);
}

export {
    createProductCard,
    renderCategoryOptions,
    renderCart
}
