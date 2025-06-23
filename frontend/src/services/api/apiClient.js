import axios from "axios";

//AXIOS UTILIZZA MIME Type 
//La libreria Axios ti serve per fare richieste HTTP (GET, POST, PUT, DELETE, ecc.) 
// dal frontend (JavaScript/React) verso il backend (API).
//Devi mettere baseURL per evitare di riscrivere ogni volta l’indirizzo completo dell’API in tutte le richieste.

//Esempio senza baseURL:
//axios.get('http://localhost:5000/api/annunci')
//axios.post('http://localhost:5000/api/candidature')

//Esempio con baseURL:
//apiClient.get('/annunci')
//apiClient.post('/candidature')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Aggiunto per inviare i cookie con le richieste cross-origin
    //application indica
    //che è un tipo di dato generico usato da applicazioni 
    //(non testo, non immagini,...). /json indica il formato dei dati
    //standard MIME /json . La / per separare tipo e sottotipo
});


/*Sessioni (cookie-based):
Quando fai il login (es. con Google OAuth):

Il backend salva i tuoi dati (es. user.id) in una sessione lato server.

Genera un cookie (es. connect.sid) che viene mandato al browser.

Questo cookie viene salvato automaticamente nel browser.

A ogni richiesta successiva, il browser invia quel cookie → il server lo usa per "riconoscere" l’utente.

👉 Non devi gestire token né headers Authorization lato frontend.

🪪 JWT (token-based):
Il backend genera un token firmato (es. eyJhbGciOi...) e lo manda al client.

Il frontend salva il token (es. in localStorage o sessionStorage).

A ogni richiesta protetta, devi aggiungere Authorization: Bearer <token> manualmente.

Il backend non tiene traccia delle sessioni: verifica ogni richiesta solo decodificando il token.

 */
export default apiClient;