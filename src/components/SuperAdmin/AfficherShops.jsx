import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AfficherShops.css';

const AfficherShops = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/shops');
        setShops(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des shops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  const fetchShopDetails = async (shopId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8000/api/shops/${shopId}`);
      setSelectedShop(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du shop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedShop(null);
  };

  // Fonction pour analyser les photos (chaîne JSON -> tableau d'URLs)
  const parsePhotos = (photos) => {
    try {
      const parsed = JSON.parse(photos || '[]');
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [photos.replace(/"/g, '')];
    }
  };

  return (
    <div className="shops-container">
      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : selectedShop ? (
        <div className="shop-details">
          <button onClick={handleBackToList} className="back-button">
            &#8592; Retour à la liste
          </button>
          <div className="details-header">
            <h1 className="shop-name">{selectedShop.name}</h1>
            <p className="shop-description">{selectedShop.desc}</p>
          </div>
          <div className="images-container">
            {parsePhotos(selectedShop.photos).map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Shop image ${index}`}
                className="shop-image-large"
              />
            ))}
          </div>
          <div className="club-info">
            <h2>Informations sur le club</h2>
            <p><strong>Nom :</strong> {selectedShop.club.nom}</p>
            <p><strong>Ville :</strong> {selectedShop.club.ville}</p>
            <p><strong>Adresse :</strong> {selectedShop.club.adresse}</p>
            <p><strong>Téléphone :</strong> {selectedShop.club.numTel}</p>
            <p><strong>Email :</strong> {selectedShop.club.email}</p>
          </div>
        </div>
      ) : shops.length === 0 ? (
        <div className="no-shops">Aucun shop disponible</div>
      ) : (
        <div className="cards-container">
          {shops.map((shop) => (
            <div className="shop-card" key={shop.id}>
              <div className="card-image-container">
                {parsePhotos(shop.photos).length > 0 && (
                  <img
                    src={parsePhotos(shop.photos)[0]} // Affiche uniquement la première image
                    alt={`Shop image`}
                    className="shop-image-thumbnail"
                  />
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{shop.name}</h3>
                <p className="card-description">{shop.desc}</p>
                <div className="card-club-info">
                  <p><strong>Club :</strong> {shop.club.nom}</p>
                  <p><strong>Ville :</strong> {shop.club.ville}</p>
                </div>
                <button
                  onClick={() => fetchShopDetails(shop.id)}
                  className="view-details-btn"
                >
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AfficherShops;