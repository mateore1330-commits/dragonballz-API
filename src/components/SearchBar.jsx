import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

/* ==========================================================================
   BUSCADOR CON AUTOCOMPLETADO
   --------------------------------------------------------------------------
   Busca por NOMBRE entre los personajes y planetas que ya estan guardados
   en el store global. Como los datos ya estan en memoria, filtrar es
   instantaneo y no hace falta llamar a la API en cada tecla.

   Al elegir un resultado se navega a su pagina de detalle. El usuario nunca
   ve ni escribe el id: este solo se usa por debajo para construir la ruta.

   Se puede manejar de dos formas, y ambas conviven:
     - Con el raton : clic sobre una sugerencia (son enlaces reales <Link>)
     - Con el teclado: flechas arriba/abajo para moverse, Enter para entrar
                       y Escape para cerrar
   ========================================================================== */
export const SearchBar = () => {
	const { store } = useGlobalReducer();

	const [term, setTerm] = useState("");                    // Texto escrito
	const [highlightedIndex, setHighlightedIndex] = useState(-1); // Sugerencia resaltada (-1 = ninguna)
	const containerRef = useRef(null);                       // Referencia al contenedor, para detectar clics fuera
	const navigate = useNavigate();                          // Navegacion desde el teclado (Enter)

	// Cerrar las sugerencias al hacer clic en cualquier punto fuera del buscador
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setTerm("");
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		// Limpieza: si no se quita el listener, se acumularia en cada montaje
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	/*
	  Lista de coincidencias.
	  Se unen personajes y planetas en un mismo array con una forma comun
	  ({ id, name, image, type }) para poder recorrerlos juntos. El campo
	  "type" es el que luego decide a que ruta lleva cada sugerencia.
	*/
	const matches = term.length === 0
		? []
		: [
			...store.characters
				.filter((char) => char.name.toLowerCase().includes(term.toLowerCase()))
				.map((char) => ({ id: char.id, name: char.name, image: char.image, type: "character" })),
			...store.planets
				.filter((planet) => planet.name.toLowerCase().includes(term.toLowerCase()))
				.map((planet) => ({ id: planet.id, name: planet.name, image: planet.image, type: "planet" })),
		].slice(0, 8); // Se limita a 8 sugerencias para no tapar la pantalla

	// Construye la ruta de detalle a partir del tipo de elemento
	const buildPath = (item) => `/${item.type === "character" ? "characters" : "planets"}/${item.id}`;

	// Deja el buscador limpio despues de elegir un resultado
	const resetSearch = () => {
		setTerm("");
		setHighlightedIndex(-1);
	};

	// Al escribir se reinicia el resaltado: los resultados de antes ya no valen
	const handleChange = (e) => {
		setTerm(e.target.value);
		setHighlightedIndex(-1);
	};

	// Control por teclado
	const handleKeyDown = (e) => {
		if (matches.length === 0) return;

		if (e.key === "ArrowDown") {
			e.preventDefault(); // Evita que el cursor salte al final del texto
			setHighlightedIndex((prev) => Math.min(prev + 1, matches.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlightedIndex((prev) => Math.max(prev - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			// Si aun no se ha bajado con las flechas, se entra en el primer resultado
			const selected = matches[highlightedIndex] ?? matches[0];
			navigate(buildPath(selected));
			resetSearch();
		} else if (e.key === "Escape") {
			resetSearch();
		}
	};

	return (
		<div className="position-relative flex-grow-1" ref={containerRef} style={{ maxWidth: "320px" }}>
			<input
				type="text"
				className="z-search-input w-100"
				placeholder="Buscar personajes o planetas..."
				value={term}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>

			{/* Las sugerencias solo aparecen si hay alguna coincidencia */}
			{matches.length > 0 && (
				<ul className="z-suggestions position-absolute w-100" style={{ zIndex: 1050, top: "100%" }}>
					{matches.map((item, index) => (
						<li key={`${item.type}-${item.id}`} className="z-suggestion">
							<Link
								to={buildPath(item)}
								className={`z-suggestion-link ${index === highlightedIndex ? "is-active" : ""}`}
								onClick={resetSearch}
								// Mantiene sincronizados raton y teclado: al pasar el raton
								// por encima, esa sugerencia pasa a ser la resaltada
								onMouseEnter={() => setHighlightedIndex(index)}
							>
								<img src={item.image} alt={item.name} className="z-suggestion-thumb" />
								<span className="text-truncate">{item.name}</span>
								<span className="ms-auto text-uppercase" style={{ fontSize: "0.65rem", opacity: 0.7 }}>
									{item.type}
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
