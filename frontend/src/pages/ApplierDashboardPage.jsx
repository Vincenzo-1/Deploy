// src/pages/ApplierDashboardPage.jsx

// Importa React per la creazione del componente.
import React from 'react';
// Importa il componente Link da react-router-dom per la navigazione dichiarativa.
import { Link } from 'react-router-dom';
// Importa l'hook personalizzato useAuth per accedere ai dati dell'utente autenticato.
import useAuth from '../hooks/useAuth.js'; // Ensured .js extension and correct path

// Definizione del componente funzionale ApplierDashboardPage.
// Questa pagina serve come pannello di controllo per gli utenti di tipo 'applier' (candidati).
const ApplierDashboardPage = () => {
  // Estrae l'oggetto 'user' dal contesto di autenticazione tramite l'hook useAuth.
  // 'user' contiene informazioni sull'utente loggato (es. displayName, email, userType).
  const { user } = useAuth();

  // Struttura JSX del componente.
  return (
    // Contenitore principale della pagina con classi Bootstrap per layout e margini.
    <div className="container mt-4">
      {/* Card Bootstrap per raggruppare il contenuto della dashboard. */}
      <div className="card">
        {/* Intestazione della card. */}
        <div className="card-header">
          <h2>Dashboard Candidato</h2> {/* Titolo della dashboard. */}
        </div>
        {/* Corpo della card. */}
        <div className="card-body">
          {/* Messaggio di benvenuto personalizzato.
              Mostra il displayName dell'utente se disponibile, altrimenti l'email.
              L'operatore optional chaining (?.) previene errori se 'user' è null. */}
          <p className="card-text">
            Benvenuto/a, <strong>{user?.displayName || user?.email}</strong>!
          </p>
          {/* Messaggio di incoraggiamento. */}
          <p>Pronto a cercare la tua prossima opportunità di lavoro?</p>
          {/* Separatore orizzontale. */}
          <hr />
          {/* Contenitore per i pulsanti di azione, con classi Bootstrap per layout flex. */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            {/* Link alla pagina dove l'utente può visualizzare le proprie candidature inviate ('/mie-candidature').
                Stilizzato come pulsante informativo Bootstrap. Include un'icona. */}
            <Link to="/mie-candidature" className="btn btn-info me-md-2 mb-2 mb-md-0">
              <i className="bi bi-file-earmark-text me-2"></i>Le Mie Candidature
            </Link>
            {/* Bottone "Sfoglia Tutti gli Annunci" aggiunto qui */}
            <Link to="/annunci" className="btn btn-primary">
              <i className="bi bi-card-list me-2"></i>Sfoglia Tutti gli Annunci
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

// Esporta il componente ApplierDashboardPage per l'utilizzo nel sistema di routing.
export default ApplierDashboardPage;
