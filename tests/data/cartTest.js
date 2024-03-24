import { addToCart, cart, loadFromStorage, removeFromCart, updateDeliveryOption } from "../../data/cart.js";

describe('Test suite: addToCart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });

  it('adds an existing product to cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });

    document.querySelector('.js-test-selector').innerHTML = `
      <select class="js-quantity-selector-e43638ce-6aa0-4b85-b27f-e1d07eb678c6">
        <option selected value="1">1</option>
      </select>
    `;

    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }]));
  });

  it('adds a new product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });

    loadFromStorage();

    document.querySelector('.js-test-selector').innerHTML = `
      <select class="js-quantity-selector-e43638ce-6aa0-4b85-b27f-e1d07eb678c6">
        <option selected value="1">1</option>
      </select>
    `;

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 1,
      deliveryOptionId: '1'
    }]));
  });
});

describe('Test suite: removeFromCart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        proudctId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }]);
    });

    loadFromStorage();
  });

  it('removes an item from cart', () => {
    const testProduct = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';

    removeFromCart(testProduct);

    expect(cart.length).toEqual(1);
    expect(cart[0].proudctId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[0].quantity).toEqual(1);
    expect(cart[0].deliveryOptionId).toEqual('2');
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      proudctId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }]));
  });

  it('handles removing non-existent item', () => {
    const testProduct = '1';

    removeFromCart(testProduct);

    expect(cart.length).toEqual(2);

    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('1');

    expect(cart[1].proudctId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[1].quantity).toEqual(1);
    expect(cart[1].deliveryOptionId).toEqual('2');

    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      proudctId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }]));
  });
});

describe('Test suite: updateDeliveryOption', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        proudctId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }]);
    });

    loadFromStorage();
  });

  it('Updates delivery option', () => {
    updateDeliveryOption('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', '2');

    expect(cart.length).toEqual(2);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('2');

    expect(cart[1].proudctId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[1].quantity).toEqual(1);
    expect(cart[1].deliveryOptionId).toEqual('2');

    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '2'
    }, {
      proudctId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }]));
  });

  it('Works with product not in cart', () => {
    updateDeliveryOption('1', '1');

    expect(cart.length).toEqual(2);

    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('1');

    expect(cart[1].proudctId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[1].quantity).toEqual(1);
    expect(cart[1].deliveryOptionId).toEqual('2');

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('Works with delivery id that does not exist', () => {
    updateDeliveryOption('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', '4');

    expect(cart.length).toEqual(2);

    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('1');

    expect(cart[1].proudctId).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(cart[1].quantity).toEqual(1);
    expect(cart[1].deliveryOptionId).toEqual('2');

    expect(localStorage.setItem).not.toHaveBeenCalled();
  })
});