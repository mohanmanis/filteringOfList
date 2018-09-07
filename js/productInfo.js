//let cart = (JSON.parse(localStorage.getItem('cart')) || []);
const productsDOM = document.querySelector('.products');
const priceMinFiltersDOM = document.querySelector('.price-min-select');
const priceMaxFiltersDOM = document.querySelector('.price-max-select');
const colorFiltersDOM = document.querySelector('.color-filter');
let minPriceValueFilter = 'Min';
let maxPriceValueFilter = 'Max';
let products =[];
let selectedColor = [];

getProductsInfo();
getFiltersInfo();
function insertItemToDOM(product) {
    productsDOM.insertAdjacentHTML('beforeend', `
    <div class="product" data-id="${product.id}">
          <img class="product__image" src="${product.image}" alt="${product.title}">
          <h3 class="product__name">${product.brand} ${product.title}</h3>
          <h3 class="product__price">${product.price.final_price}</h3>
          <h3 class="product__price">${product.price.final_price}</h3>
           <h3 class="product__price">${product.colour.title}</h3>
          <h3 class="product__quantity">${product.discount}</h3>
          <h3 class="product__quantity">${product.rating}</h3>
    </div>
  `);
}

 function getProductsInfo(notrender){
    var DATA_URL= `https://demo1853299.mockable.io/products`;
    fetch(DATA_URL)
        .then((res)=> res.json())
        .then((data)=>{
            products = data.products;
           if(!notrender){
               products.forEach(product =>{
                   insertItemToDOM(product);
               })
           }
        });
}

/*
filters logic
*/
function insertPriceOptionsToDOM(price,domElement) {
    domElement.insertAdjacentHTML('beforeend', `
     <option value="${price.key}" >${price.displayValue}</option>
  `);
}


function insertPriceFiltersToDOM(price) {
    if(price.key ==='Min' || (price.key >0 && price.key !== 'Max')) insertPriceOptionsToDOM(price,priceMinFiltersDOM);
    if( price.key ==='Max' || (price.key >0 && price.key !=='Min')) insertPriceOptionsToDOM(price,priceMaxFiltersDOM );
}

function getFiltersInfo(){
    let FILTER_URL= `http://demo1853299.mockable.io/filters`;
    fetch(FILTER_URL)
        .then((res)=> res.json())
        .then((data)=>{
            let filters = data.filters;
            filters.forEach((filter) =>{
                if(filter.type==='PRICE'){
                    filter.values.forEach((priceFilterValue) =>{
                        insertPriceFiltersToDOM(priceFilterValue);
                    });
                 priceMaxFiltersDOM.lastElementChild.setAttribute("selected","")
                }
                if(filter.type==='COLOUR'){
                    filter.values.forEach((colorFilterValue) =>{
                        createColorFilter(colorFilterValue);
                    })
                }
            })
        });
}

document.querySelector(".price-min-select").addEventListener("change", (evt) =>{
    minPriceValueFilter = evt.target.value;
    hideProductsBasedOnFilter('price');
});

document.querySelector(".price-max-select").addEventListener("change", (evt) =>{
    maxPriceValueFilter = evt.target.value;
    hideProductsBasedOnFilter('price');
});
function createColorFilter (color){
    colorFiltersDOM.insertAdjacentHTML('beforeend', `
    <label class="container">
        <input type="checkbox" onclick="handleColorFilter(this)" readonly data-value="${color.title}">
        <span class="checkmark"></span>
         <div class="color-filter-color" style="background-color:${color.color};"></div>
         <div class="color-filter-text">${color.title}</div>
      </label>
  `);
}


function brandSearchFunction() {
    // Declare variables
    let input, filter;
    input = document.getElementById('searchBrand');
    filter = input.value.toUpperCase();
    hideProductsBasedOnFilter('brand',filter);
}

function findProductById (prodId){
    return products.filter(product=>{
        if(product.id === prodId) return product;
    })[0]
}

function hideProductsBasedOnFilter(type,filter){
    // Loop through all list items, and hide those who don't match the search query
    for (let i = 0; i < productsDOM.children.length; i++) {
        let currProduct = findProductById(productsDOM.children[i].getAttribute('data-id'));
        let condition='';
        switch (type) {
            case 'brand':
               condition = (type =='brand' && currProduct['brand'].toUpperCase().indexOf(filter) > -1);
                break;
            case 'price':
                condition = (type =='price' && (currProduct.price.final_price <= (maxPriceValueFilter=='Max'?4000:maxPriceValueFilter)) && (currProduct.price.final_price >= (minPriceValueFilter=='Min'?0:minPriceValueFilter)));
                break;
            case 'color':
                condition = (selectedColor.length == 0 || type =='color' && selectedColor.indexOf(currProduct.colour.title ) >-1 );
                break;
        }
        if (condition) {
            productsDOM.children[i].style.display = "";
        } else {
            productsDOM.children[i].style.display = "none";
        }
    }
}

function handleColorFilter(cb){
  let filter = cb.getAttribute('data-value');
  if(cb.checked) {
      selectedColor.push(filter);
      hideProductsBasedOnFilter('color');
  }
  else{
      let index = selectedColor.indexOf(filter);
      selectedColor.splice(index,1);
      hideProductsBasedOnFilter('color');
  }
}
function sortByPrice (type){
   products.sort((a,b)=>{
       let comparison = 0;
       if (a.price.final_price < b.price.final_price )
           comparison =  -1;
       if (a.price.final_price  > b.price.final_price )
           comparison =  1;
       return type=='asc'? comparison:comparison * -1;
    });
    productsDOM.innerHTML='';
    products.forEach(product =>{
        insertItemToDOM(product);
    });
}
