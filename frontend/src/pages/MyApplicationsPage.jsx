// src/pages/MyApplicationsPage.jsx

// Importa React e gli hook useState, useEffect, useCallback per la gestione dello stato e del ciclo di vita.
import React, { useState, useEffect, useCallback } from 'react';
// Importa la funzione API per ottenere le candidature inviate dall'utente autenticato.
import { getCandidatureFatte as getMyApplicationsApi } from '../services/api/candidatureService.js'; // Rinominato per chiarezza
// Importa Link da react-router-dom per permettere la navigazione, ad esempio, alla pagina degli annunci.
import { Link } from 'react-router-dom';
// Importa l'hook useAuth per accedere ai dati dell'utente (in particolare l'email).
import useAuth from '../hooks/useAuth';

// Definizione del componente funzionale MyApplicationsPage.
// Questa pagina mostra all'utente 'applier' la lista delle candidature che ha inviato.
const MyApplicationsPage = () => {
  // Stato per memorizzare l'array delle candidature dell'utente.
  const [applications, setApplications] = useState([]);
  // Stato per indicare se i dati sono in fase di caricamento.
  const [isLoading, setIsLoading] = useState(true);
  // Stato per memorizzare eventuali messaggi di errore.
  const [error, setError] = useState('');
  // Estrae l'utente dal contesto di autenticazione.
  const { user } = useAuth();

  // Funzione memoizzata (useCallback) per recuperare le candidature dell'utente dal backend.
  const fetchMyApplications = useCallback(async () => {
    if (!user?.email) {
      setError('Impossibile recuperare le candidature: utente non identificato o email mancante.');
      setIsLoading(false);
      setApplications([]);
      return;
    }
    setIsLoading(true); // Inizia il caricamento.
    setError('');       // Resetta errori precedenti.
    try {
      // Chiama la funzione getMyApplicationsApi del servizio API, passando l'email dell'utente.
      const response = await getMyApplicationsApi(user.email);
      // Imposta lo stato 'applications' con i dati ricevuti (o un array vuoto se response.data è null/undefined).
      setApplications(response.data || []);
    } catch (err) {
      // Gestisce gli errori della chiamata API.
      console.error('Errore caricamento mie candidature:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Errore nel caricamento delle tue candidature.');
      // Se l'API restituisce 404 (es. nessuna candidatura trovata, a seconda dell'implementazione backend),
      // si assicura che 'applications' sia un array vuoto.
      if (err.response?.status === 404) setApplications([]);
    }
    setIsLoading(false); // Termina il caricamento.
  }, [user]); // Aggiunta dipendenza 'user' per rieseguire se l'utente cambia.

  // Hook useEffect per chiamare fetchMyApplications al montaggio del componente o se l'utente cambia.
  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]); // Dipende da fetchMyApplications (che ora dipende da user).

  // Se i dati sono in caricamento, mostra uno spinner e un messaggio.
  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
        <p>Caricamento delle tue candidature...</p>
      </div>
    );
  }

  // Struttura JSX del componente.
  return (
    <div className="container mt-4">
      <h2>Le Mie Candidature</h2> {/* Titolo della pagina. */}
      <hr /> {/* Separatore. */}
      {/* Mostra un messaggio di errore se 'error' è presente. */}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Se il caricamento è terminato, non ci sono errori e non ci sono candidature,
          mostra un messaggio informativo con un link per sfogliare gli annunci. */}
      {!isLoading && applications.length === 0 && !error && (
        <div className="alert alert-info">
          Non hai ancora inviato nessuna candidatura. <Link to="/annunci">Sfoglia gli annunci</Link> per iniziare!
        </div>
      )}
      {/* Se ci sono candidature, le visualizza in una lista. */}
      {applications.length > 0 && (
        // Utilizza list-group di Bootstrap per la lista.
        <div className="list-group">
          {/* Itera sull'array 'applications' e renderizza un elemento per ogni candidatura. */}
          {applications.map(app => (
            // Elemento della lista con chiave univoca.
            <div key={app._id} className="list-group-item mb-3">
              {/* Titolo dell'annuncio a cui si è candidato.
                  Usa optional chaining (?.) per accedere a 'app.postAnnunci.titolo' in modo sicuro,
                  nel caso 'postAnnunci' non fosse popolato o fosse null. */}
              <h5 className="mb-1">Annuncio: {app.postAnnunci?.titolo || 'Titolo non disponibile'}</h5>
              {/* Dettagli dell'azienda e località dell'annuncio. */}
              <p className="mb-1 text-muted">
                Azienda: {app.postAnnunci?.azienda || 'N/D'} - Località: {app.postAnnunci?.località || 'N/D'}
              </p>
              {/* Descrizione/messaggio inviato con la candidatura. */}
              <p className="mb-1"><strong>Tua descrizione:</strong> {app.descrizioneCandidato}</p>
              {/* Data di invio della candidatura, formattata. */}
              <small className="text-muted">Inviata il: {new Date(app.dataCandidatura).toLocaleDateString()}</small>
              {/* TODO: Commento per una futura implementazione dello stato della candidatura (es. Inviata, In Revisione). */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Esporta il componente MyApplicationsPage.
export default MyApplicationsPage;
