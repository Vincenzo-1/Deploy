// src/pages/OAuthCallbackPage.jsx

// Importa React e gli hook useEffect (per gestire effetti collaterali post-render) e useContext (per accedere al contesto Auth).
import React, { useEffect, useContext } from 'react';
// Importa useNavigate (per reindirizzare l'utente) e useLocation (per accedere ai parametri della query string URL).
import { useNavigate, useLocation } from 'react-router-dom';
// Importa direttamente AuthContext per poter utilizzare useContext; alternativamente si potrebbe usare l'hook useAuth se non ci fossero problemi di dipendenze cicliche o per preferenza.
import AuthContext from '../contexts/AuthContext';

// Definizione del componente funzionale OAuthCallbackPage.
// Questa pagina gestisce il reindirizzamento dal provider OAuth (es. Google) dopo che l'utente
// ha tentato di autenticarsi. Il suo scopo principale è aggiornare lo stato di autenticazione
// nell'applicazione e reindirizzare l'utente alla pagina appropriata.
const OAuthCallbackPage = () => {
  // Estrae le funzioni e gli stati necessari dal AuthContext utilizzando l'hook useContext.
  // - refreshAuthStatus: funzione per forzare un controllo dello stato di autenticazione (chiama getCurrentUser).
  // - user: oggetto contenente i dati dell'utente, se autenticato.
  // - isAuthenticated: booleano che indica se l'utente è autenticato.
  // - isLoading: booleano che indica se il contesto Auth è in fase di caricamento/verifica dello stato.
  const { refreshAuthStatus, user, isAuthenticated, isLoading } = useContext(AuthContext);
  // Hook per la navigazione programmatica.
  const navigate = useNavigate();
  // Hook per accedere all'oggetto 'location' corrente, che include informazioni sull'URL (es. query string).
  const location = useLocation();

  // Primo useEffect: gestisce il controllo iniziale degli errori OAuth e l'avvio del refresh dello stato.
  // Si esegue al montaggio del componente e ogni volta che una delle sue dipendenze cambia.
  useEffect(() => {
    // Crea un oggetto URLSearchParams dalla query string dell'URL corrente (location.search).
    // Questo permette di leggere facilmente i parametri passati da Google tramite l'URL di callback.
    const queryParams = new URLSearchParams(location.search);
    // Controlla se è presente un parametro 'error' nella query string.
    if (queryParams.get('error')) {
      // Se c'è un errore (es. l'utente ha negato l'accesso), logga l'errore e reindirizza
      // l'utente alla HomePage con un messaggio di errore appropriato.
      console.error('Errore OAuth:', queryParams.get('error'));
      navigate('/?error=' + queryParams.get('error')); // Reindirizza a HomePage con parametro di errore
      return; // Esce dall'effetto per evitare ulteriori elaborazioni.
    }

    // Se il contesto Auth non è attualmente in fase di caricamento (isLoading è false)
    // E l'utente non è ancora autenticato (isAuthenticated è false),
    // allora chiama refreshAuthStatus.
    // Questo è cruciale perché, dopo il reindirizzamento da Google, il frontend
    // potrebbe non essere immediatamente consapevole della nuova sessione stabilita dal backend.
    // refreshAuthStatus forza una chiamata a /auth/me per aggiornare lo stato.
    if (!isLoading && !isAuthenticated) {
        refreshAuthStatus();
    }
    // Dipendenze dell'effetto: si riesegue se cambiano location.search, navigate, refreshAuthStatus, isLoading, o isAuthenticated.
  }, [location.search, navigate, refreshAuthStatus, isLoading, isAuthenticated]);

  // Secondo useEffect: gestisce il reindirizzamento dell'utente dopo che lo stato di autenticazione è stato aggiornato.
  // Si esegue quando isLoading, isAuthenticated, user o navigate cambiano.
  useEffect(() => {
    // Procede solo se il caricamento iniziale/refresh dello stato Auth è completato (isLoading è false).
    if (!isLoading) {
        // Se l'utente è autenticato e l'oggetto user è valido.
        if (isAuthenticated && user) {
            // Controlla se tipoUtente è definito.
            if (user.tipoUtente) {
                // Reindirizza l'utente alla dashboard appropriata in base al suo userType.
                if (user.tipoUtente === 'azienda') {
                    navigate('/dashboard-azienda');
                } else if (user.tipoUtente === 'candidato') {
                    navigate('/dashboard-candidato'); // Corretto il reindirizzamento
                } else {
                    // Caso imprevisto di tipoUtente, reindirizza a home con errore.
                    console.warn('OAuth Callback: tipoUtente non riconosciuto:', user.tipoUtente);
                    navigate('/?error=invalid_user_type');
                }
            } else {
                // Se tipoUtente non è definito, reindirizza alla pagina di selezione ruolo.
                console.log('OAuth Callback: tipoUtente non definito, reindirizzamento a /role-selection');
                navigate('/role-selection');
            }
        } else {
            // Se, dopo il tentativo di refresh, l'utente non risulta autenticato o user è null,
            // significa che c'è stato un problema nel processo di autenticazione OAuth
            // o che l'utente non ha completato passaggi necessari (es. scelta del ruolo se è un nuovo utente OAuth).
            // Logga un messaggio per debug.
            console.log('OAuth Callback: Utente non autenticato dopo refresh. User:', user);
            // Reindirizza l'utente alla HomePage con un messaggio di errore.
            // Una gestione più avanzata potrebbe reindirizzare a una pagina "Completa Profilo" o "Scegli Ruolo".
            navigate('/?error=oauth_callback_failed'); // Reindirizza a HomePage
        }
    }
    // Dipendenze dell'effetto.
  }, [isLoading, isAuthenticated, user, navigate]);

  // Struttura JSX del componente: mostra un messaggio di caricamento mentre
  // lo stato di autenticazione viene verificato e l'utente viene reindirizzato.
  return (
    <div className="container mt-5 text-center">
      <h2>Autenticazione in corso...</h2>
      <p>Sarai reindirizzato a breve.</p>
      {/* Spinner di Bootstrap per feedback visivo. */}
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

// Esporta il componente OAuthCallbackPage.
export default OAuthCallbackPage;
