import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Êtes-vous sûr de vouloir supprimer cette réservation ?</h3>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button className="btn-confirm" onClick={onConfirm}>
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
