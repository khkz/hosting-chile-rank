import React from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * Ruta duplicada de /catalogo. Emite canonical hacia /catalogo y noindex
 * para que el crawler consolide la señal mientras hace el redirect cliente.
 */
const DirectorioRedirect: React.FC = () => (
  <>
    <Helmet>
      <link rel="canonical" href="https://eligetuhosting.cl/catalogo" />
      <meta name="robots" content="noindex,follow" />
    </Helmet>
    <Navigate to="/catalogo" replace />
  </>
);

export default DirectorioRedirect;
