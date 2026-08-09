import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

/* ==========================================================================
   TARJETA DE PLANETA
   --------------------------------------------------------------------------
   Gemela de CharacterCard pero con los datos propios de un planeta.
   Igual que aquella: solo pinta lo que recibe por props y gestiona su
   boton de favoritos contra el store global.
   ========================================================================== */
export const PlanetCard = ({ id, image, name, isDestroyed, description }) => {
	const { store, dispatch } = useGlobalReducer();

	/*
	  Se filtra por "id" Y "type" porque los ids se repiten entre colecciones:
	  sin el type, quitar el planeta 1 borraria tambien al personaje 1.
	*/
	const isFavorite = store.favorites.some((fav) => fav.id === id && fav.type === "planet");

	const toggleFavorite = () => {
		if (isFavorite) {
			dispatch({ type: "remove_favorite", payload: { id, type: "planet" } });
		} else {
			dispatch({ type: "add_favorite", payload: { id, type: "planet", name, image } });
		}
	};

	return (
		<article className="z-card">
			<div className="z-card-figure">
				<img src={image} alt={name} className="z-card-img" />
			</div>

			<div className="z-card-body">
				<h3 className="z-card-title">{name}</h3>

				{/* Estado del planeta: etiqueta roja si fue destruido */}
				<div className="mb-2">
					<span className={`z-tag ${isDestroyed ? "z-tag--red" : ""}`}>
						{isDestroyed ? "Destruido" : "No destruido"}
					</span>
				</div>

				{/*
				  La descripcion se recorta por CSS a 3 lineas (.z-card-text).
				  Los textos de la API tienen longitudes muy dispares y, sin ese
				  recorte, unas tarjetas quedaban mucho mas altas que otras.
				*/}
				<p className="z-card-text">{description}</p>

				<div className="z-card-foot">
					<Link to={`/planets/${id}`} className="z-btn z-btn--red">
						Leer más
						<i className="fa-solid fa-angle-right"></i>
					</Link>

					<button
						className={`z-btn z-btn-fav ${isFavorite ? "is-fav" : ""}`}
						onClick={toggleFavorite}
						aria-label={isFavorite ? `Quitar ${name} de favoritos` : `Anadir ${name} a favoritos`}
					>
						<i className={`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart`}></i>
					</button>
				</div>
			</div>
		</article>
	);
};
