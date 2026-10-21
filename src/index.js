import Shop from "./core/Shop.js";
import Product from "./core/Product.js";
import data from "./data/products.json" with { type: "json" };
import { Client } from "./core/User.js";
import Cart from "./core/Cart.js";

const shop = new Shop("tienda pruebas");

const products = data.products.map(p =>Product.fromJson(p));
const client = new Client(1,"Yisus","Krais","yisus,krais@god.com")
const cart = new Cart(client)
products.slice(0,10).forEach(p=>shop.addProduct(p,5));

cart.add(products[0],5);
cart.add(products[1],2);
console.log(cart.getTotalPrice(true));
console.log(cart.getTotalQuantity());
// console.log(shop.getProducts());

