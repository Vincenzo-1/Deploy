// src/pages/CreateJobPage.jsx

// Importa React e gli hook useState (per lo stato del form) e useEffect (per effetti collaterali come il precompilamento).
import React, { useState, useEffect } from 'react';
// Importa useNavigate da react-router-dom per reindirizzare l'utente dopo la creazione dell'annuncio.
import { useNavigate } from 'react-router-dom';
// Importa la funzione createJob dal servizio API per inviare i dati del nuovo annuncio al backend.
import { creaLavoro as createJob } from '../services/api/lavoroService.js';
// Importa l'hook useAuth per accedere ai dati dell'utente autenticato (es. per precompilare il nome azienda).
import useAuth from '../hooks/useAuth';

// Definizione del componente funzionale CreateJobPage.
// Questa pagina contiene un form per permettere agli utenti 'azienda' di creare nuovi annunci di lavoro.
const CreateJobPage = () => {
  // Stati per i campi del form: titolo, azienda, descrizione, località.
  const [titolo, setTitolo] = useState('');
  const [azienda, setAzienda] = useState(''); // Questo campo potrebbe essere precompilato.
  const [descrizione, setDescrizione] = useState('');
  const [localita, setLocalita] = useState(''); // 'localita' minuscolo per coerenza con lo stato, ma backend usa 'località'.
  // Stato per messaggi di errore specifici del form.
  const [error, setError] = useState('');
  // Stato per indicare se il form è in fase di sottomissione (per feedback visivo e disabilitazione).
  const [isLoading, setIsLoading] = useState(false);

  // Hook per la navigazione programmatica.
  const navigate = useNavigate();
  // Estrae l'oggetto 'user' dal contesto di autenticazione.
  const { user } = useAuth();

  // Hook useEffect per precompilare il campo 'azienda' con il displayName dell'utente
  // se l'utente è loggato e ha un displayName.
  // Si esegue al montaggio del componente e ogni volta che l'oggetto 'user' cambia.
  useEffect(() => {
    if (user && user.displayName) {
      setAzienda(user.displayName);
    }
  }, [user]); // Array di dipendenze: l'effetto si riesegue solo se 'user' cambia.

  // Gestore per la sottomissione del form.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form.
    setError('');       // Resetta eventuali errori precedenti.
    setIsLoading(true); // Attiva lo stato di caricamento.

    // Prepara l'oggetto jobData con i dati del form da inviare al backend.
    // Assicura che la chiave 'località' corrisponda a quella attesa dal backend.
    const jobData = { titolo, azienda, descrizione, località: localita };

    try {
      // Chiama la funzione createJob del servizio API.
      const response = await createJob(jobData);
      // Log della risposta (utile per debug). L'annuncio è stato creato con successo.
      console.log('Annuncio creato:', response.data);
      // Reindirizza l'utente alla dashboard dell'azienda dopo la creazione.
      // In alternativa, potrebbe reindirizzare alla pagina del nuovo annuncio.
      navigate('/dashboard-azienda');
    } catch (err) {
      // Se si verifica un errore durante la creazione.
      console.error('Dettagli errore creazione annuncio:', err.response?.data ? JSON.stringify(err.response.data) : err.message);
      // Imposta un messaggio di errore da visualizzare all'utente.
      // Prova a prendere il messaggio di errore più specifico da Mongoose se disponibile
      setError(err.response?.data?.error || err.response?.data?.message || 'Errore durante la creazione dell_annuncio. Riprova.');
    }
    setIsLoading(false); // Disattiva lo stato di caricamento.
  };

  // Struttura JSX del componente.
  return (
    // Contenitore principale della pagina.
    <div className="container mt-4">
      <h2>Crea Nuovo Annuncio di Lavoro</h2> {/* Titolo della pagina */}
      <hr /> {/* Separatore */}
      {/* Visualizza un alert di errore se 'error' è presente. */}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Form per la creazione dell'annuncio. */}
      <form onSubmit={handleSubmit}>
        {/* Campo Titolo Annuncio */}
        <div className="mb-3">
          <label htmlFor="titolo" className="form-label">Titolo Annuncio</label>
          <input
            type="text"
            className="form-control"
            id="titolo"
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required // Campo obbligatorio.
            disabled={isLoading} // Disabilitato durante la sottomissione.
          />
        </div>

        {/* Campo Nome Azienda */}
        <div className="mb-3">
          <label htmlFor="azienda" className="form-label">Nome Azienda</label>
          <input
            type="text"
            className="form-control"
            id="azienda"
            value={azienda} // Precompilato da useEffect, ma modificabile.
            onChange={(e) => setAzienda(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Campo Descrizione del Lavoro (textarea) */}
        <div className="mb-3">
          <label htmlFor="descrizione" className="form-label">Descrizione del Lavoro</label>
          <textarea
            className="form-control"
            id="descrizione"
            rows="5" // Altezza del campo.
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
            disabled={isLoading}
          ></textarea>
        </div>

        {/* Campo Località */}
        <div className="mb-3">
          <label htmlFor="localita" className="form-label">Località</label>
          <input
            type="text"
            className="form-control"
            id="localita"
            value={localita}
            onChange={(e) => setLocalita(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Pulsante di submit del form. */}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {/* Testo condizionale del pulsante: mostra uno spinner e "Creazione..." durante il caricamento. */}
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Creazione...
            </>
          ) : 'Pubblica Annuncio'}
        </button>
      </form>
    </div>
  );
};

// Esporta il componente CreateJobPage.
export default CreateJobPage;
