import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { NotFound } from "./NotFound.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";

/* ==========================================================================
   PAGINA DE ERROR
   --------------------------------------------------------------------------
   Es el "errorElement" de routes.jsx: React Router la pinta cuando una
   pagina falla al renderizarse. En lugar de dejar la pantalla en blanco,
   explica lo que ha pasado y ofrece salidas.

   Se usa en dos sitios:
     - Dentro del Layout: si falla una pagina, el navbar y el footer se
       mantienen y el error ocupa solo el hueco del contenido.
     - En la raiz, con standalone: si el que falla es el propio Layout, no
       se puede contar con el, asi que se pinta sola.
   ========================================================================== */
export const ErrorPage = ({ standalone = false }) => {
	const error = useRouteError();

	// Una ruta que no existe tambien llega aqui como error 404
	const isNotFound = isRouteErrorResponse(error) && error.status === 404;

	// El titulo se decide aqui y no en NotFound: el efecto del padre se ejecuta
	// despues que el del hijo y pisaria el suyo
	usePageTitle(isNotFound ? "Página no encontrada" : "Algo ha fallado");

	if (isNotFound) return <NotFound />;

	// El detalle tecnico solo se muestra en la consola, para quien desarrolla
	console.error(error);

	return (
		<main className={`container ${standalone ? "py-5" : "my-5"}`}>
			<StatusMessage
				kanji="故障"
				title="Algo ha fallado"
				role="alert"
				actions={
					<>
						{/* Recarga completa: si el fallo fue puntual, vuelve a intentarlo todo */}
						<button type="button" className="z-btn z-btn--red" onClick={() => window.location.reload()}>
							<i className="fa-solid fa-rotate-right" aria-hidden="true"></i>
							Recargar la página
						</button>
						{/* En la version sola se usa <a>: el Layout que falla no debe volver a montarse sin recargar */}
						{standalone ? (
							<a href="/" className="z-btn">Volver al inicio</a>
						) : (
							<Link to="/" className="z-btn">Volver al inicio</Link>
						)}
					</>
				}
			>
				Esta página no se ha podido mostrar. Prueba a recargarla o vuelve al inicio.
			</StatusMessage>
		</main>
	);
};
