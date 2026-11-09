import { useEffect } from "react";

/* ==========================================================================
   TITULO DE LA PESTANA
   --------------------------------------------------------------------------
   Pone el <title> del documento segun la pagina, por ejemplo
   "Goku · Dragon Ball Z". Ayuda a distinguir las pestanas abiertas, y es lo
   primero que anuncia un lector de pantalla al llegar a una pagina.

   Sin titulo (null o vacio) se queda solo el nombre del sitio.
   ========================================================================== */
const SITE_NAME = "Dragon Ball Z";

/**
 * @param {string|null} title Titulo de la pagina, sin el nombre del sitio
 */
export const usePageTitle = (title) => {
	useEffect(() => {
		document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
	}, [title]);
};
