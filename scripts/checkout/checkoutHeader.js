import { computeCartQuantity } from '../../data/cart.js';

export function renderCheckoutHeader() {
  // compute the quantity
  const quantity = computeCartQuantity();

  // Generate the HTML and render the result
  document.querySelector('.js-show-cart-quantity').innerHTML = `
    ${quantity} ${(quantity === 1) ? 'item' : 'items'}
  `;
}