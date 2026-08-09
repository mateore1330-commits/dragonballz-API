import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

/* ==========================================================================
   TARJETA DE PERSONAJE
   --------------------------------------------------------------------------
   Componente PRESENTACIONAL: no pide nada a la API, solo recibe por props
   los datos que necesita pintar. Quien decide que personaje se muestra es
   el componente padre (Home.jsx o PlanetDetails.jsx) al recorrer su lista.

   La unica logica que tiene es la del boton de favoritos, que lee y escribe
   en el store global para mantenerse sincronizada con el resto de la app.
   ========================================================================== */
export const CharacterCard = ({ id, image, name, race, gender, ki }) => {
	const { store, dispatch } = useGlobalReducer();

	/*
	  ¿Este personaje esta en favoritos?
	  Se comprueba contra el store global (no con un estado local) para que
	  el corazon aparezca marcado en TODAS las vistas a la vez.
	  Se compara "id" Y "type" porque la API repite ids entre personajes y
	  planetas (Goku es el id 1, pero Namek tambien).
	*/
	const isFavorite = store.favorites.some((fav) => fav.id === id && fav.type === "character");

	// Un unico boton que anade o quita, segun el estado actual
	const toggleFavorite = () => {
		if (isFavorite) {
			dispatch({ type: "remove_favorite", payload: { id, type: "character" } });
		} else {
			dispatch({ type: "add_favorite", payload: { id, type: "character", name, image } });
		}
	};

	return (
		<article className="z-card">
			{/* Marco de imagen de altura fija: todas las tarjetas miden igual */}
			<div className="z-card-figure">
				<img src={image} alt={name} className="z-card-img" />
			</div>

			<div className="z-card-body">
				<h3 className="z-card-title">{name}</h3>

				{/* Ficha de datos en formato etiqueta / valor */}
				<ul className="z-card-data">
					<li>
						<span className="z-label">Raza</span>
						<span className="z-value">{race}</span>
					</li>
					<li>
						<span className="z-label">Género</span>
						<span className="z-value">{gender}</span>
					</li>
					<li>
						<span className="z-label">Ki</span>
						<span className="z-value">{ki}</span>
					</li>
				</ul>

				{/* El pie se pega abajo para que los botones queden alineados */}
				<div className="z-card-foot">
					<Link to={`/characters/${id}`} className="z-btn z-btn--red">
						Leer más 
						<i className="fa-solid fa-angle-right"></i>
					</Link>

					<button
						className={`z-btn z-btn-fav ${isFavorite ? "is-fav" : ""}`}
						onClick={toggleFavorite}
						aria-label={isFavorite ? `Quitar ${name} de favoritos` : `Anadir ${name} a favoritos`}
					>
						{/* Corazon relleno si es favorito, contorno si no */}
						<i className={`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart`}></i>
					</button>
				</div>
			</div>
		</article>
	);
};
