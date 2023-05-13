const addToCart = document.getElementsByClassName('add-to-cart');
const cartModal = document.getElementById('cart-modal');
const cartCloseIcon = cartModal.querySelector(".close");
const cartTitle = document.getElementById('cart-title');
const cartContent = document.getElementById('cart-content');
const cartLabel = document.getElementById('cart-label');
const cartPrice = document.getElementById('cart-price');
const cartSendButton = document.getElementById('cart-send');

let validity = null;

cartCloseIcon.addEventListener('click', closeModal)
cartSendButton.addEventListener('click', goToCheckoutClicked)

for (let i = 0; i < addToCart.length; i++) {
   let button = addToCart[i];
   button.addEventListener('click', addToCartClicked)
}

function closeModal() {
   cartModal.close();
   location.reload();
}

function addToCartClicked(event) {
   let button = event.target;
   let cartItem = button.parentElement;
   let ticketType = cartItem.dataset.ticket;
   let price = cartItem.dataset.price;
   validity = cartItem.dataset.validity;
   console.log("validity:", validity);
   console.log("ticketType", ticketType);
   console.log("price", price);
   cartLabel.innerHTML = `1x ${ticketType}`;
   cartPrice.innerHTML = `€${price}`;
   cartModal.showModal();
}

function goToCheckoutClicked(event) {
   event.preventDefault();
   if (validity) {
      cartTitle.innerHTML = `Get ready!`
      cartContent.innerHTML = `This summer you're going<br>to Sziget for <span class="bold">${validity}</span> ${validity == 1 ? "day" : "days"}!`;
   } else {
      cartTitle.innerHTML = `Oh no!`
      cartContent.innerHTML = "Something went wrong :(";
   }
}