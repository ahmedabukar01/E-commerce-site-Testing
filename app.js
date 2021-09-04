// variables
const cartBtn = document.querySelector('#cart-btn');
const productCenter = document.querySelector('#product-center');
const cartOverlay = document.querySelector('#cart-overlay');
const cartBox = document.querySelector('#cart-box');
const closeCartBtn = document.querySelector('#close-cart');
const cartBody = document.querySelector('#cart-body');
const cartBtnAmount = document.querySelector('#cart-btn-amount');
const cartTotal = document.querySelector('#total');
const clearCart = document.querySelector('#clear-cart')
let cartAmount = 0;
let cartItem = 0;
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
        if(!localStorage.getItem('cart')){
            this.cartLogic();
        }
        let amount = 1;
        const products = Storage.getSavedProducts();
        const product = {...products.find(item=>{
            return item.id === id;
        }),amount};
        console.log(product)
        cart = [...cart,product];
        Storage.saveCart(cart);
        this.DisplayCart(product);
        this.getTotalCart();
        this.addInCart(id);

    }
    DisplayCart(item){
            let div = document.createElement('div');
            div.innerHTML= `
            <!-- one Cart -->
                <img src="${item.image}" alt="product">
                <div class="info">
                    <span class="cart-title">${item.title}</span>
                    <span class="cart-price">${item.price}</span>
                    <span class="remove" data-id="${item.id}">Remove</span>
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
        if(localStorage.getItem('cart')){
            cart = Storage.getSavedCart();
            
            cart.forEach(item=>{
                this.DisplayCart(item);
            });
            this.inCart();
            this.getTotalCart();
            this.cartLogic();
        }
    }
    // cart logic
    cartLogic(){
        // event listeners
        cartBody.addEventListener('click',e=>{
            if(e.target.classList.contains('remove')){
                this.removeCart(e.target.dataset.id);
                this.removeDOM(e.target);
                
            }
            else if(e.target.classList.contains('fa-chevron-up')){
                this.increaseCart(e.target)
                console.log('if')
            }
            else if(e.target.classList.contains('fa-chevron-down')){
                this.decreaseCart(e.target)
                console.log('if')
            }
        })

        // clear cart
        clearCart.addEventListener('click',e=>{
            this.clearAllCart();
        })
    }

    // get total
    getTotalCart(){
      if(localStorage.getItem('cart')){
        let totalCart = 0;
        cart.forEach(item=>{
            const totalItem = item.price * item.amount;
            totalCart += totalItem;
        });
        cartTotal.innerText = totalCart;

        // amount
        let amount = 0;
        cart.map(item=>{
            amount += item.amount;
        });
        cartBtnAmount.innerText = amount;
      }
        
    }
    // remove cart
    removeCart(id){
        cart = cart.filter(item=> item.id !== id);
        Storage.saveCart(cart);
        this.getTotalCart();
        const button = buttons.find(item=>item.dataset.id === id);
        console.log(button)
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
        button.classList.remove('in-cart');
        button.disabled = false;

    }
    removeDOM(element){
        cartBody.removeChild(element.parentElement.parentElement);
    }
    // increase cart
    increaseCart(element){
        const id = element.dataset.id;
        const item = cart.find(item=>item.id === id);
        // cart.forEach(item=>{
        //     if(item.id ===id){
        //         item.amount++;
        //     }
            
        // });
        item.amount = item.amount +1;
        element.nextElementSibling.innerText = item.amount;
        Storage.saveCart(cart);
        this.getTotalCart();
        
    }
     // Decrease cart
     decreaseCart(element){
        const id = element.dataset.id;
        const item = cart.find(item=>item.id === id);
    
      if(item.amount>1){
        item.amount = item.amount -1;
        element.previousElementSibling.innerText = item.amount;
        Storage.saveCart(cart);
        this.getTotalCart();
      }
      else{
          this.removeCart(element);
      }
        
    }

    // clear cart
    clearAllCart(){
       if(cart.length>0){
        cart.forEach(item=>this.removeCart(item.id));
        while(cartBody.children.length>0){
            cartBody.removeChild(cartBody.children[0]);
        }
        cartOverlay.classList.remove('show-cart');
       }
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
    static getOneProduct(id){
        const cart = JSON.parse(localStorage.getItem('cart'));
        return {...cart.filter(item=>item.id === id)}
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
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