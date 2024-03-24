import { getDeliveryOption } from "./deliveryOptions.js";

export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
    cart = [];
  }
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;
  const quantityToAdd = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

  // check if product is in the cart
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  // add Item to cart
  if (matchingItem) {
    matchingItem.quantity += quantityToAdd;
  } else {
    cart.push({
      productId: productId,
      quantity: quantityToAdd,
      deliveryOptionId: '1'
    });
  }

  // save to local storage
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  // If the cart does not match the productId, then push to new cart
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  // save the new cart
  cart = newCart;

  // save to storage
  saveToStorage();
}

export function computeCartQuantity() {
  let quantity = 0;

  cart.forEach((cartItem) => {
    quantity += cartItem.quantity;
  });

  return quantity;
}

export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
    }
  });

  saveToStorage();
}

export function updateDeliveryOption(productId, newOptionId) {
  if (!getDeliveryOption(newOptionId)) {
    return;
  }

  let matchingProduct;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingProduct = cartItem;
    }
  });

  // if a matching product is not found, then we return and do nothing
  if (!matchingProduct) {
    return;
  }

  matchingProduct.deliveryOptionId = newOptionId;

  saveToStorage();
}