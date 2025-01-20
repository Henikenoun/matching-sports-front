import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useShoppingCart } from 'use-shopping-cart';
import { toast } from 'react-toastify';
import './shop.css';
import { useNavigate } from 'react-router-dom';

const Articles = ({ categorieId }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  // const { addItem } = useShoppingCart();
  const navigate = useNavigate();
  const { addItem } = useShoppingCart();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/articles?categorie_id=${categorieId}`)
      .then(res => { 
        setArticles(res.data.filter(article => article.categorie_id === categorieId)); 
        
        console.log(categorieId); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [categorieId]);

  const addToCart = (article) => {
    const product = {
      id: article.id,
      name: article.name,
      price: article.price,
      image: article.photo,
      quantity: 1,
    };
    addItem(product);
    //navigate('/cart');
    //navigate to cart
    
    toast.success('Article ajouté au panier !');
  };

  return (
    <div className="articles-container">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        articles.map(article => (
          <div className="article-card" key={article.id}>
            <img src={article.photo} alt={article.name} />
            <h3>{article.name}</h3>
            <p>{article.desc}</p>
            <p>Prix : {article.price} TND</p>
            <button onClick={() => addToCart(article)}>Ajouter au panier</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Articles;
