const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warning")
const openingHours = document.getElementById("opening-hours")

let cart = [];

// Abrindo o modal
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = 'flex'
})

// Fechando o modal (clicar fora)
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// Fechando o modal (botão Fechar)
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// Adicionar itens no carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    //Identificar o nome e o valor
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

    //Adicionar no carrinho
    addToCart(name, price)
    }
})

// Função para adicionar item no carrinho
function addToCart(name, price){
    //Verifica que esse item já está no carrinho
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item já existe, aumenta apenas a quantidade
        existingItem.qtd += 1;
    }
    else{
        cart.push({
            name,
            price,
            qtd: 1,
         })
    }
    updateCartModal()
}

// Atualizando o carrinho (modal)
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let totalAmount = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between" >
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.qtd}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
        </div>
        `
        totalAmount += item.qtd;
        total += item.price * item.qtd;


        cartItemsContainer.appendChild(cartItemElement)
    })

    //Exibindo o total do pedido
    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    // Atualizando o contador do footer
    cartCounter.innerHTML = totalAmount;
}

//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name); //acha a posição do item no array

    if(index !== -1){
        const item = cart[index];

        if(item.qtd > 1){
            item.qtd -= 1;
            updateCartModal();
            return;            
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

//Lendo o input de endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
    }
})

// Finalizando o pedido
checkoutBtn.addEventListener("click", function(){
    //verifica se o restaurante está fechado
    //const isOpen = checkRestaurantOpen();
    //if(!isOpen){
    //    alert("Agradecemos o pedido, mas estamos fechados no momento!");
    //    return;
    //}

    //verifica se o carrinho está vazio
    if(cart.length === 0) return; 

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviando o pedido para o WhatsApp
    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: ${item.qtd} Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "11942862050"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

// Verificar se o restaurante está aberto
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    const dia = data.getDay();
    return hora >= 7 && hora < 17 && dia !== 1;
    //se TRUE, está ABERTO.
}

//Sinalizar que o restaurante está fechado
isOpen = checkRestaurantOpen();
if(isOpen){
    openingHours.classList.remove("bg-red-500")
    openingHours.classList.add("bg-pink-400")   
}
else{
    openingHours.classList.add("bg-red-500")
    openingHours.classList.remove("bg-pink-400") 
}