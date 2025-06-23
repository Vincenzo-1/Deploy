// src/pages/CompanyDashboardPage.jsx

// Importa React per la creazione del componente.
import React from 'react';
// Importa il componente Link da react-router-dom per la navigazione tra le pagine.
import { Link } from 'react-router-dom';
// Importa l'hook personalizzato useAuth per accedere ai dati dell'utente autenticato dal contesto.
import useAuth from '../hooks/useAuth';

// Definizione del componente funzionale CompanyDashboardPage.
// Questa pagina serve come pannello di controllo per gli utenti di tipo 'azienda'.
const CompanyDashboardPage = () => {
  // Estrae l'oggetto 'user' dal contesto di autenticazione.
  // 'user' contiene informazioni sull'utente attualmente loggato (es. displayName, email, userType).
  const { user } = useAuth();

  // Struttura JSX del componente.
  return (
    // Contenitore principale della pagina con classe Bootstrap "container" e margine superiore "mt-4".
    <div className="container mt-4">
      {/* Card Bootstrap per raggruppare il contenuto della dashboard. */}
      <div className="card">
        {/* Intestazione della card. */}
        <div className="card-header">
          <h2>Dashboard Azienda</h2> {/* Titolo della dashboard. */}
        </div>
        {/* Corpo della card. */}
        <div className="card-body">
          {/* Messaggio di benvenuto personalizzato.
              Mostra il displayName dell'utente se disponibile, altrimenti mostra l'email.
              L'operatore optional chaining (?.) evita errori se 'user' è null o undefined. */}
          <p className="card-text">
            Benvenuta, <strong>{user?.displayName || user?.email}</strong>!
          </p>
          {/* Breve descrizione delle funzionalità disponibili. */}
          <p>Da qui puoi gestire i tuoi annunci di lavoro.</p>
          {/* Separatore orizzontale. */}
          <hr />
          {/* Contenitore per i pulsanti di azione, utilizza classi Bootstrap per il layout flex.
              - "d-grid gap-2": per stackare i bottoni su mobile e creare spaziatura.
              - "d-md-flex": per layout inline su schermi medi e superiori.
              - "justify-content-md-start": per allineare i bottoni a sinistra su schermi medi e superiori. */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            {/* Link alla pagina per creare un nuovo annuncio ('/crea-annuncio').
                Stilizzato come un pulsante Bootstrap primario ("btn btn-primary").
                Include un'icona Bootstrap ("bi bi-plus-circle-fill") per chiarezza visiva.
                "me-md-2": margine destro su schermi medi e superiori.
                "mb-2 mb-md-0": margine inferiore su mobile, nessun margine inferiore su schermi medi e superiori. */}
            <Link to="/crea-annuncio" className="btn btn-primary me-md-2 mb-2 mb-md-0">
              <i className="bi bi-plus-circle-fill me-2"></i>Crea Nuovo Annuncio
            </Link>
            {/* Link alla pagina per visualizzare gli annunci pubblicati dall'azienda ('/dashboard-azienda/annunci').
                Stilizzato come un pulsante Bootstrap informativo ("btn btn-info").
                Include un'icona Bootstrap ("bi bi-list-task"). */}
            <Link to="/dashboard-azienda/annunci" className="btn btn-info">
              <i className="bi bi-list-task me-2"></i>Visualizza Annunci Pubblicati
            </Link>
          </div>
        </div>
        {/* Piè di pagina della card, con testo attenuato. */}
        <div className="card-footer text-muted">
          {/* Mostra il tipo di utente loggato, per conferma. */}
          {user?.tipoUtente}
        </div>
      </div>
    </div>
  );
};

// Esporta il componente CompanyDashboardPage per l'utilizzo nel sistema di routing.
export default CompanyDashboardPage;
