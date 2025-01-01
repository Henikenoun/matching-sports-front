import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './demende.css'; // Pour les styles personnalisés
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from '../Menu/Menu';

const Demandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Assuming the user ID is stored in local storage after login
    const storedUserId =  JSON.parse((localStorage.getItem('user'))).name;
    setUserId(storedUserId);

    if (storedUserId) {
      axios
        .get('http://localhost:8000/api/demandesP')
        .then(res => {
          console.log(res.data);
          console.log(storedUserId);
          // Filter demandes by user ID
          const userDemandes = res.data.filter(demande => demande.user === storedUserId);
          setDemandes(userDemandes);
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="app">
      <Menu />
      <div className="container demandes-container" style={{ marginTop: '100px' }}>
        <h2 className="text-center mb-4">Vos Demandes</h2>
        {demandes.length === 0 ? (
          <p className="text-center">Vous n'avez aucune demande pour le moment.</p>
        ) : (
          <div className="row">
            {demandes.map(demande => (
              <div
                key={demande.demande_id}
                className="col-md-6 col-lg-4 mb-4"
              >
                <div className="card demande-card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      Article : {demande.article}
                    </h5>
                    <p className="card-text">
                      <strong>Quantité :</strong> {demande.quantity}
                    </p>
                    <p className="card-text">
                      <strong>Total :</strong> {demande.total_price} TND
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Demandes;