
class User {
    constructor(id,firstName,lastName,email){
        this.id = id;
        this.firstName= firstName;
        this.lastName = lastName;
        this.email = email;
    }
    getFullName(){
        return `${this.firstName} ${this.lastName}`;
    }
    static fromJson({id,firstName,lastName,email}){
        const user = new User(id,firstName,lastName,email);
        return user;
    }
}

class Client extends User {
    constructor(id,firstName,lastName,email){
        super(id,firstName,lastName,email);
        this.cart = null;
        this.orders = [];
    }
    static fromJson({id,firstName,lastName,email}){
        const client = new Client(id,firstName,lastName,email);
        return client;
    }
}

export {
    User,
    Client
}