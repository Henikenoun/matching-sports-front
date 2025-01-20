import React, { useState } from 'react';
import AfficheClubs from './AfficheClubs';
import AfficheAbonnements from '../Admin/AfficheAbonnements';
import AjouterTerrain from '../Admin/AjouterTerrain';
import logoImage from '../../assets/LOGOL.png';
// Composant fictif pour Reports
import './SupAdDashoard.css';
import AfficheUsers from './AfficheUsers';
import AjouteAdmin from './AjouteAdmin';
import AfficheAdmins from './AfficheAdmins';
import AfficherShops from './AfficherShops';

const SupAdDashoard = () => {
    // État pour gérer l'option active (Réservations, Abonnements, Settings, etc.)
    const [activeTab, setActiveTab] = useState('reservations'); // Par défaut 'reservations'

    // Fonction pour gérer le clic sur les options du menu
    const handleTabClick = (tab) => {
        setActiveTab(tab); // Change l'onglet actif
    };

    return (
        <div className="admin-dashboard">
            {/* Header Section */}
            <header>
                 <div className="logo" onClick={() => navigate('/')} style={{ marginTop: '15px' }}>
                                  <img src={logoImage} alt="Sportissimo Logo" style={{ width: '120px', height: 'auto' }} />
                                </div>
                {/* Search bar */}
                <div className="searchbar">
                    <input type="text" placeholder="Search" />
                    <div className="searchbtn">
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                            className="icn srchicn"
                            alt="search-icon"
                        />
                    </div>
                </div>
            </header>

            <div className="main-container">
                {/* Sidebar Section */}
                <div className="navcontainer">
                    <nav className="nav">
                        <div className="nav-upper-options">
                            <div
                                className="option2 nav-option"
                                onClick={() => handleTabClick('reservations')}
                            >
                               <i className="fas fa-volleyball-ball nav-img"></i>



                                 <h3>Clubs</h3>
                            </div>

                            <div
                                className="nav-option option4"
                                onClick={() => handleTabClick('Utilisateurs')}
                            >
                                <i className="fas fa-users nav-img"></i>

                                <h3>Utilisateurs</h3>
                            </div>
                            <div
                                className="nav-option option5"
                                onClick={() => handleTabClick('AfficheAdmins')}
                            >
                                <i className="fas fa-user nav-img"></i>
                                <h3>Responsable Club</h3>
                            </div>
                            <div
                                className="nav-option option3"
                                onClick={() => handleTabClick('ajoutAdmin')}
                            >
                                <i className="fas fa-plus-circle nav-img"></i>

                                <h3>Ajouter Responsable Club</h3>
                            </div>


                            <div
                                className="nav-option option3"
                                onClick={() => handleTabClick('AfficherShops')}
                            >
                                <i className="fas fa-shop nav-img"></i>
                                <h3>Shops</h3>
                            </div>



                            <div className="nav-option logout">
                                <i className="fas fa-sign-out-alt nav-img"></i>
                                <h3>Logout</h3>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Main Content Section */}
                <div className="main">
                    {/* Affichage des données en fonction de l'onglet sélectionné */}
                    {activeTab === 'reservations' && <AfficheClubs />}
                    {activeTab === 'Utilisateurs' && <AfficheUsers />}
                    {activeTab === 'AfficheAdmins' && <AfficheAdmins />}
                    {activeTab === 'AfficherShops' && <AfficherShops />}
                    {activeTab === 'ajoutAdmin' && <AjouteAdmin />}
                </div>
            </div>
        </div>
    );
};

export default SupAdDashoard;
