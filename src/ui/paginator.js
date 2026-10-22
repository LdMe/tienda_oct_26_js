

class Paginator {
    constructor(sectionId, data, renderCallback, elementsPerPage = 10, infiniteScroll = false) {
        this.data = data;
        this.currentPage = 1;
        this.elementsPerPage = elementsPerPage;
        this.sectionId = sectionId;
        this.renderCallback = renderCallback;
        this.infiniteScroll = infiniteScroll;
        this.totalPages = Math.ceil(this.data.length / this.elementsPerPage);
        this.container = document.getElementById(sectionId);
    }
    render() {
        const firstElement = (this.currentPage - 1) * this.elementsPerPage;
        const lastElement = firstElement + this.elementsPerPage;
        const dataToShow = this.data.slice(firstElement, lastElement);
        if (!this.infiniteScroll) {
            this.container.innerHTML = "";
        }
        const nodes = dataToShow.map(node => this.renderCallback(node));
        this.container.append(...nodes);
    }
    nextPage(){
        if(this.currentPage < this.totalPages){
            this.currentPage++;
            this.render();
        }
    }
    previousPage(){
        if(this.currentPage > 1){
            this.currentPage--;
            this.render();
        }
    }




}

export default Paginator;