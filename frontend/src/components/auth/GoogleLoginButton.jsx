import React from 'react';
 
//[passare dati con props di edoardo]
//stiamo dicendo "in GoogleLoginButton ti passo un oggetto che contiene onClick
//e automaticamente scomponi in variabili (quindi non serve dichiararli)
//Le parentesi graffe servono per estrarre solo la prop che ti interessa dall’oggetto delle props.
//i props sono tutti oggetti, se no fare props.onclick oppure solo (props) e passo tanti props
const GoogleLoginButton = ({ onClick }) => { //onClick È il nome dell’attributo HTML. {onClick}  significa “prendi il valore della variabile/funzione onClick e usalo qui
return (
    // Elemento <button> HTML.
    // - onClick={onClick}: Associa la funzione passata come prop all'evento onClick del pulsante.
    // - className="btn btn-danger": Applica classi Bootstrap per stilizzare il pulsante
    //   (aspetto di un pulsante generico, colore rosso tipico per Google).
    <button onClick={onClick} className="btn btn-danger">
      {/* Elemento <i> per l'icona di Google, utilizzando le classi di Bootstrap Icons.
          - "bi bi-google": Classe per l'icona di Google.
          - "me-2": Margine destro (margin-end) di 2 unità Bootstrap per spaziare l'icona dal testo. */}
      <i className="bi bi-google me-2"></i>
      Accedi con Google 
    </button>
  );
}

//{onClick} posso chiamarlo anche pippo però in HomePage dovrò fare GoogleLoginButton pippo=...
//pippo poi avrà gli stessi comportamenti di onClick onClick={pippo}
//pippo non è tutta la funzione ma è solo un prop, quando invoco GoogleLoginButton avrò il testo accedi con google 

export default GoogleLoginButton;

//Se invece definisci una funzione interna come handleClick (senza usare la prop), il bottone avrà sempre lo stesso comportamento e non potrai cambiarlo dall’esterno
//perchè con handleClick dentro definisce dove andare e cosa fare
//Qui posso usare il pulsante per andare appunto dove voglio ,decidendo poi dopo nelle page