class NotAProductError extends Error {
    constructor() {
        super("This is not a product");
        this.name = "NotAProductError";
    }
}
class FetchError extends Error {
    constructor(response){
        super("Error doing fetch: "+response.statusText);
        this.name ="FetchError";
        this.status = response.status;
    }
}
class NotAClientError extends Error {
    constructor() {
        super("This is not a client");
        this.name = "NotAClientError";
    }
}

class NotPositiveNumberError extends Error {
    constructor() {
        super("It must be 0 or a positive number");
        this.name = "NotPositiveNumberError";
    }
}

class ProductNotFoundError extends Error {
    constructor(id) {
        super(`Product ${id} not found`);
        this.name = "ProductNotFoundError";
    }
}

class NotEnoughStockError extends Error {
    constructor(title) {
        super(`Not enough stock of ${title}`);
        this.name = "NotEnoughStockError";
    }
}

export {
    NotAProductError,
    NotAClientError,
    NotPositiveNumberError,
    ProductNotFoundError,
    NotEnoughStockError,
    FetchError
}
