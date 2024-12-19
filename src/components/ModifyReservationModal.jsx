import React, { useState, useEffect } from 'react';
import './ModifyReservationModal.css';

const ModifyReservationModal = ({ isOpen, onClose, reservation, onSave }) => {
  if (!isOpen || !reservation) return null;

  const [newDateDebut, setNewDateDebut] = useState('');

  useEffect(() => {
    if (reservation) {
      const dateDebut = new Date(reservation.dateDebut);
      setNewDateDebut(dateDebut.toISOString().split('T')[0] + 'T' + String(dateDebut.getHours()).padStart(2, '0') + ':00');
    }
  }, [reservation]);

  const handleDateChange = (event) => {
    setNewDateDebut(event.target.value);
  };

  const handleSave = () => {
    onSave(newDateDebut);
    onClose(); // Fermer le modal après l'enregistrement
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h3>Modifier la réservation</h3>
          <div className="form-group">
            <label htmlFor="dateDebut">Date et heure de début:</label>
            <input
              type="datetime-local"
              id="dateDebut"
              value={newDateDebut}
              onChange={handleDateChange}
              min={`${new Date().toISOString().split('T')[0]}T10:00`}
              step="3600"
            />
          </div>
          <div className="modal-actions">
            <button className="modal-save" onClick={handleSave}>Sauvegarder</button>
            <button className="modal-close" onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyReservationModal;
