import { Link, useParams } from "react-router";
import { getCharacter } from "../services/services.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useApiResource } from "../hooks/useApiResource.js";
import { ResourceStatus } from "../components/ResourceStatus.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { resourceTitle } from "../hooks/resourceTitle.js";

/* ==========================================================================
   PAGINA DE DETALLE DE UN PERSONAJE
   --------------------------------------------------------------------------
   Ruta asociada: /characters/:id  (definida en routes.jsx)

   A diferencia de la home, aqui SI se llama a la API: el listado general
   trae solo los datos basicos, mientras que este endpoint devuelve ademas
   la descripcion, la afiliacion, el planeta de origen y las
   transformaciones con sus propias imagenes y niveles de ki.
   ========================================================================== */
export const CharacterDetails = () => {
	/*
	  useParams lee el trozo dinamico de la URL. Si la direccion es
	  /characters/1, entonces id === "1" (llega siempre como texto).
	*/
	const { id } = useParams();

	const { store, dispatch } = useGlobalReducer();

	/*
	  useApiResource pide el personaje cada vez que cambia el id de la URL
	  y dice en que punto esta la peticion (ver hooks/useApiResource.js).
	*/
	const { status, data: character, retry } = useApiResource(getCharacter, id);
	usePageTitle(resourceTitle(status, character?.name, "Personaje no encontrado"));

	// Mientras no hay personaje (cargando, no existe o error) se avisa y se
	// sale: el resto de la pagina da por hecho que "character" tiene datos
	if (status !== "ready") {
		return <ResourceStatus status={status} retry={retry} notFoundTitle="Personaje no encontrado" />;
	}

	// Algunos personajes no tienen transformaciones; si el campo faltara, lista vacia
	const transformations = character.transformations ?? [];

	// Mismo criterio de favoritos que en las tarjetas: id + tipo
	const isFavorite = store.favorites.some((fav) => fav.id === character.id && fav.type === "character");

	const toggleFavorite = () => {
		if (isFavorite) {
			dispatch({ type: "remove_favorite", payload: { id: character.id, type: "character" } });
		} else {
			dispatch({
				type: "add_favorite",
				payload: { id: character.id, type: "character", name: character.name, image: character.image },
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
				{/* --- Columna izquierda: retrato --- */}
				<div className="col-lg-5">
					<div className="z-detail-figure">
						<img src={character.image} alt={character.name} className="z-detail-img" />
					</div>
				</div>

				{/* --- Columna derecha: ficha tecnica --- */}
				<div className="col-lg-7">
					<div className="d-flex justify-content-between align-items-start gap-3 mb-3">
						<div>
							<span className="z-tag z-tag--red mb-2 d-inline-block">Personaje</span>
							<h1 className="z-title z-title--sm">{character.name}</h1>
						</div>

						<button
							className={`z-btn z-btn-fav ${isFavorite ? "is-fav" : ""}`}
							onClick={toggleFavorite}
							aria-label={isFavorite ? `Quitar ${character.name} de favoritos` : `Añadir ${character.name} a favoritos`}
						>
							<i className={`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart`}></i>
						</button>
					</div>

					<ul className="z-datasheet">
						<li><span className="z-label">Raza</span><span className="z-value">{character.race}</span></li>
						<li><span className="z-label">Género</span><span className="z-value">{character.gender}</span></li>
						<li><span className="z-label">Afiliación</span><span className="z-value">{character.affiliation}</span></li>
						<li><span className="z-label">Ki</span><span className="z-value">{character.ki}</span></li>
						<li><span className="z-label">Ki Máximo</span><span className="z-value">{character.maxKi}</span></li>
					</ul>

					<p className="z-description">{character.description}</p>

					{/*
					  originPlanet llega como objeto anidado dentro del personaje,
					  asi que se puede enlazar directamente a su pagina de detalle.
					  Si algun personaje no lo trajera, simplemente no se pinta.
					*/}
					{character.originPlanet && (
						<Link to={`/planets/${character.originPlanet.id}`} className="z-btn">
							<i className="fa-solid fa-earth-americas"></i>
							Planeta de origen: {character.originPlanet.name}
						</Link>
					)}
				</div>
			</div>

			{/* --- Transformaciones --- */}
			<section className="mt-5">
				<div className="z-section-head">
					<div className="d-flex align-items-end gap-3 flex-wrap">
						<h2 className="z-title z-title--sm">Transformaciones</h2>
						<span className="z-kanji d-none d-md-inline">変身</span>
					</div>
					<span className="z-counter">{String(transformations.length).padStart(2, "0")} FORMAS</span>
				</div>

				{/* Algunos personajes no tienen ninguna transformacion */}
				{transformations.length === 0 ? (
					<p className="z-counter">No hay transformaciones disponibles.</p>
				) : (
					<div className="d-flex flex-wrap gap-3">
						{transformations.map((transformation) => (
							<article key={transformation.id} className="z-transformation">
								<div className="z-transformation-figure">
									<img src={transformation.image} alt={transformation.name} />
								</div>
								<p className="z-transformation-name">{transformation.name}</p>
								<p className="z-transformation-ki">Ki: {transformation.ki}</p>
							</article>
						))}
					</div>
				)}
			</section>
		</main>
	);
};
