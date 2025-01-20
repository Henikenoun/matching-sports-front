import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Articles from './Articles';
import './shop.css';
import Menu from '../Menu/Menu';

const ListCategorie = ({ shopId }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/articles?shop_id=${shopId}`)
      .then(res => {
        const articles = res.data;
        const uniqueCategories = [...new Set(
          articles.map(article => article.shop_id === shopId ? article.categorie_id : null).filter(id => id !== null)
        )];
        return axios.get('http://localhost:8000/api/categories').then(res => {
          const allCategories = res.data;
          const filteredCategories = allCategories.filter(cat => uniqueCategories.includes(cat.id));
          setCategories(filteredCategories);
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [shopId]);

  return (
    <div className="app">
      
        <div className="categories-container" style={{marginTop:'100px'}}>
        {loading ? (
            <div className="spinner"></div>
        ) : !selectedCategorie &&(
            categories.map(categorie => (
            <div className="categorie-card" key={categorie.id}>
                <img src={categorie.photo} alt={categorie.name} />
                <h3>{categorie.name}</h3>
                <p>{categorie.desc.slice(0, -12)}</p>
                <button onClick={() => setSelectedCategorie(categorie.id)}>Voir articles</button>
            </div>
            ))
        )}
        {selectedCategorie && <Articles categorieId={selectedCategorie} />}
        </div>
    </div>
  );
};

export default ListCategorie;
