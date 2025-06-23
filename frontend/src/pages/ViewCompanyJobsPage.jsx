// src/pages/ViewCompanyJobsPage.jsx

// Importa React e gli hook useState (per lo stato), useEffect (per effetti collaterali), useCallback (per memoizzare funzioni).
import React, { useState, useEffect, useCallback } from 'react';
// Importa Link da react-router-dom per la navigazione.
import { Link } from 'react-router-dom';
// Importa le funzioni API per ottenere e eliminare gli annunci dell'azienda.
import { getCompanyJobs, rimuoviLavoroDaId as deleteJobById } from '../services/api/lavoroService.js';
// Importa useAuth per accedere eventualmente ai dati dell'utente; qui è commentato perché non strettamente necessario
// dato che le API sono già protette dal backend e restituiscono dati specifici dell'utente autenticato.
// import useAuth from '../hooks/useAuth';

// Definizione del componente funzionale ViewCompanyJobsPage.
// Questa pagina mostra all'utente 'azienda' la lista degli annunci di lavoro che ha pubblicato.
const ViewCompanyJobsPage = () => {
  // Stato per memorizzare la lista degli annunci dell'azienda.
  const [jobs, setJobs] = useState([]);
  // Stato per indicare se i dati sono in fase di caricamento.
  const [isLoading, setIsLoading] = useState(true);
  // Stato per memorizzare eventuali messaggi di errore.
  const [error, setError] = useState('');
  // const { user } = useAuth(); // Commentato: utile se si volessero mostrare info specifiche dell'azienda dal contesto.

  // Funzione memoizzata (useCallback) per recuperare gli annunci dell'azienda dal backend.
  // Viene chiamata al montaggio del componente e quando si vuole ricaricare la lista (es. dopo un'eliminazione).
  const fetchCompanyJobs = useCallback(async () => {
    setIsLoading(true); // Imposta lo stato di caricamento.
    setError('');       // Resetta eventuali errori precedenti.
    try {
      // Chiama la funzione getCompanyJobs del servizio API.
      const response = await getCompanyJobs();
      // Imposta lo stato 'jobs' con i dati ricevuti (o un array vuoto se response.data è null/undefined).
      // response.data dovrebbe contenere l'array degli annunci.
      setJobs(response.data || []);
    } catch (err) {
      // Gestisce gli errori della chiamata API.
      console.error('Errore nel caricamento degli annunci azienda:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Errore nel caricamento degli annunci.');
      // Se l'errore è un 404 (es. l'azienda non ha ancora pubblicato annunci),
      // si assicura che 'jobs' sia un array vuoto.
      if (err.response?.status === 404) {
        setJobs([]);
      }
    }
    setIsLoading(false); // Termina lo stato di caricamento.
  }, []); // Array di dipendenze vuoto: la funzione fetchCompanyJobs viene creata una sola volta.

  // Hook useEffect per chiamare fetchCompanyJobs al montaggio del componente.
  useEffect(() => {
    fetchCompanyJobs();
  }, [fetchCompanyJobs]); // Dipende da fetchCompanyJobs (che è memoizzata).

  // Funzione per gestire l'eliminazione di un annuncio.
  const handleDeleteJob = async (jobId) => {
    // Chiede conferma all'utente prima di procedere con l'eliminazione.
    if (window.confirm('Sei sicuro di voler eliminare questo annuncio?')) {
      try {
        // Chiama la funzione deleteJobById del servizio API.
        await deleteJobById(jobId);
        // Ricarica la lista degli annunci per riflettere l'eliminazione.
        fetchCompanyJobs();
      } catch (err) {
        // Gestisce eventuali errori durante l'eliminazione.
        console.error('Errore eliminazione annuncio:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Errore durante l_eliminazione dell_annuncio.');
      }
    }
  };

  // Se i dati sono in fase di caricamento, mostra uno spinner e un messaggio.
  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Caricamento annunci...</span>
        </div>
        <p>Caricamento annunci...</p>
      </div>
    );
  }

  // Struttura JSX del componente.
  return (
    <div className="container mt-4">
      <h2>I Miei Annunci Pubblicati</h2> {/* Titolo della pagina */}
      <hr /> {/* Separatore */}
      {/* Mostra un messaggio di errore se 'error' è presente. */}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Se non ci sono annunci e non ci sono errori, mostra un messaggio informativo
          con un link per creare un nuovo annuncio. */}
      {jobs.length === 0 && !error && (
        <div className="alert alert-info">Non hai ancora pubblicato nessun annuncio. <Link to="/crea-annuncio">Creane uno ora!</Link></div>
      )}
      {/* Se ci sono annunci, li visualizza in una griglia di card. */}
      {jobs.length > 0 && (
        // Utilizza classi Bootstrap per creare una griglia responsiva (1 colonna su mobile, 2 su schermi medi).
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {/* Itera sull'array 'jobs' e renderizza una card per ogni annuncio. */}
          {jobs.map((job) => (
            <div key={job._id} className="col"> {/* Chiave univoca per ogni elemento della lista. */}
              <div className="card h-100"> {/* Card Bootstrap con altezza 100% del contenitore col. */}
                <div className="card-body"> {/* Corpo della card. */}
                  <h5 className="card-title">{job.titolo}</h5> {/* Titolo dell'annuncio. */}
                  {/* Sottotitolo con nome azienda e località. */}
                  <h6 className="card-subtitle mb-2 text-muted">{job.azienda} - {job.località}</h6>
                  {/* Descrizione troncata dell'annuncio. */}
                  <p className="card-text text-truncate">{job.descrizione}</p>
                  {/* Data di pubblicazione formattata. */}
                  <p className="card-text">
                    <small className="text-muted">
                      Pubblicato il: {new Date(job.dataPubblicazione).toLocaleDateString()}
                    </small>
                  </p>
                </div>
                {/* Piè di pagina della card per i pulsanti di azione. */}
                <div className="card-footer bg-transparent border-top-0">
                  {/* Link per visualizzare i candidati per questo annuncio. */}
                  <Link to={`/annuncio/${job._id}/candidati`} className="btn btn-sm btn-outline-primary me-2">
                    <i className="bi bi-people-fill me-1"></i> Vedi Candidati
                  </Link>
                  {/* Commento: Link per una futura funzionalità di modifica annuncio.
                  <Link to={`/modifica-annuncio/${job._id}`} className="btn btn-sm btn-outline-secondary me-2">
                    <i className="bi bi-pencil-fill me-1"></i> Modifica (Non implementato)
                  </Link>
                  */}
                  {/* Pulsante per eliminare l'annuncio, chiama handleDeleteJob con l'ID dell'annuncio. */}
                  <button onClick={() => handleDeleteJob(job._id)} className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash-fill me-1"></i> Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Esporta il componente ViewCompanyJobsPage.
export default ViewCompanyJobsPage;
