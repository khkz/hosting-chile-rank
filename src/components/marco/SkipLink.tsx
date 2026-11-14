import React from 'react';

/** Id del destino del enlace de salto. Lo pone Navbar (justo después de la cabecera) o el <main> de las páginas sin Navbar. */
export const CONTENT_ID = 'contenido';

/**
 * «Saltar al contenido»: primera parada de Tab en todo el sitio. Invisible
 * hasta recibir el foco. Lleva el foco al destino #contenido (o al <main> si
 * una página no lo tiene) sin cambiar la URL.
 */
const SkipLink: React.FC = () => {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(CONTENT_ID) ?? document.querySelector<HTMLElement>('main');
    if (!target) return;
    e.preventDefault();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
  };

  return (
    <a
      href={`#${CONTENT_ID}`}
      onClick={onClick}
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-lg focus:border focus:border-rule focus:bg-white focus:px-4 focus:text-[15px] focus:font-semibold focus:text-ink focus:shadow-overlay"
    >
      Saltar al contenido
    </a>
  );
};

export default SkipLink;
