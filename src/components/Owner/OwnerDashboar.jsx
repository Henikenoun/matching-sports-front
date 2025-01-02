import React, { useState } from 'react';

// Composant fictif pour Reports
import '../Admin/Admin.css';
import AfficheEvenement from './AfficheEvenement';
import AfficheClub from './AfficheClub';
import AfficheTerrain from './AfficheTerrain';
import AfficheDemandeP from './AfficheDemandeP';
import AfficheReservations from '../Admin/AfficheReservations';
import Shop from '../shopOwner/Shop';

const OwnerDashboar = () => {
    // État pour gérer l'option active (Réservations, Abonnements, Settings, etc.)
    const [activeTab, setActiveTab] = useState('evenements'); // Par défaut 'reservations'

    // Fonction pour gérer le clic sur les options du menu
    const handleTabClick = (tab) => {
        setActiveTab(tab); // Change l'onglet actif
    };

    return (
        <div className="admin-dashboard">
            {/* Header Section */}
            <header>
                <div className="logosec">
                    <div className="logo">SPORTISSIMO</div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
                        className="icn menuicn"
                        alt="menu-icon"
                    />
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
                                className="nav-option option3"
                                onClick={() => handleTabClick('clubs')}
                            >
                                <i className="fas fa-users nav-img"></i> {/* Icône pour les clubs */}
                                <h3>Mon Club</h3>
                            </div>

                            <div
                                className="nav-option option3"
                                onClick={() => handleTabClick('evenements')}
                            >
                                <i className="fas fa-calendar-alt nav-img"></i>
                                <h3>Mes Evenements</h3>
                            </div>



                            <div
                                className="nav-option option3"
                                onClick={() => handleTabClick('terrains')}
                            >
                                <i className="fas fa-futbol nav-img"></i> {/* Icône pour les terrains */}
                                <h3>Mes Terrains</h3>
                            </div>
                            <div
                                className="nav-option option4"
                                onClick={() => handleTabClick('reservations')}
                            >
                                <i className="fas fa-calendar-check nav-img"></i>

                                <h3>Réservations</h3>
                            </div>

                            <div
                                className="nav-option option3"
                                onClick={() => handleTabClick('shops')}
                            >
                                <i className="fas fa-shop nav-img"></i>
                                <h3>Boutique</h3>
                            </div>
                            <div
                                className="nav-option option3"
                                onClick={() => handleTabClick('demandes')}
                            >
                                <i className="fas fa-file-alt nav-img"></i> {/* Icône pour les demandes */}
                                <h3>Demandes</h3>
                            </div>


                            <div className="nav-option logout">
                                <i className="fas fa-sign-out-alt nav-img"></i>
                                <h3>Se déconnecter</h3>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Main Content Section */}
                <div className="main">
                    {/* Affichage des données en fonction de l'onglet sélectionné */}
                    {activeTab === 'reservations' && <AfficheReservations />}
                    {activeTab === 'shops' && <Shop />}
                    {activeTab === 'evenements' && <AfficheEvenement />}
                    {activeTab === 'AjouterTerrain' && <AjouterTerrain />}
                    {activeTab === 'clubs' && <AfficheClub />}
                    {activeTab === 'terrains' && <AfficheTerrain />}
                    {activeTab === 'demandes' && <AfficheDemandeP />}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboar;