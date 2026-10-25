class User {
    constructor(id, firstName, lastName, email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    static fromJson({ id, firstName, lastName, email }) {
        return new User(id, firstName, lastName, email);
    }
}

class Client extends User {
    constructor(id, firstName, lastName, email) {
        super(id, firstName, lastName, email);
        this.orders = [];
    }
    static fromJson({ id, firstName, lastName, email }) {
        return new Client(id, firstName, lastName, email);
    }
}

export {
    User,
    Client
}
