class NotAProductError extends Error {
    constructor() {
        super("This is not a product");
        this.name = "NotAProductError";
    }
}
class NotAClientError extends Error {
    constructor() {
        super("This is not a client");
        this.name = "NotAClientError";
    }
}
class NotPositiveNumberError extends Error {
    constructor(){
        super("It must be 0 or a positive number");
        this.name = "NotPositiveNumberError";
    }
}


export {
    NotAProductError,
    NotPositiveNumberError,
    NotAClientError
}