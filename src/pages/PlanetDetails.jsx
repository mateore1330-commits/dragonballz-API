import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CharacterCard } from "../components/CharacterCard.jsx";
import { getPlanet } from "../services/services.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

/* ==========================================================================
   PAGINA DE DETALLE DE UN PLANETA
   --------------------------------------------------------------------------
   Ruta asociada: /planets/:id  (definida en routes.jsx)

   Sigue el mismo patron que CharacterDetails: coge el id de la URL, pide el
   planeta a la API y lo guarda en un estado local.

   Detalle util de esta API: el endpoint de un planeta ya devuelve dentro un
   array "characters" con sus habitantes, asi que no hace falta una segunda
   peticion para pintar la seccion de abajo; basta con reutilizar la misma
   tarjeta CharacterCard que usa la home.
   ========================================================================== */
export const PlanetDetails = () => {
	const { id } = useParams();
	const [planet, setPlanet] = useState(null);
	const { store, dispatch } = useGlobalReducer();

	useEffect(() => {
		getPlanet(id).then((data) => setPlanet(data));
	}, [id]);

	// Salida temprana mientras llega la respuesta de la API
	if (!planet) {
		return (
			<main className="container my-5 text-center">
				<p className="z-counter">Loading...</p>
			</main>
		);
	}

	const isFavorite = store.favorites.some((fav) => fav.id === planet.id && fav.type === "planet");

	const toggleFavorite = () => {
		if (isFavorite) {
			dispatch({ type: "remove_favorite", payload: { id: planet.id, type: "planet" } });
		} else {
			dispatch({
				type: "add_favorite",
				payload: { id: planet.id, type: "planet", name: planet.name, image: planet.image },
			});
		}
	};

	return (
		<main className="container my-5">
			<Link to="/" className="z-btn mb-4">
				<i className="fa-solid fa-arrow-left"></i>
				Volver
			</Link>

			<div className="row g-4 align-items-start">
				{/* --- Columna izquierda: imagen del planeta --- */}
				<div className="col-lg-5">
					<div className="z-detail-figure">
						<img src={planet.image} alt={planet.name} className="z-detail-img" />
					</div>
				</div>

				{/* --- Columna derecha: datos --- */}
				<div className="col-lg-7">
					<div className="d-flex justify-content-between align-items-start gap-3 mb-3">
						<div>
							<span className="z-tag z-tag--red mb-2 d-inline-block">Planeta</span>
							<h1 className="z-title z-title--sm">{planet.name}</h1>
						</div>

						<button
							className={`z-btn z-btn-fav ${isFavorite ? "is-fav" : ""}`}
							onClick={toggleFavorite}
							aria-label={isFavorite ? "Quitar de favoritos" : "Anadir a favoritos"}
						>
							<i className={`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart`}></i>
						</button>
					</div>

					<ul className="z-datasheet">
						<li>
							<span className="z-label">Estado</span>
							<span className="z-value">
								<span className={`z-tag ${planet.isDestroyed ? "z-tag--red" : ""}`}>
									{planet.isDestroyed ? "Destruido" : "No destruido"}
								</span>
							</span>
						</li>
						<li>
							<span className="z-label">Personajes del planeta</span>
							<span className="z-value">{planet.characters.length}</span>
						</li>
					</ul>

					<p className="z-description">{planet.description}</p>
				</div>
			</div>

			{/* --- Habitantes del planeta --- */}
			<section className="mt-5">
				<div className="z-section-head">
					<div className="d-flex align-items-end gap-3 flex-wrap">
						<h2 className="z-title z-title--sm">Personajes</h2>
						<span className="z-kanji d-none d-md-inline">住民</span>
					</div>
					<span className="z-counter">DE {planet.name.toUpperCase()}</span>
				</div>

				{planet.characters.length === 0 ? (
					<p className="z-counter">No hay personajes conocidos de este planeta.</p>
				) : (
					<div className="row g-4">
						{planet.characters.map((char) => (
							// col-* reparte las tarjetas en una rejilla de 3 por fila
							<div key={char.id} className="col-12 col-md-6 col-lg-4">
								<CharacterCard
									id={char.id}
									image={char.image}
									name={char.name}
									race={char.race}
									gender={char.gender}
									ki={char.ki}
								/>
							</div>
						))}
					</div>
				)}
			</section>
		</main>
	);
};
