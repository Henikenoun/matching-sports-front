import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AfficheAbonnementUser.css'; // Importation du fichier CSS
import Menu from './Menu/Menu';

const AfficheAbonnementUser = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données utilisateur depuis localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const clientId = user?.idClient;
  const clientName = user?.nom || 'Nom non disponible';
  const clientEmail = user?.email || 'Email non disponible';

  useEffect(() => {
    if (clientId) {
      // Faire la requête pour récupérer les abonnements
      axios
        .get(`https://localhost:7050/api/Abonnement/client/${clientId}`)
        .then((response) => {
          console.log("Réponse API:", response.data);  // Debug
          setAbonnements(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError('Impossible de récupérer les données d\'abonnement.');
          setIsLoading(false);
        });
    } else {
      setError('ID client non trouvé.');
      setIsLoading(false);
    }
  }, [clientId]);

  // Vérification de l'objet abonnements
  console.log("Abonnements à afficher:", abonnements);

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <> <Menu/>
    <div className="container">
     
      {/* Affichage des abonnements */}
      <div className="abonnement-section">
        <h2>Mes Abonnements </h2>
        {abonnements.length > 0 ? (
          abonnements.map((abonnement, index) => (
            <div className="abonnement-card" key={abonnement.id}>
              <h3>Abonnement {abonnement.typeGym  }</h3>
             
              <p><strong>Fréquence de Paiement :</strong> {abonnement.frequencePaiement || 'Non spécifié'}</p>
              <p><strong>Date de Début :</strong> {abonnement.dateDebut ? new Date(abonnement.dateDebut).toLocaleDateString() : 'Non spécifiée'}</p>
              <p><strong>Date de Fin :</strong> {abonnement.dateFin ? new Date(abonnement.dateFin).toLocaleDateString() : 'Non spécifiée'}</p>
              <p><strong>Prix :</strong> {abonnement.prix ? `${abonnement.prix} €` : 'Non spécifié'}</p>
            </div>
          ))
        ) : (
          <p>Aucun abonnement trouvé.</p>
        )}
      </div>
    </div></>
  );
};

export default AfficheAbonnementUser;
