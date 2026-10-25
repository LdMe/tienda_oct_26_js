import Shop from "./core/Shop.js";
import Product from "./core/Product.js";
import Cart from "./core/Cart.js";
import { Client } from "./core/User.js";
import { createProductCard, renderCategoryOptions, renderCart } from "./ui/renderer.js";
import { fetchProducts } from "./api.js";
import { saveCart, loadCartLines } from "./storage.js";

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
const cartLines = document.getElementById("cart-lines");
const emptyCartButton = document.getElementById("empty-cart-button");

// ===================== DATOS (desde la API) =====================

// Como index.js es un módulo (type="module"), podemos usar await aquí directamente.
// Pedimos TODOS los productos una sola vez y luego paginamos y filtramos nosotros.
productList.textContent = "Loading products...";

let data;
try {
    data = await fetchProducts(); // sin parámetros → limit=0 → todos
    // Sin conexión, se puede usar la copia local en su lugar:
    // data = (await import("./data/products.json", { with: { type: "json" } })).default;
} catch (error) {
    productList.textContent = "Could not load the products. Please try again later.";
    throw error; // paramos aquí: sin productos no hay tienda
}

const shop = new Shop("Mi tienda");

for (const json of data.products) {
    const product = Product.fromJson(json);
    shop.addProduct(product, json.stock);
}

const client = new Client(1, "Yisus", "Krais", "yisus.krais@god.com");
const cart = new Cart(client);

// Recuperamos el carrito guardado en localStorage (si lo hay).
// Si el producto ya no existe o ya no hay stock suficiente, esa línea se ignora.
for (const saved of loadCartLines()) {
    if (shop.hasStock(saved.id, saved.quantity)) {
        const entry = shop.findProduct(saved.id);
        cart.add(entry.product, saved.quantity);
    }
}

// ===================== ESTADO DE LA PÁGINA =====================

const PRODUCTS_PER_PAGE = 10;
let currentPage = 1;
let productsToShow = shop.getProducts(); // al filtrar, aquí guardamos el resultado

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
    updateCart();
}

function removeFromCart(productId) {
    cart.remove(productId, 1);
    updateCart();
}

// Cada vez que el carrito cambia: lo guardamos y lo volvemos a pintar
function updateCart() {
    saveCart(cart);
    showCart();
}

function showCart() {
    cartButton.textContent = "🛒 " + cart.getTotalQuantity();
    renderCart(cartLines, cart);

    // Los botones "−1" se acaban de crear, así que les ponemos su listener ahora.
    // dataset siempre es texto: lo pasamos a número para buscar en el carrito.
    for (const button of cartLines.querySelectorAll(".remove-button")) {
        button.addEventListener("click", () => {
            removeFromCart(Number(button.dataset.productId));
        });
    }
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

emptyCartButton.addEventListener("click", () => {
    cart.clear();
    updateCart();
});

// ===================== INICIO =====================

renderCategoryOptions(categorySelect, shop.getCategories());
showPage();
showCart();
