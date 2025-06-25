// src/components/navigation/Navbar.jsx

// Importa React per la creazione del componente.
import React from 'react';
// Importa Link (per la navigazione dichiarativa), useNavigate (per la navigazione programmatica) e useLocation (per accedere alla route corrente) da react-router-dom.
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Importa l'hook personalizzato useAuth per accedere allo stato di autenticazione e ai dati dell'utente.
import useAuth from '../../hooks/useAuth';
// Importa il componente GoogleLoginButton.
import GoogleLoginButton from '../auth/GoogleLoginButton';
// Importa la funzione per reindirizzare a Google OAuth.
import { redirectToGoogleOAuth } from '../../services/api/authService';

// Definizione del componente funzionale Navbar.
// Questo componente renderizza la barra di navigazione principale dell'applicazione.
const Navbar = () => {
  // Estrae lo stato di autenticazione (isAuthenticated), i dati dell'utente (user),
  // la funzione di logout, e lo stato di caricamento (isLoading) dal contesto AuthContext.
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  // Hook per la navigazione programmatica, utilizzato per reindirizzare dopo il logout.
  const navigate = useNavigate();
  // Hook per ottenere la posizione corrente (route).
  const location = useLocation();

  // Funzione per gestire il login con Google.
  const handleGoogleLogin = () => {
    redirectToGoogleOAuth();
  };

  // Funzione asincrona per gestire il logout dell'utente.
  const handleLogout = async () => {
    try {
      // Chiama la funzione di logout fornita dal AuthContext (che a sua volta chiama l'API di logout).
      await logout();
      // Dopo un logout riuscito, reindirizza l'utente alla pagina principale ('/').
      navigate('/');
    } catch (error) {
      // Se si verifica un errore durante il logout (es. problema di rete), logga l'errore.
      // Si potrebbe anche mostrare un messaggio di errore all'utente.
      console.error("Errore durante il logout dalla Navbar:", error);
    }
  };

  // Determina se la pagina corrente è la homepage.
  const isHomePage = location.pathname === '/';

  // Struttura JSX del componente Navbar.
  // Utilizza classi Bootstrap per lo styling e la responsività.
  return (
    // Elemento <nav> HTML5 con classi Bootstrap:
    // - "navbar": per lo stile base della navbar.
    // - "navbar-expand-lg": per espandere la navbar su schermi grandi (large) e collassarla su schermi più piccoli.
    // - "navbar-dark": per testo e link chiari.
    // - "navbar-custom-darker": classe personalizzata per sfondo più scuro.
    // - "fixed-top": per fissare la navbar in cima alla pagina.
    // La classe "w-100" è stata aggiunta per rendere la navbar full-width.
    // "bg-dark" è stata rimossa in favore di "navbar-custom-darker".
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom-darker w-100 fixed-top">
      {/* Contenitore fluido per la navbar, occupa l'intera larghezza. */}
        {/* Brand/Logo della navbar, un Link che punta alla homepage. */}
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">JobBoard</Link>
        {/* Pulsante "toggler" per la navbar su schermi piccoli (hamburger menu).
            Controlla il collasso del div con id "navbarNav". */}
        {!isHomePage && ( // Mostra il toggler solo se non siamo sulla homepage
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse" // Attributo Bootstrap per attivare il collasso.
            data-bs-target="#navbarNav" // ID dell'elemento da collassare/espandere.
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span> {/* Icona del toggler. */}
          </button>
        )}
        {/* Contenitore collassabile che contiene i link di navigazione. */}
        {/* Nasconde l'intero div se siamo sulla homepage */}
        {!isHomePage && (
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Lista non ordinata per i link di navigazione principali, allineati a sinistra ("me-auto"). */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Elemento di lista per il link alla Home. */}
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>

              {/* Pulsanti condizionali per tornare alle dashboard */}
              {/* 1. Navbar alla route /annunci e /mie-candidature: bottone per Dashboard Candidato */}
              {(location.pathname === '/annunci' || location.pathname === '/mie-candidature') && isAuthenticated && user?.tipoUtente === 'candidato' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard-candidato">Dashboard Candidato</Link>
                </li>
              )}
              {/* Link per tornare alla Dashboard Azienda */}
              {(location.pathname === '/crea-annuncio' || location.pathname === '/dashboard-azienda/annunci') && isAuthenticated && user?.tipoUtente === 'azienda' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard-azienda">Dashboard Azienda</Link>
                </li>
              )}

              {/* Link "Tutti gli Annunci" */}
              {/* Mostra "Tutti gli Annunci" tranne quando l'utente è su /dashboard-candidato.
                  La richiesta specifica che DEVE essere visibile su /mie-candidature.
                  Questa logica semplificata copre entrambi i casi.
              */}
              {location.pathname !== '/dashboard-candidato' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/annunci">Tutti gli Annunci</Link>
                </li>
              )}
              
              {/* Link condizionali principali alle dashboard generiche (evitando duplicati con i link contestuali sopra) */}
              {isAuthenticated && user?.tipoUtente === 'azienda' && 
                !(location.pathname === '/crea-annuncio' || location.pathname === '/dashboard-azienda/annunci' || location.pathname === '/dashboard-azienda') && (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard-azienda">Dashboard Azienda</Link>
                </li>
              )}
              {isAuthenticated && user?.tipoUtente === 'candidato' && 
                !(location.pathname === '/annunci' || location.pathname === '/mie-candidature' || location.pathname === '/dashboard-candidato') && ( // Updated path here
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard-candidato">Dashboard Candidato</Link> 
                </li>
              )}
            </ul>
            {/* Sezione dei link allineati a destra (login/logout, info utente).
                Viene renderizzata solo se lo stato di autenticazione non è in caricamento (!isLoading).
                Questo previene un "flicker" dei pulsanti Login/Register mentre si verifica la sessione. */}
            {!isLoading && (
              <ul className="navbar-nav">
                {/* Se l'utente è autenticato: */}
                {isAuthenticated ? (
                  // Mostra un dropdown con il nome/email dell'utente e l'opzione di logout.
                  <li className="nav-item dropdown">
                    {/* Link che attiva il dropdown Bootstrap. */}
                    <a
                      className="nav-link dropdown-toggle"
                      href="#" // href="#" è comune per link che attivano solo JS.
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown" // Attributo Bootstrap per il dropdown.
                      aria-expanded="false"
                    >
                      {/* Mostra il displayName o l'email dell'utente, e il suo tipoUtente. */}
                      {user?.displayName || user?.email} ({user?.tipoUtente})
                    </a>
                    {/* Menu del dropdown, allineato a destra ("dropdown-menu-end"). */}
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                      {/* Elemento del menu per il logout. È un pulsante stilizzato come dropdown-item. */}
                      <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </li>
                ) : (
                        <GoogleLoginButton onClick={handleGoogleLogin} />
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// Esporta il componente Navbar.
export default Navbar;
