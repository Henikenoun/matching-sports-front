import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '../Menu/Menu';

const NotificationPage = () => {
  // Liste statique de notifications
  const staticNotifications = [
    { id: 1, message: "L'utilisateur Abouda a soumis une demande pour l'équipe." },
    { id: 2, message: "L'utilisateur Yassine a réservé un terrain pour le 20 janvier 2025." },
    { id: 3, message: "L'événement 'Tournoi de football' a été annulé." },
    { id: 4, message: "Votre demande pour rejoindre l'équipe 'Tigers' a été acceptée." },
    { id: 5, message: "Votre réservation pour le terrain A a été refusée." },
  ];

  return (
    <div>
      <Menu />
      <div className="container" style={{ marginTop: '100px' }}>
        <h2>Notifications</h2>
        {staticNotifications.length > 0 ? (
          <ul>
            {staticNotifications.map((notification) => (
              <li key={notification.id}>
                <p><strong>Message:</strong> {notification.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune notification disponible.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default NotificationPage;
