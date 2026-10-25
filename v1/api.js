// Acceso a la API de DummyJSON.
// Este archivo es IDÉNTICO en las tres versiones: devuelve lo que manda la API,
// sin adaptarlo a ninguna. Cada versión se adapta a él.

const BASE_URL = "https://dummyjson.com/products";

// Devuelve lo que manda DummyJSON: { products, total, skip, limit }
// pageSize = 0 → todos los productos (DummyJSON usa limit=0 para eso)
// Ojo: la API no permite combinar búsqueda y categoría. Si hay texto, manda la búsqueda.
async function fetchProducts({ search = "", category = "", page = 1, pageSize = 0 } = {}) {
    const skip = (page - 1) * pageSize;
    let url = `${BASE_URL}?limit=${pageSize}&skip=${skip}`;

    if (search !== "") {
        url = `${BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${pageSize}&skip=${skip}`;
    } else if (category !== "") {
        url = `${BASE_URL}/category/${category}?limit=${pageSize}&skip=${skip}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Error loading products: " + response.status);
    }
    return await response.json();
}

// Devuelve un producto tal cual lo manda la API, o null si no existe
async function fetchProductById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        return null;
    }
    return await response.json();
}

// Devuelve la lista de categorías: ["beauty", "fragrances", ...]
async function fetchCategories() {
    const response = await fetch(`${BASE_URL}/category-list`);
    if (!response.ok) {
        throw new Error("Error loading categories: " + response.status);
    }
    return await response.json();
}

export { fetchProducts, fetchProductById, fetchCategories };
