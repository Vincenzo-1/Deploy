// src/App.jsx

// Importa la libreria React, necessaria per definire componenti React.
import React from 'react';
// Importa il componente AppRoutes, che gestisce la definizione e il rendering delle rotte dell'applicazione.
import AppRoutes from './routes/AppRoutes';
// Importa AuthProvider dal contesto di autenticazione. Questo provider avvolgerà l'applicazione
// per rendere disponibili lo stato di autenticazione e le funzioni correlate ai componenti figli.
import { AuthProvider } from './contexts/AuthContext';
// Importa il componente Navbar, che visualizza la barra di navigazione principale dell'applicazione.
import Navbar from './components/navigation/Navbar';
// Importa il file CSS di Bootstrap per utilizzare gli stili predefiniti di Bootstrap.
import 'bootstrap/dist/css/bootstrap.min.css';
// Importa il file CSS globale dell'applicazione (App.css) per stili personalizzati.
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <<< NECESSARIO per i dropdown
import './App.css';

// Definizione del componente principale dell'applicazione, chiamato App.
// È una funzione componente React.
function App() {
  // Il metodo render del componente App. Restituisce la struttura JSX dell'applicazione.
  return (
    // AuthProvider avvolge l'intera applicazione. Tutti i componenti discendenti
    // avranno accesso al contesto di autenticazione (es. stato utente, funzioni di login/logout).
    <AuthProvider>
      {/* Includi il componente Navbar all'inizio della pagina, sopra il contenuto delle rotte.
          Sarà visibile in tutte le pagine gestite da AppRoutes. */}
      <Navbar />
      {/* Contenitore principale dell'applicazione con classe "App" per stili generali
          e "container" di Bootstrap per un padding laterale e un layout reattivo. */}
      <div className="App container">
        {/* Renderizza il componente AppRoutes, che a sua volta mostrerà il componente
            corrispondente alla rotta URL corrente. */}
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

// Esporta il componente App come default, rendendolo disponibile per essere importato
// e utilizzato come componente radice dell'applicazione (tipicamente in main.jsx).
export default App;
