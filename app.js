// variables
const cartBtn = document.querySelector('#cart-btn');
const productCenter = document.querySelector('#product-center');
const cartOverlay = document.querySelector('#cart-overlay');
const cartBox = document.querySelector('#cart-box');
const closeCartBtn = document.querySelector('#close-cart');
const cartBody = document.querySelector('#cart-body');
const cartBtnAmount = document.querySelector('#cart-btn-amount');

let cart = [];
let buttons = [];
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
         buttons = allButtons;
        console.log(buttons)
        allButtons.forEach(button=>{
            button.addEventListener('click',e=>{
                const element = e.target;
                const id = element.dataset.id;
                this.addToCart(id);
                // in cart btn
                element.innerText = "in Cart";
                element.disabled = true;
                element.classList.add('in-cart');
                // showcart
                cartOverlay.classList.add('show-cart');
                // cart logic
                this.cartLogic();
            
            })
        })
    }

    // in cart
    inCart(){
        const cartButtons = cart.map(button => button.id);
        cartButtons.forEach(button=>{
            this.addInCart(button)
        })
    }

    // add in cart
    addInCart(id){
        buttons.forEach(button=>{
            if(button.dataset.id === id){
                button.classList.add('in-cart');
                button.innerText = 'in Cart';
                button.disabled = true;
            }
        })
    }
    // add to cart
    addToCart(id){
        let amount = 1;
        const products = Storage.getSavedProducts();
        const product = products.find(item=>{
            return item.id === id;
        });
        product.amount = amount;
        cart = [...cart,product];
        Storage.saveCart(cart);
        this.DisplayCart(product);

    }
    DisplayCart(item){
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
                    <span class="cart-amount">${item.amount}</span>
                    <i class="fas fa-chevron-down" data-id="${item.id}"></i>
                </div>
            <!-- one Cart -->
            `;
            div.classList.add('cart-item');
            cartBody.appendChild(div);
    }

    // set App all
    setAppAll(){
        if(localStorage.getItem('cart').length > 0){
            cart = Storage.getSavedCart();
            cart.forEach(item=>{
                this.DisplayCart(item);
                this.inCart();
                this.cartLogic();
            })
        }
    }
    // cart logic
    cartLogic(){
        // amount
        let amount = 0;
        cart.map(item=>{
            amount += item.amount;
        });
        cartBtnAmount.innerText = amount;
        
        // eventlisteners

        // cartBody.addEventListener('click',e=>{
        //     console.log(e.target);
        // })
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
        console.log(cart)
    }
    static getSavedCart(){
        return JSON.parse(localStorage.getItem('cart'));
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
        ui.setAppAll();
    })

})