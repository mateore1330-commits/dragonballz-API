import { useState, useEffect } from "react";

/* ==========================================================================
   CARRUSEL
   --------------------------------------------------------------------------
   Componente PRESENTACIONAL y generico: no sabe si le pasan personajes o
   planetas, solo recibe una lista y una funcion que dice como pintar cada
   elemento. Por eso puede reutilizarse en las dos secciones de la home.

   Props:
     - title      : titular de la seccion (ej. "Characters")
     - kanji      : kanji decorativo que acompana al titular
     - items      : array de elementos a mostrar
     - renderItem : funcion que recibe un elemento y devuelve su JSX

   Como funciona el desplazamiento:
     Se pintan TODOS los elementos en una fila (.z-carousel-track) dentro de
     una ventana con overflow oculto (.z-carousel-viewport). Para "pasar" de
     pagina no se añaden ni se quitan elementos: simplemente se desplaza la
     fila con transform: translateX(). Asi la animacion es fluida y el
     navegador no tiene que volver a montar las tarjetas.
   ========================================================================== */

// Puntos de corte: deben coincidir con los @media de index.css
const getVisibleCount = () => {
	if (window.innerWidth < 768) return 1;   // Movil
	if (window.innerWidth < 992) return 2;   // Tablet
	return 3;                                // Escritorio
};

export const Carousel = ({ title, kanji, items, renderItem }) => {
	// Indice del primer elemento visible dentro de la ventana
	const [index, setIndex] = useState(0);
	// Cuantas tarjetas caben a la vez (cambia con el tamano de la pantalla)
	const [visibleCount, setVisibleCount] = useState(getVisibleCount);

	// Al redimensionar la ventana recalculamos cuantas tarjetas caben
	useEffect(() => {
		const handleResize = () => setVisibleCount(getVisibleCount());
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Ultimo indice valido: evita dejar huecos vacios al final del carrusel
	const maxIndex = Math.max(0, items.length - visibleCount);

	// Si la pantalla se encoge y el indice actual se sale de rango, lo corregimos
	useEffect(() => {
		setIndex((prev) => Math.min(prev, maxIndex));
	}, [maxIndex]);

	const goPrev = () => setIndex((prev) => Math.max(0, prev - 1));
	const goNext = () => setIndex((prev) => Math.min(maxIndex, prev + 1));

	// Ancho de cada tarjeta en % — el mismo valor sirve para desplazar la fila
	const slideWidth = 100 / visibleCount;

	return (
		<section className="mb-5">
			{/* --- Cabecera: titular, kanji, contador y flechas --- */}
			<div className="z-section-head">
				<div className="d-flex align-items-end gap-3 flex-wrap">
					<h2 className="z-title">{title}</h2>
					<span className="z-kanji d-none d-md-inline">{kanji}</span>
				</div>

				<div className="d-flex align-items-center gap-3">
					{/* Contador tipo "03 / 58" */}
					<span className="z-counter">
						{String(Math.min(index + visibleCount, items.length)).padStart(2, "0")}
						{" / "}
						{String(items.length).padStart(2, "0")}
					</span>

					<button
						className="z-arrow"
						onClick={goPrev}
						disabled={index === 0}
						aria-label={`Anterior en ${title}`}
					>
						<i className="fa-solid fa-chevron-left"></i>
					</button>
					<button
						className="z-arrow"
						onClick={goNext}
						disabled={index >= maxIndex}
						aria-label={`Siguiente en ${title}`}
					>
						<i className="fa-solid fa-chevron-right"></i>
					</button>
				</div>
			</div>

			{/* --- Ventana + fila desplazable --- */}
			<div className="z-carousel-viewport">
				<div
					className="z-carousel-track"
					style={{ transform: `translateX(-${index * slideWidth}%)` }}
				>
					{items.map((item) => (
						<div
							key={`${item.id}-${item.name}`}
							className="z-carousel-slide"
							style={{ width: `${slideWidth}%` }}
						>
							{renderItem(item)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
