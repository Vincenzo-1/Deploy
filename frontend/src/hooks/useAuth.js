//useContext è un hook che permette di accedere al contesto creato da AuthContext
import {useContext} from 'react'
 //**Importa** il contesto `AuthContext` che hai creato nel file `AuthContext.jsx`.  
 //Questo contesto contiene tutte le informazioni e funzioni di autenticazione (user, login, logout, ecc.).
import AuthContext from '../contexts/AuthContext';


//nuovo hook personalizzato chiamato useAuth (gli hook personalizzati iniziano sempre con use)
const useAuth = () => {
  const context = useContext(AuthContext); //ottengo {user, logout...} e lo metto dentro context che conterrà questi oggetti
//**Controllo di sicurezza:**  
// Se `context` è `undefined`, significa che stai usando `useAuth` **fuori** da un componente avvolto da `<AuthProvider>`.
// In questo caso, lancia un errore per avvisarti che stai usando male l’hook.
  if (context === undefined) {
    throw new Error("useAuth deve essere usato all'interno di un AuthProvider");
  }
  //**Restituisce** il valore del contesto.  
  //Così, quando usi `const { user, logout } = useAuth()`, ottieni direttamente i dati e le funzioni dal contesto.
  return context;
};

export default useAuth;

/*Senza questo hook personalizzato useAuth, ogni volta che un componente avesse bisogno di accedere allo stato di autenticazione o alle funzioni di login/logout, avresti dovuto:

Importare manualmente sia useContext che AuthContext in ogni componente.
Scrivere ogni volta la stessa riga di codice:
const context = useContext(AuthContext);
Gestire manualmente i controlli di sicurezza (ad esempio, verificare se il contesto è undefined).


Con l’hook useAuth
import useAuth from '../hooks/useAuth'
const { user, isAuthenticated, login, logout } = useAuth();
Un custom hook (hook personalizzato) in React è una funzione che inizia con "use" e che ti permette di riutilizzare logica con stato o effetti tra diversi componenti funzionali
*/ 

/**

Nel tuo App.jsx usi `<AuthProvider>` perché vuoi che **tutta l’app abbia accesso allo stato di autenticazione**.  
Nei singoli componenti, invece, userai l’hook `useAuth` (che internamente usa `AuthContext`) per accedere a quei dati.

**In sintesi:**  
- `<AuthProvider>` (la funzione lunga) serve per “fornire” il contesto. (fornire=mettere a disposizione (con il Provider))
- `AuthContext` (la funzione in una riga) serve per “consumare” il contesto e perciò viene usato in `useAuth` per accedere ai dati di autenticazione. ("Consumare = accedere/leggere (con useContext o un custom hook come useAuth)")
 */