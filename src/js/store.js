const buttons = document.querySelectorAll('.add-to-cart');
const cartCounter = document.querySelector('.counter');
const cartList = document.getElementById('cart-list');

function renderCart() {
    const cart = getCartFromStorage()
    cartList.innerHTML = '';

    removeImagTextInitialToCart(cart)
    itemsListCart(cart)
    totalCart(cart);
    updateCartItemCount(cart);
    updateStateOfButtons(cart);
}

function addToCart(event) {
    const dessertElement = event.target.closest('.dessert');
    const name = dessertElement.querySelector('.name-dessert').textContent.trim();
    const priceText = dessertElement.querySelector('.price')?.textContent.trim();
    const price = parseFloat(priceText?.replace('$', '').trim());

    const cartItem = {
        name,
        price,
        quantity: 1
    };

    const cart = getCartFromStorage()
    existingItem(cart, cartItem)

    saveCartToStorage(cart);
    renderCart();
}

function getCartFromStorage() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCartToStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function existingItem (cart, cartItem) {
    const existingItem = cart.find(item => item.name === cartItem.name);
    existingItem ? existingItem.quantity += 1 : cart.push(cartItem);
}

buttons.forEach(button => {
    button.addEventListener('click', addToCart);
});

function removeImagTextInitialToCart(cart) {
    const carText = document.querySelector('.cart p');
    const cartImage = document.querySelector('.cart img');

    if (cart.length === 0) {
        carText.style.display = 'block';
        cartImage.style.display = 'block';
    } else {
        carText.style.display = 'none';
        cartImage.style.display = 'none';
    }
}

function ImageDelet() {
    const novaImage = document.createElement('img');
    novaImage.src = "./src/images/icon-remove-item.svg";
    novaImage.alt = "Deletar item do carrinho";
    return novaImage;
}

function itemsListCart(cart) {
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        const nameElement = document.createElement('h4');
        nameElement.textContent = item.name;

        const descriptioItem = document.createElement('p');
        descriptioItem.textContent = `${item.quantity}x  unid.$${item.price.toFixed(2)}  = $${(item.price * item.quantity).toFixed(2)}`;

        const botaoDelet = document.createElement('button');
        botaoDelet.classList.add('remove-btn');

        botaoDelet.addEventListener('click', () => {
            const updatedCart = getCartFromStorage()

            updatedCart.splice(index, 1);
            saveCartToStorage(updatedCart)

            updateStateOfButtons(updatedCart)
            renderCart();
        });

        const itemInfo = document.createElement('div');
        itemInfo.classList.add('cart-item-info');
        itemInfo.appendChild(nameElement);
        itemInfo.appendChild(descriptioItem);

        itemElement.appendChild(itemInfo);
        itemElement.appendChild(botaoDelet);
        cartList.appendChild(itemElement);

        botaoDelet.appendChild(ImageDelet());
    });
}

function updateCartItemCount(cart) {
    cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0)
}

function totalCart(cart) {
    if (cart.length > 0) {
        const totality = document.createElement('div');
        totality.classList.add('total-amount');

        const totalityAmout = document.createElement('p');
        totalityAmout.textContent = `Total: `;

        const totalAmout = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        const spanValue = document.createElement('span');
        spanValue.textContent = totalAmout.toFixed(2);

        cartList.appendChild(totality);
        totality.appendChild(totalityAmout);
        totality.appendChild(spanValue);
    }
}

function updateStateOfButtons(cart) {
    const desserts = document.querySelectorAll('.dessert');

    desserts.forEach(dessert => {
        const name = dessert.querySelector('.name-dessert')?.textContent.trim();
        const addToCartBtn = dessert.querySelector('.add-to-cart');
        const selectedControls = dessert.querySelector('.add-to-cart-selected');
        const image = dessert.querySelector('.img-dessert img');
        const itemCount = dessert.querySelector('.itemCount');

        const itemNoCarrinho = cart.find(item => item.name === name);

        if (itemNoCarrinho) {
            addToCartBtn?.classList.add('esconder');
            selectedControls?.classList.add('show');
            image?.classList.add('selected-img');

            if (itemCount) {
                itemCount.textContent = itemNoCarrinho.quantity
            }
        } else {
            addToCartBtn?.classList.remove('esconder');
            selectedControls?.classList.remove('show');
            image?.classList.remove('selected-img');
        }
    });
}

function incrementarItemNoCarrinho(name) {
    let cart = getCartFromStorage()
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function decrementarItemNoCarrinho(name) {
    let cart = getCartFromStorage()
    const itemIndex = cart.findIndex(item => item.name === name);

    if (itemIndex >= 0) {
        const item = cart[itemIndex];
        item.quantity -= 1;

        if (item.quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCartToStorage(cart)
    }
}

function setupIncrementDecrementButtons() {
    document.body.addEventListener('click', (event) => {
        const incrementBtn = event.target.closest('.increment');
        const decrementBtn = event.target.closest('.decrement');

        if (!incrementBtn && !decrementBtn) return;

        const dessert = event.target.closest('.dessert');
        if (!dessert) return;

        const name = dessert.querySelector('.name-dessert')?.textContent.trim();

        if (incrementBtn) {
            incrementarItemNoCarrinho(name);
        } else if (decrementBtn) {
            decrementarItemNoCarrinho(name);
        }
        renderCart();
    });
}

setupIncrementDecrementButtons()
renderCart();