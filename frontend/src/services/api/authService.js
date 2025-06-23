import apiClient from './apiClient';

// Funzione asincrona per il logout dell'utente.
export const logout = async () => {
  // Effettua una richiesta POST all'endpoint '/auth/logout' del backend.
  // Questa richiesta tipicamente invalida la sessione utente sul server.
  return apiClient.post('/auth/logout');
};

//googleLoginUrl non punta direttamente a Google, ma all’endpoint del tuo backend, ad esempio:
//http://localhost:5000/api/auth/google
/*Quando l’utente viene reindirizzato a questo URL:
Il tuo backend riceve la richiesta su /auth/google
Il backend poi gestisce il redirect verso Google (OAuth)
Dopo il login su Google, Google riporta l’utente al tuo backend, che poi lo riporta alla tua app */

// Funzione per reindirizzare l'utente al flusso di autenticazione Google OAuth.
// Questa funzione non è asincrona perché esegue un reindirizzamento del browser.
export const redirectToGoogleOAuth = () => {
  // Costruisce l'URL completo per l'endpoint di autenticazione Google sul backend.
  // Utilizza apiClient.defaults.baseURL per ottenere l'URL base dell'API, garantendo coerenza.
  const googleLoginUrl = `${apiClient.defaults.baseURL}/auth/google`;
  // Reindirizza il browser dell'utente a questo URL. Il backend poi gestirà il reindirizzamento a Google.
  window.location.href = googleLoginUrl; // window.location.href cambia l'URL corrente del browser, avviando il processo di login con Google.
  //Ricordiamoci che react quando cambia pagina non ricarica il browser, ma cambia l'URL in modo dinamico. In questo caso, però, vogliamo che il browser venga reindirizzato a un URL esterno (Google OAuth), quindi usiamo window.location.href per forzare il reindirizzamento completo della pagina, refreshando. 
  //Window è l’oggetto globale che rappresenta la finestra del browser.
  //location è un oggetto che contiene informazioni sull’URL corrente.
  //href è una proprietà di location che contiene l’URL completo come stringa. (window.location.href è una proprietà built-in javascript che ci permette di cambiare url del browser refreshando).
};

/*Frontend: clic su "Login con Google"
    ↓
Backend: /auth/google  →  passport.authenticate('google')  →  reindirizza a Google
    ↓
Google: utente accetta login.  Se accetta, Google crea un authorization code e reindirizza il browser verso l’endpoint di callback del backend, tipicamente /auth/google/callback passando il codice come parametro query: https://tuo-backend.com/auth/google/callback?code=authorization_code
    ↓
Google chiama: /auth/google/callback?code=...  (
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {)
    ↓
Backend: /google/callback  → passport scambia il code e autentica
    ↓
res.redirect al frontend
*/ 

// Funzione asincrona per ottenere i dati dell'utente attualmente autenticato.
// Utile per verificare lo stato della sessione all'avvio dell'app o dopo un reindirizzamento OAuth.
export const getUtenteCorrente = async () => {
  // Effettua una richiesta GET all'endpoint '/auth/me' del backend.
  // Questo endpoint dovrebbe restituire i dati dell'utente se la sessione è valida, o un errore (es. 401) altrimenti.
  return apiClient.get('/auth/me');
};

// Funzione asincrona per impostare il ruolo dell'utente.
export const setUserRole = async (role) => {
  // Effettua una richiesta POST all'endpoint '/auth/set-role' del backend.
  // Invia il ruolo scelto nel corpo della richiesta.
  return apiClient.post('/auth/set-role', { role });
};
