import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const FormulaireAbonnement = ({ show, handleClose }) => {
  const [typesGym, setTypesGym] = useState([]); // Liste des types d'abonnement
  const [frequencesPaiement, setFrequencesPaiement] = useState([]); // Fréquences de paiement
  const [selectedTypeGym, setSelectedTypeGym] = useState(""); // Type d'abonnement sélectionné
  const [selectedFrequence, setSelectedFrequence] = useState(""); // Fréquence sélectionnée
  const [dateDebut, setDateDebut] = useState(""); // Date de début

  // Charger les données depuis l'API lors du montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7050/api/Abonnement");
        
        // Affichage des données dans la console
        console.log('Données reçues du backend:', response.data);
  
        const abonnements = response.data;
        
        // Extraire les options disponibles
        const types = [...new Set(abonnements.map((a) => a.typeGym))];
        const frequences = [...new Set(abonnements.map((a) => a.frequencePaiement))];
  
        setTypesGym(types);
        setFrequencesPaiement(frequences);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        toast.error("Impossible de charger les données d'abonnement. Réessayez plus tard.");
      }
    };
  
    fetchData();
  }, []);
  

  // Soumettre les données d'abonnement
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedTypeGym || !selectedFrequence || !dateDebut) {
      toast.error("Veuillez remplir tous les champs correctement !");
      return;
    }

    const dateDebutFormatted = new Date(dateDebut);
    const dateFin = new Date(dateDebutFormatted);
    dateFin.setFullYear(dateDebutFormatted.getFullYear() + 1); // Exemple : abonnement d'un an

    const abonnementData = {
      clientId: "05fe24f6-36f1-4f0f-a429-ac759db9bf7b", // ID client fixe pour l'exemple
      typeGym: selectedTypeGym,
      frequencePaiement: selectedFrequence,
      dateDebut: dateDebutFormatted.toISOString(),
      dateFin: dateFin.toISOString(),
      prix:"200",
    };

    try {
      const response = await axios.post(
        "https://localhost:7050/api/Abonnement",
        abonnementData
      );
      if (response.status === 201) {
        toast.success("Abonnement créé avec succès !");
        handleClose();
      } else {
        toast.error("Échec de la création de l'abonnement. Veuillez réessayer !");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'abonnement :", error.response?.data);
      toast.error(
        error.response?.data?.title || "Une erreur est survenue lors de la création de l'abonnement."
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Créer un abonnement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Type Gym */}
          <Form.Group className="mb-3">
            <Form.Label>Type de Gym</Form.Label>
            <Form.Control
              as="select"
              value={selectedTypeGym}
              onChange={(e) => setSelectedTypeGym(e.target.value)}
              required
            >
              <option value="">Sélectionnez un type</option>
              {typesGym.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Fréquence Paiement */}
          <Form.Group className="mb-3">
            <Form.Label>Fréquence de Paiement</Form.Label>
            <Form.Control
              as="select"
              value={selectedFrequence}
              onChange={(e) => setSelectedFrequence(e.target.value)}
              required
            >
              <option value="">Sélectionnez une fréquence</option>
              {frequencesPaiement.map((freq) => (
                <option key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Date de Début */}
          <Form.Group className="mb-3">
            <Form.Label>Date de Début</Form.Label>
            <Form.Control
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            S'abonner
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormulaireAbonnement;
