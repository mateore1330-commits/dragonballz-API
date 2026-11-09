import { Link } from "react-router";
import { StatusMessage } from "./StatusMessage.jsx";

/* ==========================================================================
   ESTADO DE UNA FICHA MIENTRAS NO HAY DATOS
   --------------------------------------------------------------------------
   Lo que pintan las paginas de detalle cuando useApiResource no devuelve
   "ready": cargando, no encontrado o error. Asi las dos fichas (personaje
   y planeta) muestran exactamente lo mismo.

   Props:
     - status        : "loading", "notFound" o "error" (de useApiResource)
     - retry         : funcion para reintentar (de useApiResource)
     - notFoundTitle : titular de "no encontrado", p. ej. "Personaje no encontrado"
   ========================================================================== */
export const ResourceStatus = ({ status, retry, notFoundTitle }) => {
	const backHome = (
		<Link to="/" className="z-btn">
			<i className="fa-solid fa-house" aria-hidden="true"></i>
			Volver al inicio
		</Link>
	);

	let content;
	if (status === "notFound") {
		content = (
			<StatusMessage kanji="迷子" title={notFoundTitle} actions={backHome}>
				No hay nada con esta dirección. Puede que el enlace esté mal escrito.
			</StatusMessage>
		);
	} else if (status === "error") {
		content = (
			<StatusMessage
				kanji="故障"
				title="No se ha podido cargar"
				role="alert"
				actions={
					<>
						<button type="button" className="z-btn z-btn--red" onClick={retry}>
							<i className="fa-solid fa-rotate-right" aria-hidden="true"></i>
							Reintentar
						</button>
						{backHome}
					</>
				}
			>
				Revisa tu conexión a internet. Si sigue fallando, puede que la Dragon Ball API no esté disponible ahora mismo.
			</StatusMessage>
		);
	} else {
		content = <p className="z-counter text-center" role="status">Cargando…</p>;
	}

	return <main className="container my-5">{content}</main>;
};
