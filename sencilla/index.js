import Shop from "./core/Shop.js";
import Product from "./core/Product.js";
import Cart from "./core/Cart.js";
import { Client } from "./core/User.js";
import { createProductCard, renderCategoryOptions, renderCart } from "./ui/renderer.js";
import data from "./data/products.json" with { type: "json" };

// ===================== DATOS =====================

const shop = new Shop("Mi tienda");

for (const json of data.products) {
    const product = Product.fromJson(json);
    shop.addProduct(product, json.stock);
}

const client = new Client(1, "Yisus", "Krais", "yisus.krais@god.com");
const cart = new Cart(client);

// ===================== ESTADO DE LA PÁGINA =====================

const PRODUCTS_PER_PAGE = 10;
let currentPage = 1;
let productsToShow = shop.getProducts(); // al filtrar, aquí guardamos el resultado

// ===================== ELEMENTOS DEL HTML =====================

const productList = document.getElementById("product__list");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageInfo = document.getElementById("page-info");
const filterForm = document.getElementById("filter-form");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const cartButton = document.getElementById("cart-button");
const cartSection = document.getElementById("cart");

// ===================== FUNCIONES =====================

function getTotalPages() {
    if (productsToShow.length === 0) {
        return 1; // aunque no haya resultados, mostramos "Page 1 of 1"
    }
    return Math.ceil(productsToShow.length / PRODUCTS_PER_PAGE);
}

// Pinta los productos de la página actual
function showPage() {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const pageProducts = productsToShow.slice(start, end);

    productList.innerHTML = "";

    for (const entry of pageProducts) {
        const card = createProductCard(entry.product, entry.stock);

        const buyButton = card.querySelector(".buy-button");
        buyButton.addEventListener("click", () => {
            buyProduct(entry.product);
        });

        productList.append(card);
    }

    // Actualizamos el texto y los botones de paginación
    pageInfo.textContent = "Page " + currentPage + " of " + getTotalPages();
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= getTotalPages();
}

function buyProduct(product) {
    // Unidades que ya hay en el carrito + la que queremos añadir
    const line = cart.getLine(product.id);
    let quantityWanted = 1;
    if (line) {
        quantityWanted = line.quantity + 1;
    }

    if (!shop.hasStock(product.id, quantityWanted)) {
        alert("Not enough stock of " + product.title);
        return;
    }

    cart.add(product, 1);
    showCart();
}

function showCart() {
    cartButton.textContent = "🛒 " + cart.getTotalQuantity();
    renderCart(cartSection, cart);
}

// ===================== EVENTOS =====================

prevButton.addEventListener("click", () => {
    currentPage--;
    showPage();
});

nextButton.addEventListener("click", () => {
    currentPage++;
    showPage();
});

filterForm.addEventListener("submit", (event) => {
    event.preventDefault(); // para que no se recargue la página
    productsToShow = shop.filterProducts(searchInput.value, categorySelect.value);
    currentPage = 1;
    showPage();
});

cartButton.addEventListener("click", () => {
    cartSection.classList.toggle("hidden");
});

// ===================== INICIO =====================

renderCategoryOptions(categorySelect, shop.getCategories());
showPage();
showCart();
