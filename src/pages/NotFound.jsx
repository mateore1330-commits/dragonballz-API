import { Link } from "react-router";
import { StatusMessage } from "../components/StatusMessage.jsx";

/* ==========================================================================
   PAGINA 404
   --------------------------------------------------------------------------
   Se muestra cuando la URL no coincide con ninguna ruta (ruta "*" en
   routes.jsx). Vive dentro del Layout, asi que conserva el navbar y el
   footer y el buscador sigue a mano para encontrar lo que se buscaba.
   ========================================================================== */
export const NotFound = () => (
	<main className="container my-5">
		<StatusMessage
			kanji="迷子"
			title="Página no encontrada"
			actions={
				<Link to="/" className="z-btn z-btn--red">
					<i className="fa-solid fa-house" aria-hidden="true"></i>
					Volver al inicio
				</Link>
			}
		>
			Esta dirección no existe. Puede que el enlace esté mal escrito o que la página ya no esté.
		</StatusMessage>
	</main>
);
