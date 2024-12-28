import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pag.css';

const AfficheAbonnements = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [clients, setClients] = useState({});
  const [typeAbonnement, setTypeAbonnement] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const abonnementsPerPage = 6;

  useEffect(() => {
    const fetchAbonnements = async (type) => {
      try {
        const url = type ? `https://localhost:7050/api/Abonnement/type/${type}` : 'https://localhost:7050/api/Abonnement';
        const response = await axios.get(url);
        setAbonnements(response.data);
        fetchClients(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnements', error);
      }
    };

    const fetchClients = async (abonnements) => {
      abonnements.forEach(async (abonnement) => {
        if (!clients[abonnement.clientId]) {
          try {
            const clientResponse = await axios.get(`https://localhost:7050/api/Account/${abonnement.clientId}`);
            setClients(prevClients => ({
              ...prevClients,
              [abonnement.clientId]: clientResponse.data
            }));
          } catch (error) {
            console.error(`Erreur lors de la récupération du client ${abonnement.clientId}`, error);
          }
        }
      });
    };

    fetchAbonnements(typeAbonnement);
  }, [clients, typeAbonnement]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleChangeType = (event) => {
    setTypeAbonnement(event.target.value);
  };

  const sortedAbonnements = abonnements.sort((a, b) => {
    const dateA = new Date(a.dateDebut);
    const dateB = new Date(b.dateDebut);
    return dateA - dateB;
  });

  const indexOfLastAbonnement = currentPage * abonnementsPerPage;
  const indexOfFirstAbonnement = indexOfLastAbonnement - abonnementsPerPage;
  const currentAbonnements = sortedAbonnements.slice(indexOfFirstAbonnement, indexOfLastAbonnement);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedAbonnements.length / abonnementsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h1 className="recent-Articles">Abonnements</h1>
        <select onChange={handleChangeType} value={typeAbonnement} className="filter-select">
          <option value="">Tous les types d'abonnements</option>
          <option value="SalleDeSport">Salle de Sport</option>
          <option value="CrossFit">CrossFit</option>
          <option value="Yoga">Yoga</option>
          <option value="Boxe">Boxe</option>
          <option value="Dance">Danse</option>
          <option value="Fitness">Fitness</option>
        </select>
      </div>

      <div className="report-body">
        <table className="abonnement-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Type</th>
              <th>Fréquence Paiement</th>
              <th>Prix</th>
              <th>Date Début</th>
              <th>Date Fin</th>
            </tr>
          </thead>
          <tbody>
            {currentAbonnements.map((abonnement, idx) => (
              <tr key={idx}>
                <td>
                  {clients[abonnement.clientId]
                    ? `${clients[abonnement.clientId].nom} ${clients[abonnement.clientId].prenom}`
                    : 'Client inconnu'}
                </td>
                <td>{abonnement.typeGym}</td>
                <td>{abonnement.frequencePaiement}</td>
                <td>{abonnement.prix} €</td>
                <td>{formatDate(abonnement.dateDebut)}</td>
                <td>{formatDate(abonnement.dateFin)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination avec boutons animés */}
        <div className="pagination-container">
          {currentPage > 1 && (
            <button className="pagination-btn" onClick={() => paginate(currentPage - 1)}>
              Précédent
            </button>
          )}
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`page-btn ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
          {currentPage < pageNumbers.length && (
            <button className="pagination-btn" onClick={() => paginate(currentPage + 1)}>
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AfficheAbonnements;
