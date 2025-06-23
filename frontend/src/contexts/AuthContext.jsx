import React, { use } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { getUtenteCorrente, logout as apiLogout } from '../services/api/authService';




//SERVE PER CONDIVIDERE LO STATO DI AUTENTICAZIONE(utnete e logout) perchè in realtà
//creatcontext permette di condividere dati tra componenti senza doverli passare manualmente
//Se un componente (ad esempio una Navbar, una Dashboard, una pagina di login) ha bisogno di sapere se l’utente è autenticato, o di accedere ai dati dell’utente, o di eseguire il logout, può usare il contesto.
//via props 
//SINTASSI>> const MyContext = createContext(value)
/*Perché il valore iniziale è null?
 Perché non conosciamo ancora lo stato auth iniziale
All'inizio, quando il context viene definito, non c'è ancora un utente loggato, né sappiamo se c'è una sessione attiva: React non ha ancora fatto il render dell'app.
Quindi si imposta null come valore di default fino a che il Provider (AuthProvider) non fornisce un vero valore. */
const AuthContext = createContext(null);
/*Questo oggetto (AuthContext) contiene due cose principali:
AuthContext.Provider – componente React che fornisce (distribuisce) il valore del contesto ai componenti figli. 
[Un Provider è un componente React che fornisce un valore a un context, permettendo ai componenti figli di leggerlo (in questo caso sarà value={{ user, login }}
Questo è ciò che "inietti" nel contesto)]
AuthContext.Consumer – (opzionale) componente per leggere il valore dal contesto. Di solito oggi si usa useContext invece di questo. */

//Il valore iniziale di AuthContext è null solo al momento della creazione del contesto:
//Ma appena il componente <AuthProvider> viene usato (ad esempio nel tuo App.jsx), il valore reale del contesto viene fornito tramite il prop value del provider:
/*<AuthContext.Provider value={{ isAuthenticated, user, logout, isLoading, refreshAuthStatus }}>
  {children}
</AuthContext.Provider>*/


export const AuthProvider = ({ children }) => { //funizione React a cui vengono passati i children, cioè i componenti che ha al suo interno.(tutto cio che è dichiarato all'interno del suo oggeetto value: user, isAuthenticated, isLoading, logout, refreshAuthStatus) sarà accessibile a tutti i componenti figli che usano questo context.
    
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated]= useState(false); // Corretto typo: setIsAutenthicated -> setIsAuthenticated
    const [isLoading, setIsLoading] = useState(true);

    //- **Cosa fa:** Definisce una funzione asincrona chiamata `checkAuthStatus` che serve a controllare se l’utente è autenticato.
    
    //- **Perché è importante:** Questa funzione viene chiamata all'avvio dell'applicazione per verificare se l'utente ha già effettuato il login in precedenza (ad esempio, se ha un cookie di sessione valido).

    //useCallback è una hook di React che serve per memorizzare una funzione tra i vari render di un componente. 
    // Il suo scopo principale è evitare che una funzione venga ricreata ad ogni nuovo render, a meno che non cambino le dipendenze specificate.
    
   


/*data è semplicemente la proprietà che contiene il corpo della risposta HTTP quando usi una libreria come Axios nel frontend.
const response = await axios.get('/api/auth/me');
console.log(response);
// Output:
{
  data: { utente: { ... } }, // <-- QUI c'è il JSON che hai mandato dal backend
  //prendo data.utente per capire se c'è l'utente
  status: 200,
  statusText: 'OK',
  headers: { ... },
  config: { ... },
  request: { ... }
} 
  DIFFERENZE
response è l’oggetto completo della risposta HTTP.
response.data è il corpo della risposta, cioè il JSON che hai mandato con res.json(...) dal backend.
response.data.utente è l’oggetto utente che hai inserito nel JSON.
poi va data.utente perche lo prende da authroutes del backend quando faccio il get('/me) e credo res.json ... utente*/

    const checkAuthStatus = useCallback (async () => {
        setIsLoading(true); //In realtà si può anche non omettere, serve solo per dire che l'app sta iniziando a controllare lo stato di autenticazione 
                            //e per rendere l'app più user friendly per gestire 'meglio' il caricamento (per dire che il controllo è in corso)
        try{
            //Cosa fa: Chiama una funzione (`getCurrentUser`) che fa una richiesta HTTP al backend (server) per chiedere: “Chi è l’utente attualmente loggato?”.
            //Collegamento frontend-backend:**  
            //Il frontend chiama `/api/auth/me` (tramite `getCurrentUser`).
            //Il backend risponde con i dati dell’utente se la sessione è valida, oppure con un errore se non c’è nessun utente autenticato.
            const response = await getUtenteCorrente();
            //Se l'utente ha fatto login con Google, Passport salva i dati dell'utente (recuperati da Google) nella sessione.
            //Quando chiami /api/auth/me, il backend legge la sessione e restituisce i dati dell'utente autenticato (che sono quelli ottenuti da Google al momento del login).     
            //Rappresenta i dati dell’utente autenticato che il backend restituisce al frontend dopo una chiamata API (tramite la funzione getCurrentUser)
            //Se il backend risponde con i dati dell'utente
            if (response.data.utente){
                 // rappresenta i dati dell’utente autenticato che il backend restituisce al frontend dopo una chiamata API (tramite la funzione getCurrentUser
                setUser(response.data.utente); //Se la risposta contiene i dati dell'utente, li imposta nello stato `user`. (è un cambio di stato che avviene soltanto a livello del frontend, perchè ricordiamoci che siamo in un componete che wrappera tutto il resto dell'applicazione, quindi tutti i componenti figli avranno accesso a questo stato)
                setIsAuthenticated(true); //Imposta lo stato di autenticazione a true, indicando che l'utente è autenticato.

            } else {
                setUser(null); //Se non ci sono dati dell'utente, imposta `user` a null. Resetta utente
                setIsAuthenticated(false); //Imposta lo stato di autenticazione a false, indicando che l'utente non è autenticato.
            }
        }catch (error) {
                console.error('Nessun utente autenticato o errore:', error.response?.data?.message || error.message);
/*Questa è optional chaining, cioè una sintassi moderna di JavaScript che evita errori se un oggetto è undefined o null.
error.response: esiste una risposta dal server? (axios salva la risposta qui)
?.data: se response esiste, accedi a data (il corpo della risposta)
?.message: se data esiste, accedi al messaggio di errore
⚠️ Se uno qualsiasi di questi livelli non esiste, il tutto restituisce undefined, senza lanciare un errore.*/

                setUser(null); //Se c'è un errore (ad esempio, se l'utente non è autenticato), imposta `user` a null.
                setIsAuthenticated(false); //Imposta lo stato di autenticazione a false, indicando che l'utente non è autenticato.
            }
            setIsLoading(false); //Dice all’app che il controllo è finito
        },[]); //Questo approccio è utile per evitare che la funzione venga ricreata inutilmente a ogni render, migliorando così le performance e la prevedibilità del comportamento del componente. [] serve per farlo invocare solo all'avvio 
        //è la stessa sinstassi di UseEffect, ma non viene eseguita automaticamente all'avvio del componente, ma solo quando viene chiamata esplicitamente.


//Al primo render di AuthProvider, viene chiamata checkAuthStatus() per verificare se l’utente è autenticato.
//Se per qualche motivo la funzione checkAuthStatus cambiasse (cosa rara, visto che usi useCallback senza dipendenze), il useEffect la richiamerebbe.
//Con useEffect, la funzione viene chiamata automaticamente all’avvio del componente.
//Senza useEffect, non viene mai chiamata da sola.
useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]); //Esegui la funzione checkAuthStatus() ogni volta che checkAuthStatus cambia.

//per disconettere l'utente
const logout = async () =>{
    //Cosa fa:**  
    //Chiama la funzione `apiLogout()`, che manda una richiesta HTTP al backend per dire: “Voglio fare il logout”.
    //Collegamento frontend-backend:**  
    //Il frontend chiama `/api/auth/logout` (tramite `apiLogout`).
    //Il backend cancella la sessione/cookie dell’utente, quindi l’utente non è più autenticato.
    try{
        await apiLogout();
        //*Cosa fa:**  
        //Dopo che il backend ha confermato il logout, il frontend azzera lo stato dell’utente (`setUser(null)`) e segna che non è più autenticato (`setIsAuthenticated(false)`).
        //Questo aggiorna subito l’interfaccia utente (ad esempio, nasconde le pagine riservate).
        setUser(null);
        setIsAuthenticated(false);
    } catch (error){
        console.error('Logout fallito:' , error.message?.data?.message || error.message);
        //- **Cosa fa:**  
        //Se la richiesta al backend fallisce (es. problemi di rete), stampa l’errore in console.
        //Anche se il backend non risponde, il frontend azzera comunque lo stato utente e autenticazione, così l’interfaccia si aggiorna e l’utente viene considerato disconnesso.
        setUser(null);
        setIsAuthenticated(false);

    }
    
};

/*Perché non puoi farne a meno solo OAuth:

Non puoi salvare i dati utente nel frontend subito dopo il login, perché il login avviene fuori dal tuo sito

Solo il backend sa se sei autenticato → quindi devi chiederglielo → con refreshAuthStatus
✅ Cosa fa internamente refreshAuthStatus?
Chiama un endpoint come:

GET /api/auth/me
E il backend (grazie al cookie/token salvato durante l’OAuth login) risponde con:

json

{
  "id": 123,
  "name": "Mario",
  "email": "mario@gmail.com"
}
→ Questi dati vengono salvati in AuthContext.*/ 
//Dopo che l’utente ha fatto login con Google e viene reindirizzato sul frontend, puoi chiamare refreshAuthStatus() per aggiornare subito lo stato di login.
 const refreshAuthStatus = useCallback(async ()=>{
    await checkAuthStatus();
}, [checkAuthStatus]);                           /*Definisce una funzione asincrona chiamata refreshAuthStatus.
Usa la hook useCallback per memorizzare la funzione e non ricrearla a ogni render, a meno che non cambi la dipendenza (checkAuthStatus).
Quando viene chiamata, esegue semplicemente la funzione checkAuthStatus, che si occupa di verificare lo stato di autenticazione dell’utente.*/
//useCallback è una hook di React che serve a “memoizzare” (cioè, a non ricreare inutilmente) una funzione tra i vari render del componente, a meno che non cambino le sue dipendenze.
//questo può essere fatto anche con useEffect e mettere nella funzione [dato da aggiornare] ma in questo caso ci conviene usare Callback per evitare di ricreare la funzione ogni volta che il componente si aggiorna, migliorando le performance ed è una buona pratica quando siamo stiamo creando dei Context per evitare di ricreare funzioni inutilmente. 
/*In sintesi:

Se la funzione viene usata solo localmente, una funzione normale va benissimo.
Se la funzione viene passata come prop, usata in un context, o come dipendenza di altri hook, useCallback è preferibile per evitare problemi di performance e comportamenti inattesi.*/
//dipende da checkAuthStatus
 return( //return della funzione AuthProvider
    //Il value è un oggetto che contiene tutti i dati e le funzioni che vuoi rendere disponibili a TUTTI i componenti figli che useranno questo contesto.
    //VALUE è il “pacchetto” di dati e funzioni che vuoi condividere con tutti i componenti che usano il contesto di autenticazione.
    //Tutti i componenti figli di AuthProvider possono accedere a questi valori usando useContext(AuthContext).
    //Così puoi, ad esempio, mostrare il nome dell’utente nella navbar, fare logout da un bottone, mostrare uno spinner se isLoading è true, ecc.//
    //Dati di value sono dati dello state e questo è il provider che darà a tutti gli altri componenti quest'ultimi dati
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout, refreshAuthStatus }}>  {/*L’importante è che il nome del Provider corrisponda al context che hai creato.
Quindi puoi chiamarlo pippo, userContext, bananaContext… quello che preferisci, purché sia coerente nel codice (riga 17)
Il suffisso .Provider è generato automaticamente da React quando crei un context.*/}
        {children}
    </AuthContext.Provider>
 );
};
//Navbar e Dashboard sono children del provider e avranno accesso ai dati e alle funzioni del contesto user e logout, trami
//Nel tuo App.jsx potresti avere:
/*<AuthProvider>
  <Navbar />
  <Dashboard />
</AuthProvider> */
//Sia Navbar che Dashboard (e tutti i loro figli) potranno usare:
//const { user, logout, isAuthenticated } = useContext(AuthContext);


/**FLUSSO CHECKSTATUS:
 * Come funziona il flusso?
1)Memoizzazione:
refreshAuthStatus viene creata una sola volta (o ogni volta che cambia checkAuthStatus) grazie a useCallback. Questo evita che la funzione venga ricreata inutilmente a ogni render del componente.

2)Cosa fa quando viene chiamata:
Quando un componente figlio chiama refreshAuthStatus(), questa funzione:

Esegue checkAuthStatus(), che:
Mette lo stato isLoading a true (per mostrare eventuali spinner di caricamento).
Chiama l’API getCurrentUser() per chiedere al backend se c’è un utente autenticato.
Se la risposta contiene un utente, aggiorna lo stato React con i dati dell’utente (setUser) e imposta isAuthenticated a true.
Se non c’è utente (o c’è un errore), azzera lo stato utente e imposta isAuthenticated a false.
Alla fine, rimette isLoading a false.
3)Perché è utile?

Serve per forzare una nuova verifica dello stato di autenticazione in qualsiasi momento, ad esempio:
Dopo un login OAuth (quando torni dal provider esterno e vuoi aggiornare lo stato locale).
Dopo un’azione che potrebbe cambiare lo stato utente (logout, cambio password, ecc.).
Qualsiasi componente figlio che usa il context può chiamare refreshAuthStatus() per aggiornare lo stato di autenticazione senza duplicare la logica.
 */


//authContext inizialmente è nullo, poi per riempirlo facciamo AuthContext.Provider dicendo "ehi riempimi authContext e fallo diventare provider dei children component, e inoltre  rendili disponibili a tutti i componenti figli (children) che stanno dentro di me"
//Però il componente sarà authProvider perchè eguagliamo tutto ad export const AuthProvider (E al suo interno usa <AuthContext.Provider> per “distribuire” questi dati ai figli.)
export default AuthContext;