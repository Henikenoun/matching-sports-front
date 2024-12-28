import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AjouterTerrain.css'; // Importer le fichier CSS pour le style

const AjouterTerrain = () => {
    const [terrains, setTerrains] = useState([]);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editTerrainId, setEditTerrainId] = useState(null);
    const [editPrix, setEditPrix] = useState(0);

    const [newTerrain, setNewTerrain] = useState({
        nom: '',
        type: '',
        prix: 0,
    });

    const fetchTerrains = async () => {
        try {
            const response = await axios.get('https://localhost:7050/api/Terrain');
            setTerrains(response.data);
        } catch (error) {
            setError('Impossible de récupérer les terrains.');
        }
    };

    const handleAddTerrain = async () => {
        try {
            await axios.post('https://localhost:7050/api/Terrain', newTerrain);
            fetchTerrains();
            setNewTerrain({ nom: '', type: '', prix: 0 });
            setIsAdding(false);
        } catch (error) {
            setError('Impossible d\'ajouter le terrain.');
        }
    };

    const handleEditTerrain = async (id) => {
        try {
            const terrainToUpdate = terrains.find((t) => t.id === id);
            const updatedTerrain = { ...terrainToUpdate, prix: editPrix };
            await axios.put(`https://localhost:7050/api/Terrain/${id}`, updatedTerrain);
            fetchTerrains();
            setEditTerrainId(null);
        } catch (error) {
            setError('Impossible de modifier le terrain.');
        }
    };

    const handleDeleteTerrain = async (id) => {
        try {
            await axios.delete(`https://localhost:7050/api/Terrain/${id}`);
            fetchTerrains();
        } catch (error) {
            setError('Impossible de supprimer le terrain.');
        }
    };

    useEffect(() => {
        fetchTerrains();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Gestion des Terrains</h1>
            {error && <p className="error-message">{error}</p>}

            {/* Bouton pour afficher ou cacher le formulaire */}
            <button onClick={() => setIsAdding(!isAdding)} className="btn btn-toggle">
                {isAdding ? 'Annuler' : 'Ajouter un terrain'}
            </button>

            {/* Formulaire pour ajouter un terrain */}
            {isAdding && (
                <div className="form-container">
                    <h2>Ajouter un Terrain</h2>
                    <input
                        type="text"
                        placeholder="Nom"
                        value={newTerrain.nom}
                        onChange={(e) => setNewTerrain({ ...newTerrain, nom: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Type"
                        value={newTerrain.type}
                        onChange={(e) => setNewTerrain({ ...newTerrain, type: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="number"
                        placeholder="Prix"
                        value={newTerrain.prix}
                        onChange={(e) => setNewTerrain({ ...newTerrain, prix: parseFloat(e.target.value) })}
                        className="input-field"
                    />
                    <button onClick={handleAddTerrain} className="btn btn-add">
                        Ajouter
                    </button>
                </div>
            )}

            {/* Liste des terrains */}
            <div className="terrain-list">
                {terrains.map((terrain) => (
                    <div key={terrain.id} className="terrain-item">
                        <h3>{terrain.nom}</h3>
                        <p>Type: {terrain.type}</p>
                        <p>Prix: {terrain.prix} €</p>

                        {editTerrainId === terrain.id ? (
                            <div className="edit-form">
                                <input
                                    type="number"
                                    value={editPrix}
                                    onChange={(e) => setEditPrix(parseFloat(e.target.value))}
                                    className="input-field edit-input"
                                />
                                <button
                                    onClick={() => handleEditTerrain(terrain.id)}
                                    className="btn btn-save"
                                >
                                    Enregistrer
                                </button>
                                <button
                                    onClick={() => setEditTerrainId(null)}
                                    className="btn btn-cancel"
                                >
                                    Annuler
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setEditTerrainId(terrain.id);
                                    setEditPrix(terrain.prix);
                                }}
                                className="btn btn-edit"
                            >
                                Modifier le prix
                            </button>
                        )}

                        <button
                            onClick={() => handleDeleteTerrain(terrain.id)}
                            className="btn btn-delete"
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AjouterTerrain;
