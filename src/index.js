
import Product from "./core/Product.js";
import data from "./data/products.json" with { type: "json" };
import ShopManager from "./core/ShopManager.js";



const products = data.products.map(p => Product.fromJson(p));
const shopManager = new ShopManager(products);
shopManager.createPaginator();



