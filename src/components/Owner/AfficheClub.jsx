import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AfficheClubs = () => {
    const [club, setClub] = useState(null); // Stocke un seul club

    // Fonction pour récupérer les informations du club associé à l'utilisateur connecté
    const fetchUserClub = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.id) {
                const response = await axios.get(`http://localhost:8000/api/users/${user.id}`);
                const userData = response.data;
                if (userData.club) {
                    setClub(userData.club); // Stocke le club de l'utilisateur
                } else {
                    console.log('Aucun club trouvé pour cet utilisateur.');
                }
            } else {
                console.log("Utilisateur non trouvé dans le localStorage.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du club de l'utilisateur :", error);
        }
    };

    // Utilisation de useEffect pour récupérer les données au montage du composant
    useEffect(() => {
        fetchUserClub();
    }, []);

    if (!club) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <p className="text-muted">Chargement en cours...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-dark text-white text-center">
                            <h3>{club.nom}</h3>
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Ville :</strong> {club.ville}
                                </li>
                                <li className="list-group-item">
                                    <strong>Adresse :</strong> {club.adresse}
                                </li>
                                <li className="list-group-item">
                                    <strong>Numéro de téléphone :</strong> {club.numTel}
                                </li>
                                <li className="list-group-item">
                                    <strong>Email :</strong> {club.email}
                                </li>
                                <li className="list-group-item">
                                    <strong>Nombre de terrains :</strong> {club.nbTerrain}
                                </li>
                                <li className="list-group-item">
                                    <strong>Latitude :</strong> {club.latitude}
                                </li>
                                <li className="list-group-item">
                                    <strong>Longitude :</strong> {club.longitude}
                                </li>
                            </ul>
                        </div>
                        <div className="card-footer bg-light text-center">
                            <small className="text-muted">Informations du club associées à votre compte</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AfficheClubs;
