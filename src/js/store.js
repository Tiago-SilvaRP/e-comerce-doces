const buttons = document.querySelectorAll('.add-to-cart');
const cartCounter = document.querySelector('.counter');
const cartList = document.getElementById('cart-list');

function renderCart() {
    const cart = getCartFromStorage()
    cartList.innerHTML = '';

    removeImagTextInitialToCart(cart)
    itemsListCart(cart)
    totalCart(cart);
    completePurchase(cart);
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

function existingItem(cart, cartItem) {
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
    const newImage = document.createElement('img');
    newImage.src = "./src/images/icon-remove-item.svg";
    newImage.alt = "Deletar item do carrinho";
    return newImage;
}

function itemsListCart(cart) {
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        const nameElement = document.createElement('h4');
        nameElement.textContent = item.name;

        const descriptioItem = document.createElement('p');
        descriptioItem.textContent = `${item.quantity}x  unid.$${item.price.toFixed(2)}  = $${(item.price * item.quantity).toFixed(2)}`;

        const btnDelet = document.createElement('button');
        btnDelet.classList.add('remove-btn');

        btnDelet.addEventListener('click', () => {
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
        itemElement.appendChild(btnDelet);
        cartList.appendChild(itemElement);

        btnDelet.appendChild(ImageDelet());
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

function completePurchase(cart) {
    if (cart.length > 0) {
        const btnCompletePurchase = document.createElement('button');
        btnCompletePurchase.textContent = "Finalizar compra";
        btnCompletePurchase.classList.add("btn-finalizar-compra");

        btnCompletePurchase.addEventListener('click', () => {
            const confirmPurchase = confirm("Deseja finalizar a compra?");

            if (!confirmPurchase) return;

            localStorage.removeItem("cart");
            alert("Compra realizada com sucesso!");
            renderCart();
        })

        cartList.appendChild(btnCompletePurchase);
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

        const itemInCart = cart.find(item => item.name === name);

        if (itemInCart) {
            addToCartBtn?.classList.add('hidden');
            selectedControls?.classList.add('show');
            image?.classList.add('selected-img');

            if (itemCount) {
                itemCount.textContent = itemInCart.quantity;
            }
        } else {
            addToCartBtn?.classList.remove('hidden');
            selectedControls?.classList.remove('show');
            image?.classList.remove('selected-img');
        }
    });
}

function incrementItemInCart(name) {
    let cart = getCartFromStorage()
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function decrementItemInCart(name) {
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
            incrementItemInCart(name);
        } else if (decrementBtn) {
            decrementItemInCart(name);
        }
        renderCart();
    });
}

setupIncrementDecrementButtons()
renderCart();