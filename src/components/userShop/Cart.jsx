import React from 'react';
import { useShoppingCart } from 'use-shopping-cart';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './shop.css';
import axios from 'axios';
import Menu from '../Menu/Menu';

const Cart = () => {
  const { cartDetails, removeItem, incrementItem, decrementItem, cartCount, totalPrice, clearCart } = useShoppingCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      // Logique pour envoyer chaque article du panier
      for (const item of Object.values(cartDetails)) {
        const payload = {
          id: item.id,
          user_id: JSON.parse((localStorage.getItem('user'))).id, // Assurez-vous que user_id est correctement défini
          article_id: item.id,
          quantity: item.quantity,
          total: item.price * item.quantity
          
        };
        console.log((localStorage.getItem('user')))
  
        console.log("Payload envoyé :", payload); // Debugging : afficher la charge utile envoyée
  
        const response = await axios.post('http://localhost:8000/api/demandesP', payload);
  
        if (response.status === 200) {
          toast.success('Article ajouté avec succès à la commande !');
        }
      }
  
      toast.success('Commande passée avec succès !');
      clearCart();
      navigate("/demandes")
      
    } catch (error) {
      console.error('Erreur lors de la création de la commande :', error.response?.data || error.message);
      navigate("/demandes")
      toast.error('Erreur lors de la passation de la commande.');
    }
  };
  

  return (
    <div className="app">
      <Menu />
    <div className="container " style={{marginTop:'150px'}}>
      <h2 className="text-center mb-4">Votre Panier</h2>
      {cartCount === 0 ? (
        <div className="alert alert-warning text-center">Votre panier est vide.</div>
      ) : (
        <>
          <div className="row">
            {Object.values(cartDetails).map((item) => (
              <div className="col-md-12 mb-3" key={item.id}>
                <div className="card shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded-start"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">Prix : {item.price} TND</p>
                        <p className="card-text">Quantité : {item.quantity}</p>
                      </div>
                    </div>
                    <div className="col-md-2 d-flex flex-column justify-content-center align-items-center">
                      <button
                        className="btn btn-outline-primary btn-sm mb-2"
                        onClick={() => decrementItem(item.id)}
                      >
                        <span className="material-icons">remove</span>
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm mb-2"
                        onClick={() => incrementItem(item.id)}
                      >
                        <span className="material-icons">add</span>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <h4>Total : {totalPrice.toFixed(2)} TND</h4>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-danger w-50 me-2"
              onClick={clearCart}
            >
              Vider le panier
            </button>
            <button
              className="btn btn-success w-50 ms-2"
              onClick={handleCheckout}
            >
              Passer à la caisse
            </button>
          </div>
        </>
      )}
      <div className="text-center mt-4">
        <Link to="/shop" className="btn btn-link">
          Continuer vos achats
        </Link>
      </div>
    </div>
</div>
  );
};

export default Cart;
