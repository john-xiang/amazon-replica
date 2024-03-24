import { cart, computeCartQuantity } from '../../data/cart.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';

export function renderPaymentSummary() {
  // compute the prices, shipping, taxes and total
  const quantity = computeCartQuantity();
  let productPrice = 0;
  let shippingPrice = 0;

  cart.forEach((cartItem) => {
    // get the product and delivery option for each cart item
    const product = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    // Compute the total cost of cart and also the total shipping
    productPrice += product.priceCents * cartItem.quantity;
    shippingPrice += deliveryOption.priceCents;
  });
  
  const priceBeforeTax = productPrice + shippingPrice;
  const tax = priceBeforeTax * 0.1;
  const totalPrice = priceBeforeTax + tax;

  // generate the HTML
  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>
    <div class="payment-summary-row">
      <div>Items (${quantity}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPrice)}
      </div>
    </div>
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
        $${formatCurrency(shippingPrice)}
      </div>
    </div>
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(priceBeforeTax)}
      </div>
    </div>
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(tax)}
      </div>
    </div>
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalPrice)}
      </div>
    </div>
    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}