import React from 'react';
import { Link } from 'react-router-dom';
import { redirectToGoogleOAuth } from '../services/api/authService'
import GoogleLoginButton from '../components/auth/GoogleLoginButton'
//importare OAuth 
        
const HomePage = () => {
    const handleGoogleLogin = () => {
      //chiama funzione redirectToGoogleOAuth
        redirectToGoogleOAuth();
    };
    
    return (
    <div className="container mt-5 text-center">
      {/* Titolo principale della pagina. */}
      <img src="/logo2.svg" alt="Logo" style={{ width: '250px', height: 'auto' }} />
      <h1>Benvenuto nella Bacheca Annunci!</h1>
      <p className="lead">Trova il tuo prossimo lavoro o il candidato ideale.</p> 
      {/* Separatore orizzontale */}
      <hr/>
      <div className="mt-4">
        <p>Accedi per continuare:</p>
        <div className="mt-3">
          {/* GoogleLoginButton pippo={miaFunzione} */}
          <GoogleLoginButton onClick={handleGoogleLogin} />
        </div>
      </div>
    </div>);
};

export default HomePage;