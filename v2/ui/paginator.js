// Paginador genérico: no sabe nada de productos, tiendas ni filtros.
//
// Versión 2 (servidor): NO recibe los datos. Recibe una función fetchPage
// a la que pide "dame la página N" y que le devuelve { items, total }.
// Cortar la página es trabajo de quien tiene los datos, no del paginador.
//
// CONTRATO de fetchPage:
//   fetchPage({ page, pageSize, ...params })  ->  { items, total }
//
// Los params (filtros) son un objeto que el paginador guarda y reenvía
// sin saber qué significan.
class Paginator {
    constructor({ containerId, fetchPage, renderItem, pageSize = 10, infiniteScroll = false, onChange = () => {} }) {
        this.container = document.getElementById(containerId);
        this.fetchPage = fetchPage;       // ({ page, pageSize, ...params }) => { items, total }
        this.renderItem = renderItem;     // item => nodo del DOM
        this.pageSize = pageSize;
        this.infiniteScroll = infiniteScroll;
        this.onChange = onChange;         // se llama después de cada carga
        this.params = {};
        this.currentPage = 1;
        this.total = 0;                   // lo sabemos por la respuesta, no por los datos
    }

    get totalPages() {
        return Math.max(1, Math.ceil(this.total / this.pageSize));
    }

    hasNext() {
        return this.currentPage < this.totalPages;
    }

    hasPrevious() {
        return this.currentPage > 1;
    }

    // Pide una página y la pinta.
    // append = true: añade debajo (scroll infinito). false: sustituye la página.
    load(page, append = false) {
        const { items, total } = this.fetchPage({
            ...this.params,
            page: page,
            pageSize: this.pageSize
        });

        this.currentPage = page;
        this.total = total;

        if (!append) {
            this.container.replaceChildren();
        }
        const nodes = items.map(item => this.renderItem(item));
        this.container.append(...nodes);

        this.onChange(this);
    }

    // Nuevos filtros: volvemos a la página 1 y limpiamos
    setParams(params) {
        this.params = params;
        this.load(1);
    }

    nextPage() {
        if (this.hasNext()) {
            this.load(this.currentPage + 1, this.infiniteScroll);
        }
    }

    previousPage() {
        // Con scroll infinito no tiene sentido "volver": las páginas anteriores ya se ven
        if (!this.infiniteScroll && this.hasPrevious()) {
            this.load(this.currentPage - 1);
        }
    }
}

export default Paginator;
