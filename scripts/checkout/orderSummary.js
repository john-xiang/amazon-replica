import { cart, removeFromCart, updateQuantity, updateDeliveryOption } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { calculateDeliveryDate, deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

function deliveryOptionsHTML(cartItem, index) {
  let resultHTML = '';

  deliveryOptions.forEach((option) => {
    const dateString = calculateDeliveryDate(option, 'dddd, MMMM D');

    resultHTML += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${cartItem.productId}"
        data-option-id=${option.id}>
        <input type="radio"${option.id === cartItem.deliveryOptionId
            ? ' checked'
            : ''}
          class="delivery-option-input"
          name="delivery-option-${index}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${option.priceCents === 0 ? 'FREE ' : `$${formatCurrency(option.priceCents)} -`} Shipping
          </div>
        </div>
      </div>
    `;
  });

  return resultHTML;
}

export function renderOrderSummary() {
  let cartHTML = '';

  cart.forEach((cartItem, index) => {
    const productId = cartItem.productId;
    const deliveryOptionId = cartItem.deliveryOptionId;
    const matchingProduct = getProduct(productId);
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const dateString = calculateDeliveryDate(deliveryOption, 'dddd, MMMM D');

    cartHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(cartItem, index)}
          </div>
        </div>
      </div>
    `;
  });
  
  // display the cart items on the page
  document.querySelector('.order-summary').innerHTML = cartHTML;
  
  // add event listener to delete button
  document.querySelectorAll('.js-delete-link').forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
      // set the variables to delete the product from the cart
      const productId = deleteLink.dataset.productId;
  
      // remove item from cart
      removeFromCart(productId);

      // Render the new HTML on the page
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  
  document.querySelectorAll('.js-update-link').forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId;
  
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
  
      cartItemContainer.classList.add('is-editing-quantity');
    })
  });
  
  document.querySelectorAll('.js-save-link').forEach((saveLink) => {
    saveLink.addEventListener('click', () => {
      const productId = saveLink.dataset.productId;
      const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
  
      // if quantity is less than 0 or greater than 1000 we stop running the function
      if (newQuantity <=0 || newQuantity >= 1000) {
        alert('Quantity must be at least 1 and less than 1000');
        return;
      }

      // Remove the editing class
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);  
      cartItemContainer.classList.remove('is-editing-quantity');

      // Update the quantity in the cart
      updateQuantity(productId, newQuantity);

      // render payment summary and checkout header
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
  
  document.querySelectorAll('.js-delivery-option').forEach((optionElement) => {
    optionElement.addEventListener('click', () => {
      const productId = optionElement.dataset.productId;
      const optionId = optionElement.dataset.optionId;
      updateDeliveryOption(productId, optionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}