import Product from "../core/Product.js";
import { Client } from "../core/User.js";
import { NotAProductError,NotPositiveNumberError,NotAClientError } from "./errors.js";

function checkProduct(product) {
    if (!(product instanceof Product)) {
        throw new NotAProductError();
    }
    return true;
}
function checkClient(client){
    if (!(client instanceof Client)) {
        throw new NotAClientError();
    }
    return true;
}
function checkPositiveNumber(number){
    if (typeof number !== "number" || number < 0) {
        throw new NotPositiveNumberError();
    }

}

export {
    checkPositiveNumber,
    checkProduct,
    checkClient
}