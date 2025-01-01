import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListCategorie from './listcategorie';
import './shop.css';
import Menu from '../Menu/Menu';

const ListShop = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/api/shops')
      .then(res => setShops(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <Menu />
    <div className="shops-container" style={{marginTop:'100px'}}>
      {loading ? (
        <div className="spinner"></div>
      ) : !selectedShop ? (
        shops.map(shop => (
          <div className="shop-card" key={shop.id}>
            <img src={JSON.parse(shop.photos)[0]} alt={shop.name} />
            <h3>{shop.name}</h3>
            <p>{shop.desc}</p>
            <button onClick={() => setSelectedShop(shop.id)}>Voir plus</button>
          </div>
        ))
      ) : (
        <></>
      )}
      {selectedShop && <ListCategorie shopId={selectedShop} />}
    </div>
    </div>
  );
};

export default ListShop;
