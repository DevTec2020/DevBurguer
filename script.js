const menu= document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart=[];

//Abre o modal ao clicar em Ver o carrinho
cartBtn.addEventListener('click',function(){
    updateCartModal()
    cartModal.style.display = "flex"
})

//Fecha o modal quando clicar fora
cartModal.addEventListener("click",function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click",function(){
    cartModal.style.display = "none"
})

//Verifica qual item o usuário clicou para add no carrinho
menu.addEventListener("click",function(event){
    let parentButton = event.target.closest(".add-to-card-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

//Função para adicionar no carrinho
function addToCart(name, price){
    //Busca se já tem o item na lista
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item existir, ele só adiciona +1
        existingItem.quantity += 1;
    }else{
        //add item na lista
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}


//Atualiza o Modal do Carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex","justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML=`
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
                
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    });

    //Aqui ele atualiza o valor total e o toLocaleString faz fcar no padrão Real BR
    cartTotal.textContent=total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//Função que remove o item do carrinho
cartItemsContainer.addEventListener("click",function(event){
    //Verificando se clicou em remover e pegando qual o nome do item
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

//Aqui ele remove de fato
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart [index];
        //remove só 1 da qtd
        if(item.quantity > 1){
            item.quantity -=1;
            updateCartModal();
            return;
        }

        //remove produto
        cart.splice(index,1);
        updateCartModal();
    }
}
