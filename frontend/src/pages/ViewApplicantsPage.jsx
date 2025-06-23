// src/pages/ViewApplicantsPage.jsx

// Importa React e gli hook useState, useEffect, useCallback per la gestione dello stato e del ciclo di vita.
import React, { useState, useEffect, useCallback } from 'react';
// Importa useParams per accedere ai parametri della rotta URL (es. l'ID dell'annuncio) e Link per la navigazione.
import { useParams, Link } from 'react-router-dom';
// Importa la funzione API per ottenere la lista dei candidati per un annuncio specifico.
import { getCandidaturePerAnnuncio as getApplicantsForJob } from '../services/api/candidatureService.js';

// Definizione del componente funzionale ViewApplicantsPage.
// Questa pagina è destinata agli utenti 'azienda' per visualizzare i candidati a un loro annuncio.
const ViewApplicantsPage = () => {
  // Estrae l'ID dell'annuncio ('id') dai parametri della rotta URL e lo rinomina in 'jobId'.
  const { id: jobId } = useParams();
  // Stato per memorizzare i dettagli dell'annuncio di lavoro a cui si riferiscono i candidati.
  const [jobDetails, setJobDetails] = useState(null);
  // Stato per memorizzare l'array dei candidati (applicazioni) per l'annuncio.
  const [applicants, setApplicants] = useState([]);
  // Stato per indicare se i dati sono in fase di caricamento.
  const [isLoading, setIsLoading] = useState(true);
  // Stato per memorizzare eventuali messaggi di errore.
  const [error, setError] = useState('');

  // Funzione memoizzata (useCallback) per recuperare i candidati e i dettagli dell'annuncio.
  // Dipende da 'jobId', quindi verrà ricreata solo se 'jobId' cambia.
  const fetchApplicants = useCallback(async () => {
    setIsLoading(true); // Inizia il caricamento.
    setError('');       // Resetta errori precedenti.
    try {
      // Chiama la funzione API getApplicantsForJob passando l'ID dell'annuncio.
      const response = await getApplicantsForJob(jobId);
      // Imposta i dettagli dell'annuncio ricevuti dalla risposta.
      setJobDetails(response.data.annuncio);
      // Imposta la lista dei candidati (o un array vuoto se non ci sono candidature).
      setApplicants(response.data.candidature || []);
    } catch (err) {
      // Gestisce gli errori della chiamata API.
      console.error('Errore nel caricamento dei candidati:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Errore nel caricamento dei dati dei candidati.');
      // Se l'errore indica che l'annuncio stesso non è stato trovato (es. API restituisce 404
      // con un messaggio specifico), resetta i dettagli dell'annuncio e la lista dei candidati.
      if (err.response?.status === 404 && err.response?.data?.message.includes("Annuncio non trovato")) {
        setJobDetails(null);
        setApplicants([]);
      }
    }
    setIsLoading(false); // Termina il caricamento.
  }, [jobId]); // Dipendenza dall'ID dell'annuncio.

  // Hook useEffect per chiamare fetchApplicants al montaggio del componente e se fetchApplicants cambia.
  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  // Se i dati sono in caricamento, mostra uno spinner.
  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Caricamento candidati...</span>
        </div>
        <p>Caricamento candidati...</p>
      </div>
    );
  }

  // Se c'è un errore grave (es. annuncio non trovato o utente non autorizzato a vederlo)
  // e non ci sono dettagli dell'annuncio, mostra il messaggio di errore e un link per tornare indietro.
  // Questo previene il rendering del resto della pagina se l'annuncio principale non può essere caricato.
  if (error && !jobDetails) {
     return <div className="container mt-4 alert alert-danger">{error} <Link to="/dashboard-azienda/annunci">Torna ai miei annunci</Link></div>;
  }

  // Struttura JSX del componente.
  return (
    <div className="container mt-4">
      {/* Se i dettagli dell'annuncio sono stati caricati, li visualizza. */}
      {jobDetails && (
        <div className="mb-4 p-3 border rounded bg-light"> {/* Box con stile per i dettagli dell'annuncio */}
          <h3>Candidati per: {jobDetails.titolo}</h3> {/* Titolo dell'annuncio */}
          <p className="mb-1"><strong>Azienda:</strong> {jobDetails.azienda}</p>
          <p className="text-muted"><strong>Descrizione:</strong> {jobDetails.descrizione}</p>

        </div>
      )}
      {/* Se c'è un errore (ma i dettagli dell'annuncio potrebbero essere stati caricati parzialmente o l'errore riguarda solo i candidati),
          mostra un messaggio di warning. */}
      {error && !applicants.length && <div className="alert alert-warning">{error}</div>}

      {/* Titolo della sezione lista candidati, mostra il numero di candidati. */}
      <h4>Lista Candidati ({applicants.length})</h4>
      {/* Se non ci sono candidati e non ci sono errori, mostra un messaggio informativo. */}
      {applicants.length === 0 && !error && (
        <div className="alert alert-info">Nessun candidato per questo annuncio al momento.</div>
      )}
      {/* Se ci sono candidati, li visualizza in una lista. */}
      {applicants.length > 0 && (
        <div className="list-group"> {/* Componente list-group di Bootstrap per la lista. */}
          {/* Itera sull'array 'applicants' e renderizza un elemento per ogni candidato. */}
          {applicants.map((applicant) => (
            // Elemento della lista, usa classi Bootstrap per lo styling.
            <div key={applicant._id} className="list-group-item list-group-item-action flex-column align-items-start mb-2">
              <div className="d-flex w-100 justify-content-between"> {/* Layout flex per allineare email e data. */}
                {/* Email del candidato. Se 'applierId' fosse popolato con più dettagli, si potrebbe mostrare il nome. */}
                <h5 className="mb-1">Candidato: {applicant.applierId?.displayName || applicant.emailCandidato}</h5>
                {/* Data della candidatura, formattata. */}
                <small>Data: {new Date(applicant.dataCandidatura).toLocaleDateString()}</small>
              </div>
              {/* Numero di telefono del candidato se disponibile */}
              {/* Nome del candidato */}
                   <p className="mb-1"><strong>Nome:</strong>  </p>
                    <p className="mb-1">{applicant.nome}</p>
                      {/* Cognome del candidato */}
          <p className="mb-1"><strong>Cognome:</strong> </p>
          <p className="mb-1">{applicant.cognome}</p>
           {applicant.numeroTelefono && (
                <p className="mb-1"><strong>Telefono:</strong> {applicant.numeroTelefono}</p>
              )}
              <p className="mb-1"><strong>Descrizione/Messaggio:</strong></p>
              {/* Messaggio o descrizione inviata dal candidato. */}
              <p className="mb-1">{applicant.descrizioneCandidato}</p>
              {/* Commento: Qui si potrebbero aggiungere altri dettagli dell'applier se fossero popolati dal backend,
                  ad esempio, tramite populate('applierId', 'altriCampiUtili'). */}
            </div>
          ))}
        </div>
      )}
      {/* Pulsante per tornare alla lista degli annunci dell'azienda. */}
      <div className="mt-4">
        <Link to="/dashboard-azienda/annunci" className="btn btn-secondary">
          <i className="bi bi-arrow-left-circle me-2"></i>Torna ai Miei Annunci
        </Link>
      </div>
    </div>
  );
};

// Esporta il componente ViewApplicantsPage.
export default ViewApplicantsPage;
