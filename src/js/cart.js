const addToCart = document.getElementsByClassName('add-to-cart');
const cartModal = document.getElementById('cart-modal');
const cartCloseIcon = cartModal.querySelector(".close");
const cartTitle = document.getElementById('cart-title');
const cartContent = document.getElementById('cart-content');
const cartLabel = document.getElementById('cart-label');
const cartPrice = document.getElementById('cart-price');
const cartSendButton = document.getElementById('cart-send');

const userDataForm = document.forms["user-data"];

let validity = null;
let firstName = null;

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
   let cartItem = event.target;
   let ticketType = cartItem.dataset.ticket;
   let price = cartItem.dataset.price;
   validity = cartItem.dataset.validity;
   cartLabel.innerHTML = `1x ${ticketType}`;
   cartPrice.innerHTML = `€${price}`;
   cartModal.showModal();
}

function goToCheckoutClicked(event) {
   event.preventDefault();
   const data = [];
   for (let i = 0; i < userDataForm.length; i++) {
      const input = userDataForm[i];
      const container = input.closest(".input-container");
      const { id, type, value } = input;
      if (id === "first-name" && value) {
         firstName = value;
      }
      if (type !== "submit") {
         if (!input.checkValidity()) {
            container.classList.add("invalid");
            data.push(input);
         } else {
            container.classList.remove("invalid");
         }
      }
   }
   const invalidData = data.filter(item => !item.value || !item.checkValidity());
   if (invalidData.length === 0) {
      if (validity && firstName) {
         cartContent.classList.add("success");
         cartTitle.innerHTML = `Get ready!`
         cartContent.innerHTML = `<span class="bold">${firstName}</span>, this summer you're going<br>to Sziget for <span class="bold">${validity}</span> ${validity == 1 ? "day" : "days"}!`;
      } else {
         cartTitle.innerHTML = `Oh no!`
         cartContent.innerHTML = "Something went wrong :(";
      }
   }
}