import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import "./Accueil.css";

const FormulaireTerrain = ({ show, handleClose, selectedSport }) => {
  const [terrains, setTerrains] = useState([]); // Liste des terrains récupérés depuis l'API
  const [filteredTerrains, setFilteredTerrains] = useState([]); // Terrains filtrés selon le type
  const [terrain, setTerrain] = useState(""); // Terrain sélectionné
  const [date, setDate] = useState(""); // Date sélectionnée
  const [time, setTime] = useState(""); // Heure sélectionnée
  const [availableTimes, setAvailableTimes] = useState([]); // Heures disponibles

  // Charger les terrains depuis l'API lors du montage
  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        const response = await axios.get("https://localhost:7050/api/Terrain");
        setTerrains(response.data); // Mettre à jour la liste des terrains
      } catch (error) {
        console.error("Erreur lors du chargement des terrains :", error);
        toast.error("Impossible de charger les terrains. Réessayez plus tard.");
      }
    };

    fetchTerrains();
  }, []);

  // Filtrer les terrains en fonction du sport sélectionné
  useEffect(() => {
    if (selectedSport) {
      const filtered = terrains.filter(
        (t) => t.type.toLowerCase() === selectedSport.toLowerCase()
      );
      setFilteredTerrains(filtered);
    }
  }, [terrains, selectedSport]);

  // Charger les heures disponibles pour un terrain et une date spécifiques
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (terrain && date) {
        try {
          const response = await axios.get(
            `https://localhost:7050/api/Reservation/AvailableTimes`,
            {
              params: {
                terrainId: terrain,
                date: date,
              },
            }
          );
          setAvailableTimes(response.data); // Met à jour les heures disponibles
        } catch (error) {
          console.error("Erreur lors du chargement des heures :", error);
          toast.error("Impossible de charger les heures disponibles.");
        }
      }
    };

    fetchAvailableTimes();
  }, [terrain, date]);

  // Soumettre la réservation
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!terrain || !date || !time) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    // Vérification si la date sélectionnée est antérieure à aujourd'hui
    const today = new Date();
    const selectedDate = new Date(date);

    today.setHours(0, 0, 0, 0); // Supprimer l'heure pour comparaison
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Vous ne pouvez pas réserver une date passée !");
      return;
    }

    const dateString = `${date}T${time}:00`;
    const dateReservation = new Date(dateString);
    const dateDebut = new Date(dateReservation);
    dateDebut.setMinutes(0);
    dateDebut.setSeconds(0);

    const dateFin = new Date(dateDebut);
    dateFin.setHours(dateDebut.getHours() + 1);
    dateFin.setMinutes(dateDebut.getMinutes() + 30); // Ajouter 1h30

    try {
      // Vérifier si le créneau est déjà réservé
      const conflictCheckResponse = await axios.get(
        `https://localhost:7050/api/Reservation/CheckConflict`,
        {
          params: {
            terrainId: terrain,
            dateDebut: dateDebut.toISOString(),
            dateFin: dateFin.toISOString(),
          },
        }
      );

      if (conflictCheckResponse.data.conflict) {
        toast.error("Ce créneau est déjà réservé pour le terrain sélectionné.");
        return;
      }

      // Si pas de conflit, soumettre la réservation
      const reservationData = {
        clientId: "ff032b49-f332-40bf-b7ef-f88827d66f60", // ID client fixe pour l'exemple
        terrainId: terrain, // ID du terrain sélectionné
        dateReservation: dateReservation.toISOString(),
        dateDebut: dateDebut.toISOString(),
        dateFin: dateFin.toISOString(),
      };

      const response = await axios.post(
        "https://localhost:7050/api/Reservation",
        reservationData
      );

      if (response.status === 201) {
        toast.success("Réservation effectuée avec succès !");
        handleClose();
      } else {
        toast.error("Échec de la réservation. Veuillez réessayer !");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification ou réservation :", error);
      toast.error(
        "Erreur : " +
          (error.response?.data?.title || "Une erreur est survenue")
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Réservation pour {selectedSport}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Liste des terrains */}
          <Form.Group className="mb-3">
            <Form.Label>Choisissez un terrain</Form.Label>
            <Form.Control
              as="select"
              value={terrain}
              onChange={(e) => setTerrain(e.target.value)}
              required
            >
              <option value="">Sélectionnez un terrain</option>
              {filteredTerrains.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Date */}
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]} // Désactive les dates passées
            />
          </Form.Group>

          {/* Heure */}
          <Form.Group className="mb-3">
            <Form.Label>Heure</Form.Label>
            <Form.Control
              as="select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="">Sélectionnez une heure</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit">
            Réserver
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

export default FormulaireTerrain;
