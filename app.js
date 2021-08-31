// variables
const cartBtn = document.querySelector('#cart-btn');
const productCenter = document.querySelector('#product-center');


// get products
class Products{
   async getProducts(){
       try{
           const res = await fetch('products.json');
           const data = await res.json();
           const products = data.items.map(item =>{
               const {title,price} = item.fields;
               const {id} = item.sys;
               const image = item.fields.image.fields.file.url;
               return {id,title,price,image};
           });
           return products;
       } catch(err){
           console.log(err);
       }
    }
}

// display products
class Ui{
    displayProducts(products){
        console.log(products);
        products.forEach(item=>{
            const div = document.createElement('div');
            div.innerHTML = `
            <!-- one product -->
                   <div class="img-box">
                    <img src="${item.image}" alt="product">
                   </div>
                    <div>
                        <span class="title">${item.title}</span>
                        <span class="price">$${item.price}</span>
                        <button class="add-cart-btn" data-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i>
                            add to cart
                        </button>
                    </div>
                <!-- one product -->
            `;
            div.classList.add('product-box');
            productCenter.appendChild(div);
        })
    }
}

// save products
class Storage{
    static saveProducts(products){

    }
}

window.addEventListener('DOMContentLoaded', ()=>{
    const ui = new Ui();
    const products = new Products();
    products.getProducts().then(products =>{
        ui.displayProducts(products);
        Storage.saveProducts(products);
    })

})