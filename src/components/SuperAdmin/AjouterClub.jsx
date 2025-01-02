import React, { useState } from 'react';
import axios from 'axios';
import './ModalAjout.css';

const AjouterClub = ({ isOpen, toggleModal, fetchClubs }) => {
    const [newClub, setNewClub] = useState({
        nom: '',
        ville: '',
        adresse: '',
        numTel: '',
        email: '',
        latitude: '',
        longitude: ''
    });

    const villesDisponibles = [
        'Tunis', 'Sfax', 'Sousse', 'Benzart', 'Gabès', 'Ariana', 'Nabeul', 'Monastir', 'Mahdia', 'Sidi Bouzid', 'Kairouan'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClub({ ...newClub, [name]: value });
    };

    const handleAddClub = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/clubs', newClub);
            fetchClubs(); // Rafraîchit la liste des clubs après ajout
            toggleModal(); // Ferme le modal après l'ajout
        } catch (error) {
            console.error('Erreur lors de l\'ajout du club', error);
        }
    };

    if (!isOpen) return null; // Ne pas afficher le modal si isOpen est false

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close" onClick={toggleModal}>&times;</span>
                <h2>Ajouter un club</h2>
                <form onSubmit={handleAddClub}>
                    <input
                        type="text"
                        name="nom"
                        value={newClub.nom}
                        onChange={handleInputChange}
                        placeholder="Nom"
                        required
                    />
                    <select
                        name="ville"
                        value={newClub.ville}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                    >
                        <option value="">Sélectionner une ville</option>
                        {villesDisponibles.map((ville, index) => (
                            <option key={index} value={ville}>{ville}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="adresse"
                        value={newClub.adresse}
                        onChange={handleInputChange}
                        placeholder="Adresse"
                        required
                    />
                    <input
                        type="text"
                        name="numTel"
                        value={newClub.numTel}
                        onChange={handleInputChange}
                        placeholder="Numéro de téléphone"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={newClub.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="text"
                        name="latitude"
                        value={newClub.latitude}
                        onChange={handleInputChange}
                        placeholder="Latitude"
                        required
                    />
                    <input
                        type="text"
                        name="longitude"
                        value={newClub.longitude}
                        onChange={handleInputChange}
                        placeholder="Longitude"
                        required
                    />
                    <button type="submit">Ajouter le club</button>
                </form>
            </div>
        </div>
    );
};

export default AjouterClub;
