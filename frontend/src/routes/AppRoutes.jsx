// src/routes/AppRoutes.jsx

// Importa React per la creazione di componenti.
import React from 'react';
// Importa i componenti necessari da 'react-router-dom' per la gestione del routing.
// BrowserRouter (rinominato Router): Contenitore principale per il routing basato su URL del browser.
// Routes: Contenitore per definire un insieme di rotte. Solo una rotta può essere attiva alla volta.
// Route: Definisce una singola associazione tra un percorso URL e un componente da renderizzare.
// Link: Componente per la navigazione dichiarativa tra le rotte (come un tag <a> ma per React Router).
// Navigate: Componente per reindirizzare programmaticamente a un'altra rotta.
// Outlet: Componente utilizzato nelle rotte "layout" o "genitore" per renderizzare i componenti figli definiti nelle rotte annidate.
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';

// Importa l'hook personalizzato useAuth per accedere al contesto di autenticazione.
import useAuth from '../hooks/useAuth';

// Importa tutti i componenti pagina che verranno associati alle diverse rotte.
import HomePage from '../pages/HomePage';
import CompanyDashboardPage from '../pages/CompanyDashboardPage';
import OAuthCallbackPage from '../pages/OAuthCallbackPage';
import CreateJobPage from '../pages/CreateJobPage';
import ViewCompanyJobsPage from '../pages/ViewCompanyJobsPage';
import ViewApplicantsPage from '../pages/ViewApplicantsPage';
import ApplierDashboardPage from '../pages/ApplierDashboardPage';
import JobListingsPage from '../pages/JobListingsPage';
import MyApplicationsPage from '../pages/MyApplicationsPage';
import RoleSelectionPage from '../pages/RoleSelectionPage'; // Importa la nuova pagina

// Componente placeholder per la pagina 404 Not Found.
// Viene visualizzato quando nessuna altra rotta corrisponde all'URL corrente.
// Include un Link per tornare alla HomePage.
const NotFoundPage = () => <div><h1>404 - Pagina Non Trovata</h1><Link to="/">Torna alla Home</Link></div>;

// Componente ProtectedRoute: gestisce la logica per le rotte protette.
// Riceve come prop 'allowedUserTypes', un array di stringhe che indica quali tipi di utente sono autorizzati ad accedere.
const ProtectedRoute = ({ allowedUserTypes }) => {
  // Estrae lo stato di autenticazione (isAuthenticated), i dati dell'utente (user),
  // e lo stato di caricamento (isLoading) dal contesto AuthContext tramite l'hook useAuth.
  const { isAuthenticated, user, isLoading } = useAuth();

  // Se lo stato di autenticazione è ancora in fase di caricamento (es. controllo iniziale della sessione).
  if (isLoading) {
    // Mostra un messaggio di caricamento o uno spinner.
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Verifica autenticazione in corso...</p>
      </div>
    );
  }

  // Se la rotta richiede specifici tipi di utente (allowedUserTypes è fornito)
  // e il tipo dell'utente corrente (user?.userType) non è incluso tra quelli permessi.
  if (allowedUserTypes && !allowedUserTypes.includes(user?.tipoUtente)) {
    // Reindirizza l'utente alla pagina principale (HomePage).
    // Questo impedisce l'accesso a rotte non autorizzate per il tipo di utente.
    return <Navigate to="/" replace />;
  }

  // Se l'utente è autenticato e (se specificato) autorizzato per tipo,
  // renderizza il componente figlio definito nella rotta protetta.
  // <Outlet /> è un segnaposto per i componenti delle rotte figlie (nested routes).
  return <Outlet />;
};

// Componente AppRoutes: definisce la struttura di routing principale dell'applicazione.
const AppRoutes = () => {
  return (
    // Routes contiene tutte le definizioni <Route>.
    // Il <BrowserRouter> è ora fornito in main.jsx
    <Routes>
      {/* Definizioni delle Rotte Pubbliche: accessibili a tutti gli utenti. */}
      <Route path="/" element={<HomePage />} /> {/* Rotta per la pagina principale. */}
      <Route path="/annunci" element={<JobListingsPage />} /> {/* Rotta per la lista pubblica degli annunci. */}
      <Route path="/oauth-callback" element={<OAuthCallbackPage />} /> {/* Rotta per gestire il callback di OAuth. */}

      {/* Rotta per la selezione del ruolo utente.
          Questa rotta dovrebbe essere protetta da un utente autenticato.
          ProtectedRoute qui può essere usato per garantire che solo utenti autenticati la vedano.
          La logica interna a RoleSelectionPage poi gestirà il caso in cui un ruolo sia già stato scelto.
      */}
      <Route element={<ProtectedRoute allowedUserTypes={null} />}> {/* allowedUserTypes={null} o omesso per solo controllo auth */}
        <Route path="/role-selection" element={<RoleSelectionPage />} />
      </Route>

      {/* Gruppo di Rotte Protette per utenti di tipo 'azienda'. */}
      {/* Utilizza ProtectedRoute come elemento "layout" o "genitore". */}
      {/* Tutte le rotte annidate qui dentro erediteranno la protezione. */}
      <Route element={<ProtectedRoute allowedUserTypes={['azienda']} />}>
        {/* Rotta per la dashboard dell'azienda. */}
        <Route path="/dashboard-azienda" element={<CompanyDashboardPage />} />
        {/* Rotta per visualizzare gli annunci pubblicati dall'azienda. */}
        <Route path="/dashboard-azienda/annunci" element={<ViewCompanyJobsPage />} />
        {/* Rotta per creare un nuovo annuncio. */}
        <Route path="/crea-annuncio" element={<CreateJobPage />} />
        {/* Rotta per visualizzare i candidati per un annuncio specifico. ':id' è un parametro URL. */}
        <Route path="/annuncio/:id/candidati" element={<ViewApplicantsPage />} />
      </Route>

      {/* Gruppo di Rotte Protette per utenti di tipo 'candidato'. */}
      <Route element={<ProtectedRoute allowedUserTypes={['candidato']} />}>
        {/* Rotta per la dashboard del candidato. */}
        <Route path="/dashboard-candidato" element={<ApplierDashboardPage />} />
        {/* Rotta per visualizzare le candidature inviate dal candidato. */}
        <Route path="/mie-candidature" element={<MyApplicationsPage />} />
      </Route>

      {/* Rotta Catch-all (o Not Found): se nessuna delle rotte precedenti corrisponde. */}
      {/* Il path "*" cattura qualsiasi URL non precedentemente abbinato. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Esporta il componente AppRoutes.
export default AppRoutes;
