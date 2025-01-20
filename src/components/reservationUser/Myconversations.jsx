import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Menu from '../Menu/Menu'; // Import the Menu component
import './Myconversation.css'; // Import the CSS file

const MyConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/conversations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter conversations to include only those with the current user
        const filteredConversations = response.data.filter(
          (conv) => conv.user_one_id === user.id || conv.user_two_id === user.id
        );

        setConversations(filteredConversations);

        console.log(filteredConversations);
      } catch (error) {
        console.error('Erreur lors de la récupération des conversations:', error.response?.data || error.message);
        toast.error('Erreur lors de la récupération des conversations.');
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/users/getAll', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersMap = {};
        response.data.forEach((user) => {
          usersMap[user.id] = user.name;
        });

        setUsers(usersMap);

        console.log(usersMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error.response?.data || error.message);
        toast.error('Erreur lors de la récupération des utilisateurs.');
      }
    };

    fetchConversations();
    fetchUsers();
  }, [user.id]);

  return (
    <div className="my-conversations-page">
      <Menu /> {/* Add the Menu component */}
      <div className="my-conversations-container">
        <h2>Mes Conversations</h2>
        {conversations.length === 0 ? (
          <p>Vous n'avez aucune conversation.</p>
        ) : (
          <ul className="conversations-list">
            {conversations.map((conversation) => {
              const otherUserId = conversation.user_one_id === user.id ? conversation.user_two_id : conversation.user_one_id;
              const lastMessage = conversation.messages[conversation.messages.length - 1];

              return (
                <li key={conversation.id} onClick={() => navigate(`/conversations/${conversation.id}`)}>
                  <div className="conversation-item">
                    <strong>Conversation avec {users[otherUserId] || 'Utilisateur inconnu'}</strong>
                    <p>{lastMessage ? lastMessage.message : 'Pas de messages'}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyConversations;