import apiClient from './apiClient';
export const creaLavoro = async (datiLavoro) => {
    return apiClient.post('/postAnnunci', datiLavoro);
}

export const getTuttiLavori = async () =>{   // a dispetto del creaLavoro, dove passa i datiLavoro da pubblicare, in get logicamente non passa niente perchè bisogna soltanto ottenere i dati.
    return apiClient.get('/postAnnunci')
};

export const getLavoroDaId = async (id) =>{
    return apiClient.get(`/postAnnunci/${id}`); // ricordarsi template litterals cioè `` e non ''

};

export const rimuoviLavoroDaId = async (id) =>{
return apiClient.delete(`/postAnnunci/${id}`);
};

export const getCompanyJobs = async () => {
  // Effettua una richiesta GET all'endpoint '/postAnnunci/miei-annunci' del backend.
  // Questo endpoint è protetto e restituirà solo gli annunci creati dall'utente (azienda) autenticato.
  return apiClient.get('/postAnnunci/miei-annunci');
};
