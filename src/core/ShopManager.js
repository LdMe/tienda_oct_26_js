import Shop from "./Shop.js";
import { Client } from "./User.js";
import Cart from "./Cart.js";
import Paginator from "../ui/paginator.js";
import { createProductArticle, renderFilterForm, renderCart } from "../ui/renderer.js";

class ShopManager {
    constructor(products) {
        this.shop = new Shop("tienda pruebas");
        this.client = new Client(1, "Yisus", "Krais", "yisus.krais@god.com")
        this.cart = new Cart(this.client)
        products.forEach(p => this.shop.addProduct(p, 5));

        this.categories = this.shop.getCategories();

        renderFilterForm("search-menu", this.categories)
    }
    createPaginator() {
        const products = this.shop.getProducts();
        const paginator = new Paginator("product__list", products, createProductArticle, 10)
        paginator.render();

        const prevButton = document.getElementById("prev-button");
        const nextButton = document.getElementById("next-button");

        prevButton.addEventListener("click", () => {

            paginator.previousPage();
            this.createAddToCartFunctionality();
        });
        nextButton.addEventListener("click", () => {
            paginator.nextPage();
            this.createAddToCartFunctionality();
        });
        this.createAddToCartFunctionality();
        return paginator;
    }
    createAddToCartFunctionality() {
        const addProductButtons = document.querySelectorAll("button.buy-button");
        renderCart("cart-section", this.cart);
        for (const button of addProductButtons) {
            button.addEventListener("click", (e) => {
                const parent = e.target.parentElement;
                const productId = parent.dataset.productId;
                const product = this.shop.findProduct(parseInt(productId));
                console.log(product)
                this.cart.add(product.product, 1);
                renderCart("cart-section", this.cart)
            })
        }
    }
}

export default ShopManager;