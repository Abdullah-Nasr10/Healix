/* This script handles the shopping cart functionality, including adding items, updating quantities, and displaying the cart.
 It also manages cookies to persist cart data across sessions. */

// ======================== Shopping Cart Functionality start ========================

function initializeCart() {
  let cartItemCount = document.querySelector("#cart-btn span");
  let cartItemList = document.querySelector(".shopping-cart .cart-items");
  let cartItemTotal = document.querySelector(".shopping-cart .total");

  let cartItems = [];
  let totalAmount = 0;

  const cartAlert = document.createElement("div");
  cartAlert.className = "alert-message";
  document.body.appendChild(cartAlert);

  document.addEventListener("click", function (event) {
    const addToCartElement = event.target.closest(".add-to-cart");

    if (addToCartElement) {
      const productName = addToCartElement.dataset.name;
      const productPrice = parseFloat(addToCartElement.dataset.price);
      const productImage = addToCartElement.dataset.image;

      const existingProductIndex = cartItems.findIndex(
        (item) => item.name === productName
      );

      if (existingProductIndex !== -1) {
        cartItems[existingProductIndex].quantity++;
      } else {
        cartItems.push({
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
        });
      }

      totalAmount += productPrice;
      updateCartUI();
      saveCartToCookies();
      saveCartToLocalStorage();
      showCartAlert(
        `"${productName}" has been successfully added to your cart.`
      );
    }
  });

  function showCartAlert(message) {
    cartAlert.textContent = message;
    cartAlert.classList.add("show");
    setTimeout(() => cartAlert.classList.remove("show"), 2500);
  }

  function saveCartToCookies() {
    setCookie("cartItems", JSON.stringify(cartItems), 9);
    setCookie("cartTotal", totalAmount.toString(), 9);
  }

  function saveCartToLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("cartTotal", totalAmount.toString());
  }

  function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cartItems");
    const savedTotal = localStorage.getItem("cartTotal");

    if (savedCart) {
      cartItems = JSON.parse(savedCart);
    }

    if (savedTotal) {
      totalAmount = parseFloat(savedTotal);
    }

    updateCartUI();
  }

  const clearCartBtn = document.querySelector(".clear-cart-btn");

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      emptyCart();
      showCartAlert("Cart has been cleared.");
    });
  }

  function emptyCart() {
    cartItems = [];
    totalAmount = 0;
    updateCartUI();
    saveCartToCookies();
    saveCartToLocalStorage();
  }

  function removeItemFromCart(index) {
    totalAmount -= cartItems[index].price * cartItems[index].quantity;
    totalAmount = Math.max(0, totalAmount);
    cartItems.splice(index, 1);
    updateCartUI();
    saveCartToCookies();
    saveCartToLocalStorage();
  }

  function updateCartUI() {
    cartItemCount.textContent = getTotalItemCount();
    updateCartItemList();
    updateCartTotal();
    // Show/hide the "Clear Cart" button based on items
    const cartBtnsContainer = document.querySelector(".cart-btns");

    if (cartItems.length > 0) {
      cartBtnsContainer.style.display = "flex";
    } else {
      cartBtnsContainer.style.display = "none";
    }
  }

  function getTotalItemCount() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  const originalEmptyCartHTML = cartItemList.innerHTML;

  function updateCartItemList() {
    cartItemList.innerHTML = "";

    if (cartItems.length === 0) {
      cartItemList.innerHTML = originalEmptyCartHTML;
      return;
    }

    cartItems.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item", "center");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-controls center">
        <button 
          class="quantity-btn decrease btn center" 
          data-index="${index}" 
          ${item.quantity === 1 ? "disabled" : ""}>
          -
        </button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase btn center" data-index="${index}">+</button>
          </div>
        </div>
        <span class="cart-item-price">EGP${item.price * item.quantity}</span>
        <button class="remove-btn btn" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `;

      cartItemList.appendChild(cartItem);
    });

    document.querySelectorAll(".increase").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = parseInt(event.target.dataset.index);
        cartItems[index].quantity++;
        totalAmount += cartItems[index].price;
        updateCartUI();
        saveCartToCookies();
        saveCartToLocalStorage();
      });
    });

    document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = parseInt(event.target.dataset.index);
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity--;
          totalAmount -= cartItems[index].price;
        } else {
          removeItemFromCart(index);
        }
        updateCartUI();
        saveCartToCookies();
        saveCartToLocalStorage();
      });
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = parseInt(event.currentTarget.dataset.index);
        removeItemFromCart(index);
        saveCartToCookies();
        saveCartToLocalStorage();
      });
    });
  }

  function updateCartTotal() {
    cartItemTotal.textContent = `TOTAL: EGP   ${totalAmount}`;
  }

  loadCartFromLocalStorage();
}

initializeCart();

// ======================== Shopping Cart Functionality end ========================

// ======================== Cookie management functions for shopping cart start ========================
function setCookie(cookieName, cookieValue, availableDays) {
  let expiredDate = "";
  const date = new Date();

  // If availableDays is provided and greater than 0, set the expiration date, if not, default to 7 days
  const days = availableDays && availableDays > 0 ? availableDays : 7;

  date.setDate(date.getDate() + days);
  expiredDate = "; expires=" + date.toUTCString();

  document.cookie = `${cookieName}=${cookieValue || ""}${expiredDate}; path=/`;
}

//cookie form is "user=aalaa; theme=dark; loggedIn=true"
// name=value; & each cookie is separated by a semicolon and space
function getCookie(cookieName) {
  // to prevent issues with cookies that have the same name but different values like username and username2
  const nameWithEquals = `${cookieName}=`;
  const allCookies = document.cookie.split(";");

  for (let i = 0; i < allCookies.length; i++) {
    let singleCookie = allCookies[i];

    // Remove leading spaces because some browsers may add spaces before the cookie name
    for (let i = 0; i < allCookies.length; i++) {
      let singleCookie = allCookies[i].trim();

      if (singleCookie.startsWith(nameWithEquals)) {
        return singleCookie.substring(nameWithEquals.length);
        //we can return the value of the cookie by splicing the string at ("=")
      }
    }

    return null;
  }

  return null;
}

// Function to erase a specific cookie by setting its Max-Age to 0
function eraseCookie(cookieName) {
  document.cookie = `${cookieName}=; Max-Age=0; path=/`;
}
// ======================== Shopping Cart Functionality End ========================

/* ============================ Popup checkout-Page-start ============================ --> */
function showPopup(e, page) {
  e.preventDefault();
  page.style.transform = "rotateY(0deg)";
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

function closePopup(page) {
  page.style.transform = "rotateY(90deg)";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

document.querySelector(".checkout-btn").addEventListener("click", function (e) {
  const checkoutPage = document.querySelector(".checkoutPage");
  showPopup(e, checkoutPage);
  loadCheckoutData();
});

document
  .querySelector("#closeCheckoutPage")
  .addEventListener("click", function () {
    const checkoutPage = document.querySelector(".checkoutPage");
    closePopup(checkoutPage);
  });

// Load checkout data from localStorage or cookies
function loadCheckoutData() {
  // Get cart items from localStorage or use empty array if none
  const items = JSON.parse(localStorage.getItem("cartItems") || "[]");

  // Get the elements where values will be displayed
  const subtotalEl = document.getElementById("checkout-subtotal");
  const discountEl = document.getElementById("checkout-discount");
  const totalEl = document.getElementById("checkout-total");
  const itemsContainer = document.getElementById("checkout-items");

  const shipping = 5;
  let discount = 0;

  // If there's no container for items, exit the function
  if (!itemsContainer) return;

  // 1. Render cart items
  itemsContainer.innerHTML = "";

  if (items.length === 0) {
    // If cart is empty, show message and reset values
    itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "$0.00";
    discountEl.textContent = "-$0.00";
    totalEl.textContent = "$0.00";
    return;
  }

  let subtotal = 0;

  // Loop through each item and display it
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <div class="item-name">${item.name}</div>
        <div class="item-price">$${item.price} x ${item.quantity}</div>
      </div>
    `;
    itemsContainer.appendChild(div);

    // Add item price * quantity to subtotal
    subtotal += item.price * item.quantity;

    // If a valid coupon is saved, auto-fill it and apply the discount
    const savedCoupon = localStorage.getItem("activeCoupon");
    if (savedCoupon && discountCodes[savedCoupon.toUpperCase()]) {
      document.getElementById("discount-code").value = savedCoupon;
      applyDiscount(); // applyDiscount will update totals
    }
  });

  // 2. Update values in the UI
  subtotalEl.textContent = `EGP ${subtotal}`;
  discountEl.textContent = `-EGP ${discount}`;
  totalEl.textContent = `EGP ${subtotal + shipping - discount}`;

  // Store subtotal, shipping, and discount in dataset for later use
  document.querySelector(".checkout-right").dataset.subtotal = subtotal;
  document.querySelector(".checkout-right").dataset.shipping = shipping;
  document.querySelector(".checkout-right").dataset.discount = discount;
}

// Toggle card fields visibility
document.querySelectorAll('input[name="payment"]').forEach((input) => {
  input.addEventListener("change", () => {
    document.querySelector(".card-details").style.display =
      input.value === "card" ? "flex" : "none";
  });
});

// confirm order and clear cart
// document.querySelector(".checkout-form").addEventListener("submit", (e) => {
//   e.preventDefault();
//   alert("🎉 Order confirmed!");
//   localStorage.removeItem("cartItems");
//   localStorage.removeItem("cartTotal");
//   document.querySelector(".checkoutPage").style.display = "none";
// });

//handling pick up and delivery options
const deliveryBtn = document.querySelector(".delivery-tab");
const pickupBtn = document.querySelector(".pickup-tab");
const pickupDetails = document.querySelector(".pickup-details");
const shippingEl = document.getElementById("checkout-shipping");
const governmentSelect = document.querySelector(".government-select");

const governorateShippingRates = {
  Cairo: 30,
  Giza: 40,
  Alexandria: 50,
  Dakahlia: 60,
  Sharqia: 70,
  Qalyubia: 80,
  Aswan: 60,
};

let isPickup = false;

//
governmentSelect.addEventListener("change", () => {
  if (!isPickup) {
    const selected = governmentSelect.value;
    const shipping = governorateShippingRates[selected] || 0;
    shippingEl.textContent = `$${shipping}`;
    document.querySelector(".checkout-right").dataset.shipping = shipping;
    updateTotal();
  }
});

//  Pick up:
pickupBtn.addEventListener("click", () => {
  isPickup = true;

  pickupBtn.classList.add("active");
  deliveryBtn.classList.remove("active");

  governmentSelect.parentElement.style.display = "none";
  shippingEl.textContent = "$00. 00";
  pickupDetails.style.display = "block";

  updateTotal();
});

// delivery according to selected governorate
deliveryBtn.addEventListener("click", () => {
  isPickup = false;

  deliveryBtn.classList.add("active");
  pickupBtn.classList.remove("active");

  governmentSelect.parentElement.style.display = "block";

  // default to Cairo if no selection
  const selected = governmentSelect.value;
  const shipping = governorateShippingRates[selected] || 0;
  shippingEl.textContent = `$${shipping}`;
  document.querySelector(".checkout-right").dataset.shipping = shipping;

  pickupDetails.style.display = "none";
  updateTotal();
});

// update total price based on subtotal, shipping, and discount
function updateTotal() {
  const subtotal = parseFloat(
    document.querySelector(".checkout-right").dataset.subtotal || "0"
  );
  const discount = parseFloat(
    document.querySelector(".checkout-right").dataset.discount || "0"
  );
  const shipping = isPickup
    ? 0
    : parseFloat(
        document.querySelector(".checkout-right").dataset.shipping || "0"
      );

  document.getElementById("checkout-total").textContent = `EGP${
    subtotal + shipping - discount
  }`;
}

// ======================== Handling Coupon Processing start============================

const discountCodes = {
  SAVE10: 10,
  WELCOME15: 15,
  VIP25: 25,
};

function applyDiscount() {
  const codeInput = document.getElementById("discount-code");
  const enteredCode = codeInput.value.trim().toUpperCase();
  const messageEl = document.getElementById("discount-message");
  document.getElementById("remove-coupon").style.display = "inline";

  // Check if the code exists in the predefined list
  // hasOwnProperty checks if the object has the property
  if (!discountCodes.hasOwnProperty(enteredCode)) {
    messageEl.textContent = "Invalid discount code.";
    messageEl.style.color = "var(--black)";
    return;
  }

  const discountPercent = discountCodes[enteredCode];

  // Get subtotal and shipping
  const subtotal = parseFloat(
    document.querySelector(".checkout-right").dataset.subtotal || "0"
  );
  const shipping = isPickup
    ? 0
    : parseFloat(
        document.querySelector(".checkout-right").dataset.shipping || "0"
      );

  // Calculate discount
  const discountAmount = ((subtotal + shipping) * discountPercent) / 100;
  document.querySelector(".checkout-right").dataset.discount = discountAmount;

  document.getElementById(
    "checkout-discount"
  ).textContent = `-$${discountAmount}`;

  // Update the UI
  updateTotal();
  messageEl.textContent = `Code applied! You saved EGP ${discountAmount} 🎉`;
  messageEl.style.color = "green";
  messageEl.style.display = "block";

  // Store the coupon for future sessions
  localStorage.setItem("activeCoupon", enteredCode);

  // Disable inputs after applying
  codeInput.disabled = true;
  document.querySelector(".apply-btn").disabled = true;
}

function removeCoupon() {
  const codeInput = document.getElementById("discount-code");
  const messageEl = document.getElementById("discount-message");

  // Reset UI
  codeInput.value = "";
  codeInput.disabled = false;
  document.querySelector(".apply-btn").disabled = false;
  document.getElementById("remove-coupon").style.display = "none";

  // Clear stored discount
  document.querySelector(".checkout-right").dataset.discount = "0";
  localStorage.removeItem("activeCoupon");

  updateTotal();

  // Show message
  messageEl.innerHTML = "Coupon removed.";
  messageEl.style.color = "var(--black)";
}
