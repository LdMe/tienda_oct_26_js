import { FetchError } from "./errors.js";
const API_URL = "https://dummyjson.com/products";
const API_KEY = "ksjdfhksjdfhksjdfd";

async function fetchData(url){
    try{
        const response = await fetch(url,{
            headers:{
                Authorization: "Bearer "+API_KEY
            }
        });
        if(!response.ok){
            throw new FetchError(response);
        }
        const result = await response.json();
        return {
            error: null,
            data: result
        }

    }catch(error){
        console.error(error);
        return {
            error: error,
            data: null
        }
    }
}

function getProducts(filters={q:"",category:""},page=1,pageSize=10){
    let finalUrl = API_URL;
    if(filters.category){
        finalUrl += `/category/${filters.category}`;
    }

    const urlClass = new URL(finalUrl);

    if(filters.q){
        // finalUrl +=`?q=${filters.q}`;
        urlClass.searchParams.append("q",filters.q);
        
    }
    
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    urlClass.searchParams.append("skip",skip);
    urlClass.searchParams.append("limit",limit);
    finalUrl = urlClass.toString();
    console.log(finalUrl);
    return fetchData(finalUrl);
}

function getCategories(){
    const finalUrl = API_URL+"/category-list";
    return fetchData(finalUrl);
}

const result = await getProducts({},2,20)
console.log(result);
export {
    getProducts,
    getCategories
}