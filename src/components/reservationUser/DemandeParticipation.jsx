import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DemandeParticipation = ({ equipeId }) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemande = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/demandes', { user_id: userId, equipe_id: equipeId });
      toast.success('Demande de participation envoyée avec succès!');
      setUserId('');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande de participation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="text" placeholder="ID Utilisateur" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <button onClick={handleDemande} disabled={loading}>{loading ? 'Chargement...' : 'Demander à rejoindre'}</button>
    </div>
  );
};

export default DemandeParticipation;