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

    //Aviso de item adicionado ao clicar
    Toastify({
        text: `${name}, Adicionado ao carrinho`,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#363636",
        },
    }).showToast();
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

//Verifica o imput de endereço
addressInput.addEventListener("input", function(event){
    let inputVaçue = event.target.value;
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")


})

//Finalizando Pedido
checkoutBtn.addEventListener("click", function(){
    //Verifica se o restaurante ta aberto
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, estamos fechados",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    //Verifica se digitou o endereço antes de avançar
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Envia o pedido para o wpp
    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "85985646542"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,"_blank")

    //Zera carrinho depois de finalizar
    cart = [];
    addressInput.value="";
    updateCartModal();
    cartModal.style.display = "none"

})


//Verifica se o restaurante esta aberto
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 22;
    //true = Restaurante aberto e aceita pedido
}

//Muda cor do horario de funionamento mediante a hora da maquina 
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
