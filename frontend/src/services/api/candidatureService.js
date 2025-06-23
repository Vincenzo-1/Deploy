import apiClient from "./apiClient";

//Creo una funzione in modo tale da ottenere con una get i candidati
//che si sono iscritti a quell'annuncio di lavoro. In questa funzione 
//passo come prop lavoroId in modo tale una volta che inserisco sull'URL
//quell'id lavoro, mi apparirà gli annunci di lavoro.
export const getCandidaturePerAnnuncio = async (postAnnunciId) => {
    return apiClient.get(`/candidature/annuncio/${postAnnunciId}`); 
};

//Template literal mi permette di inserire variabili direttamente nella stringa
//lavoroId è diverso dal backend :postAnnunciId 
//Quando chiamo apiClient.get() , uso questa 
//configurazione per fare richiesta HTTP in modo tale 
//da non riscrivere sogni volta URL e headers
//Inoltre, se in futuro vuoi aggiungere autenticazione, intercettori o altre impostazioni, ti basta modificarle in un solo posto (apiClient.js) e tutte le chiamate API le useranno automaticamente.

export const getCandidatureFatte = async (email) =>{
    return apiClient.get(`/candidature/lavoratore/${email}`);
};
//RIVEDERE QUESTO SOPRA NEL CASO
//La funzione si collega al backend inviando una richiesta
//GET all'endpoint /candidature/lavoratore/email.
//La parte ${email} nel template literal inserisce il valore dell’email direttamente nell’URL.


// Prende 'candidature' come argomento, un oggetto che contiene i dati della candidatura.
// candidature DEVE contenere almeno:
  // - postAnnunciId: l'ID dell'annuncio per cui ci si candida.
  // - descrizioneCandidato: il messaggio o la descrizione fornita dal candidato.
  // L'ID e l'email dell'utente 'applier' dovrebbero essere gestiti automaticamente dal backend
  // tramite l'utente autenticato (req.user) grazie al middleware 'ensureAuthenticated'.
  // Effettua una richiesta POST all'endpoint '/candidature' del backend.
export const creazioneCandidature = async (candidature) => {
    return apiClient.post("/candidature" , candidature);
};

// candidature serve sempre per collegare le robe del frontend(schema)
// e far in modo che quando si posta una cosa, si faccia un createApplication
// in una page e passi i dati postAnnunciId, descrizioneCandidato...
// In conclusione si mette candidature per passare i dati elencati dal commento
// di sopra. Se non avessi messo candidature( potevo chiamarlo in un altro nome qualsiasi)
// non ci sarebbe niente da passare.
