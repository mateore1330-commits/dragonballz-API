import { CharacterCard } from "../components/CharacterCard.jsx";
import { PlanetCard } from "../components/PlanetCard.jsx";
import { Carousel } from "../components/Carousel.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";

/* ==========================================================================
   PAGINA DE INICIO
   --------------------------------------------------------------------------
   No pide datos a la API: la descarga de personajes y planetas se hace una
   sola vez en Layout.jsx (para que tambien esten disponibles en el buscador
   del navbar), y aqui simplemente se leen del store global y se pintan en
   dos carruseles.

   Mientras una lista no tiene datos, en su lugar se muestra que se esta
   cargando o, si la descarga fallo, un aviso con un boton para reintentar.
   Si fallo pero hay datos guardados de otra visita, se siguen mostrando.
   ========================================================================== */

/**
 * Hueco de una lista que todavia no tiene datos: cargando o error.
 * Mantiene el titular de la seccion para que la pagina no "salte" al llegar.
 */
const ListPlaceholder = ({ title, kanji, failed, onRetry }) => (
	<section className="mb-5">
		<div className="z-section-head">
			<div className="d-flex align-items-end gap-3 flex-wrap">
				<h2 className="z-title">{title}</h2>
				<span className="z-kanji d-none d-md-inline">{kanji}</span>
			</div>
		</div>

		{failed ? (
			<StatusMessage
				level={3}
				title={`No se han podido cargar los ${title.toLowerCase()}`}
				role="alert"
				actions={
					<button type="button" className="z-btn z-btn--red" onClick={onRetry}>
						<i className="fa-solid fa-rotate-right" aria-hidden="true"></i>
						Reintentar
					</button>
				}
			>
				Revisa tu conexión a internet. Si sigue fallando, puede que la Dragon Ball API no esté disponible ahora mismo.
			</StatusMessage>
		) : (
			<p className="z-counter text-center my-5" role="status">Cargando…</p>
		)}
	</section>
);

export const Home = () => {
	const { store, dispatch } = useGlobalReducer();
	usePageTitle(null); // La home lleva solo el nombre del sitio

	// "Reintentar" quita la marca de fallo y Layout.jsx vuelve a pedir la lista
	const retry = (list) => dispatch({ type: "retry_load", payload: list });

	return (
		<main className="container my-5">
			{/* --- Banner de cabecera --- */}
			<img
				src="/banner_dbz.jpg"
				alt="Dragon Ball Z — The Z Legacy"
				className="z-banner mb-5"
			/>

			{/* --- Carrusel de personajes --- */}
			{store.characters.length === 0 ? (
				<ListPlaceholder
					title="Personajes"
					kanji="戦士"
					failed={store.loadFailed.characters}
					onRetry={() => retry("characters")}
				/>
			) : (
				<Carousel
					title="Personajes"
					kanji="戦士"
					items={store.characters}
					renderItem={(char) => (
						<CharacterCard
							id={char.id}
							image={char.image}
							name={char.name}
							race={char.race}
							gender={char.gender}
							ki={char.ki}
						/>
					)}
				/>
			)}

			{/* --- Carrusel de planetas --- */}
			{store.planets.length === 0 ? (
				<ListPlaceholder
					title="Planetas"
					kanji="惑星"
					failed={store.loadFailed.planets}
					onRetry={() => retry("planets")}
				/>
			) : (
				<Carousel
					title="Planetas"
					kanji="惑星"
					items={store.planets}
					renderItem={(planet) => (
						<PlanetCard
							id={planet.id}
							image={planet.image}
							name={planet.name}
							isDestroyed={planet.isDestroyed}
							description={planet.description}
						/>
					)}
				/>
			)}
		</main>
	);
};
