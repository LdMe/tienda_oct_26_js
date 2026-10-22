import Shop from "./core/Shop.js";
import Product from "./core/Product.js";
import data from "./data/products.json" with { type: "json" };
import { Client } from "./core/User.js";
import Cart from "./core/Cart.js";
import Paginator from "./ui/paginator.js";
import { createProductArticle,renderFilterForm} from "./ui/renderer.js";


const shop = new Shop("tienda pruebas");


const products = data.products.map(p => Product.fromJson(p));
products.forEach(p=>shop.addProduct(p,5));

const categories = shop.getCategories();

renderFilterForm("search-menu",categories)

console.log(products.length)
const paginator = new Paginator("product__list",products,createProductArticle,10,true)
paginator.render();

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

prevButton.addEventListener("click",()=>paginator.previousPage());
nextButton.addEventListener("click",()=>paginator.nextPage());



// const client = new Client(1,"Yisus","Krais","yisus,krais@god.com")
// const cart = new Cart(client)
// products.slice(0,10).forEach(p=>shop.addProduct(p,5));

// cart.add(products[0],5);
// cart.add(products[1],2);
// console.log(cart.getTotalPrice(true));
// console.log(cart.getTotalQuantity());
// // console.log(shop.getProducts());

