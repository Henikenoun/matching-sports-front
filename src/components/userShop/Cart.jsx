import React from 'react';
import { useShoppingCart } from 'use-shopping-cart';
import { Link } from 'react-router-dom';
import './shop.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51N8h05Ffd7KAMX0KwbMkfjvpRmG8ZivJvvc7vSvH3RH7b0gPuQ5xXhlYcC7FDtomxslc2oIS9JVcoPZ4jqUR2PuW00aENtCD5K');

const Cart = () => {
  const { cartDetails, removeItem, clearCart, totalPrice, cartCount, incrementItem, decrementItem } = useShoppingCart();
  const stripe = useStripe();

  const handleCheckout = async (event) => {
    event.preventDefault();

    if (!stripe) {
      console.error('Stripe has not loaded yet');
      return;
    }

    try {
      const items = Object.values(cartDetails).map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects the amount in cents
        },
        quantity: item.quantity,
      }));

      console.log('Sending to checkout:', items);

      const payload = {
        line_items: items,
        success_url: `${window.location.origin}/demandes`,
        cancel_url: `${window.location.origin}/cart`,
      };

      // Create demand (demande) for each item in the cart
      for (const item of Object.values(cartDetails)) {
        const demandePayload = {
          id: item.id,
          user_id: JSON.parse(localStorage.getItem('user')).id, // Ensure user_id is correctly defined
          article_id: item.id,
          quantity: item.quantity,
          total: item.price * item.quantity,
        };

        console.log('Creating demande with payload:', demandePayload);

        const demandeResponse = await axios.post('http://localhost:8000/api/demandesP', demandePayload);

        if (demandeResponse.status === 200) {
          clearCart(); // Clear the cart after successfully creating the demand
          toast.success('Article ajouté avec succès à la commande !');
        }
      }

      const response = await axios.post('http://localhost:8000/api/payment/processpayment', payload);

      if (response.data.id) {
        const result = await stripe.redirectToCheckout({
          sessionId: response.data.id,
        });

        if (result.error) {
          console.error('Stripe redirect error:', result.error);
          throw new Error(result.error.message);
        } 
      } else {
        throw new Error('No session ID received from server');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Erreur lors de la passation de la commande.');
    }
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartCount === 0 ? (
        <div className="cart-empty">
          <p>Panier Vide</p>
          <div className="start-shopping">
            <Link to="/articlescard">
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="titles">
            <h3 className="product-title">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="quantity">Quantity</h3>
            <h3 className="total">Total</h3>
          </div>
          <div className="cart-items">
            {cartDetails && Object.values(cartDetails).map((cartItem) => (
              <div className="cart-item" key={cartItem.id}>
                <div className="cart-product">
                  <img src={`${cartItem.image}`} alt={cartItem.name} />
                  <div>
                    <h3>{cartItem.name}</h3>
                    <button onClick={() => removeItem(cartItem.id)}>
                      <i className="fa-solid fa-trash-can" style={{ fontSize: "14px", color: "red" }}></i>
                    </button>
                  </div>
                </div>
                <div className="cart-product-price"> {cartItem.price} TND</div>
                <div className="cart-product-quantity">
                  <button className="button-actions" onClick={() => decrementItem(cartItem.id)}>
                    -
                  </button>
                  <div className="count">{cartItem.quantity}</div>
                  <button className="button-actions" onClick={() => incrementItem(cartItem.id)}>
                    +
                  </button>
                </div>
                <div className="cart-product-total-price">
                  {cartItem.quantity * cartItem.price} TND
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <button className="clear-btn" onClick={() => clearCart()}>
              Clear Cart
            </button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <span className="amount">{totalPrice} TND</span>
              </div>
              <p>Taxes and shipping calculated at checkout</p>
              <button onClick={handleCheckout}>Check Out</button>
              <div className="continue-shopping">
                <Link to="/articlescard">
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Wrapper = (props) => (
  <Elements stripe={stripePromise}>
    <Cart {...props} />
  </Elements>
);

export default Wrapper;