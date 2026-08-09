import { CharacterCard } from "../components/CharacterCard.jsx";
import { PlanetCard } from "../components/PlanetCard.jsx";
import { Carousel } from "../components/Carousel.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

/* ==========================================================================
   PAGINA DE INICIO
   --------------------------------------------------------------------------
   Es una vista puramente de lectura: NO pide datos a la API.
   La descarga de personajes y planetas se hace una sola vez en Layout.jsx
   (para que tambien esten disponibles en el buscador del navbar), y aqui
   simplemente se leen del store global y se pintan en dos carruseles.
   ========================================================================== */
export const Home = () => {
	// Solo necesitamos "store": esta pagina no despacha ninguna accion
	const { store } = useGlobalReducer();

	return (
		<main className="container my-5">
			{/* --- Banner de cabecera --- */}
			<img
				src="/banner_dbz.jpg"
				alt="Dragon Ball Z — The Z Legacy"
				className="z-banner mb-5"
			/>

			{/* --- Carrusel de personajes --- */}
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

			{/* --- Carrusel de planetas --- */}
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
		</main>
	);
};
