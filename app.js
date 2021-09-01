// variables
const cartBtn = document.querySelector('#cart-btn');
const productCenter = document.querySelector('#product-center');
const cartOverlay = document.querySelector('#cart-overlay');
const cartBox = document.querySelector('#cart-box');
const closeCartBtn = document.querySelector('#close-cart');
const cartBody = document.querySelector('#cart-body');

let cart = [];
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
        });

        // showcart
        this.showCart();
        // clsoe cart
        this.closeCart();
    }
    showCart(){
          cartBtn.addEventListener('click',()=>{
            cartOverlay.classList.add('show-cart');
        });
    }
    closeCart(){
            closeCartBtn.addEventListener('click',()=>{
            cartOverlay.classList.remove('show-cart');
            
        });
    }

    // buttons
    getButtons(){
        const allButtons = [...document.querySelectorAll('.add-cart-btn')];

        allButtons.forEach(button=>{
            button.addEventListener('click',e=>{
                const element = e.target;
                const id = element.dataset.id;
                this.addToCart(id);
                // showcart
                cartOverlay.classList.add('show-cart');
            })
        })
    }

    // add to cart
    addToCart(id){
        let products = Storage.getSavedProducts();
        products = products.find(item=>{
            return item.id === id;
        });
        cart = [...cart,products];
        Storage.saveCart(cart);
        this.DisplayCart(cart);
        console.log(cart);

    }
    DisplayCart(cart){
        console.log(cart)
        cart.forEach(item=>{
            let div = document.createElement('div');
            div.innerHTML= `
            <!-- one Cart -->
                <img src="${item.image}" alt="product">
                <div class="info">
                    <span class="cart-title">${item.title}</span>
                    <span class="cart-price">${item.price}</span>
                    <span class="remove">Remove</span>
                </div>
                <div class="cart-in-dec">
                    <i class="fas fa-chevron-up" data-id="${item.id}"></i>
                    <span class="amount">0</span>
                    <i class="fas fa-chevron-down" data-id="${item.id}"></i>
                </div>
            <!-- one Cart -->
            `;
            div.classList.add('cart-item');
            cartBody.appendChild(div);
        });
    }

}

// save products
class Storage{
    static saveProducts(products){
        localStorage.setItem('products', JSON.stringify(products));
    }
    static getSavedProducts(){
        return JSON.parse(localStorage.getItem('products'));
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

window.addEventListener('DOMContentLoaded', ()=>{
    const ui = new Ui();
    const products = new Products();
    products.getProducts().then(products =>{
        ui.displayProducts(products);
        Storage.saveProducts(products);
    })
    .then(()=>{
        ui.getButtons();
    })

})