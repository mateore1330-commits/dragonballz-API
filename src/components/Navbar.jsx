import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { SearchBar } from "./SearchBar.jsx";

/* ==========================================================================
   BARRA DE NAVEGACION
   --------------------------------------------------------------------------
   Se muestra en todas las paginas porque vive dentro de Layout.jsx.
   Contiene tres bloques: logo, buscador y desplegable de favoritos.

   El desplegable lee la lista de favoritos del store global, asi que se
   actualiza solo cada vez que se marca un corazon en cualquier otra vista.
   ========================================================================== */
export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const { pathname } = useLocation();
	const favoritesButtonRef = useRef(null); // Boton que abre el desplegable de favoritos

	/*
	  Cerrar el desplegable al cambiar de pagina.

	  El navbar no se vuelve a montar al navegar (vive en el Layout), asi que
	  Bootstrap no sabe que la pagina ha cambiado y el menu se quedaria abierto.
	  Pasa al pulsar un favorito, al elegir algo en el buscador o con cualquier
	  enlace. Este efecto se ejecuta cada vez que cambia la ruta y le pide a
	  Bootstrap que lo cierre.

	  "bootstrap" llega del <script> del CDN en index.html. Si no cargara, el
	  "?." hace que no pase nada en lugar de romper la pagina.
	*/
	useEffect(() => {
		window.bootstrap?.Dropdown.getInstance(favoritesButtonRef.current)?.hide();
	}, [pathname]);

	// Se separan por tipo para poder mostrarlos agrupados bajo su titulo
	const favoriteCharacters = store.favorites.filter((fav) => fav.type === "character");
	const favoritePlanets = store.favorites.filter((fav) => fav.type === "planet");

	// Quitar un favorito desde el propio desplegable
	const removeFavorite = (id, type) => {
		dispatch({ type: "remove_favorite", payload: { id, type } });
	};

	/*
	  Fila reutilizable del desplegable (misma pinta para personajes y planetas).
	  La imagen y el nombre son un enlace a su ficha; la x de al lado es un
	  boton aparte para quitarlo, asi que cada accion tiene su propio sitio.
	*/
	const renderFavoriteRow = (fav) => (
		<li key={`${fav.type}-${fav.id}`}>
			<div className="z-fav-row">
				<Link
					to={`/${fav.type === "character" ? "characters" : "planets"}/${fav.id}`}
					className="z-fav-link d-flex align-items-center gap-2 overflow-hidden"
				>
					<img src={fav.image} alt="" className="z-fav-thumb" />
					<span className="text-truncate">{fav.name}</span>
				</Link>
				<button
					className="z-btn-remove"
					onClick={() => removeFavorite(fav.id, fav.type)}
					aria-label={`Quitar ${fav.name} de favoritos`}
				>
					<i className="fa-solid fa-xmark" aria-hidden="true"></i>
				</button>
			</div>
		</li>
	);

	return (
		<nav className="z-navbar">
			<div className="container d-flex justify-content-between align-items-center gap-3 py-2 flex-wrap">
				{/* --- Logo: vuelve siempre al inicio --- */}
				<Link to="/" aria-label="Ir al inicio">
					<img src="/logo_dbz.png" alt="Dragon Ball Z" className="z-logo" />
				</Link>

				{/* --- Buscador con autocompletado --- */}
				<SearchBar />

				{/* --- Desplegable de favoritos --- */}
				<div className="dropdown">
					<button
						ref={favoritesButtonRef}
						className="z-btn dropdown-toggle"
						type="button"
						data-bs-toggle="dropdown"
						/*
						  auto-close="outside": por defecto Bootstrap cierra el menu con
						  cualquier clic, tambien dentro, y se cerraria al quitar un
						  favorito con la x. Con "outside" solo se cierra al tocar fuera
						  del menu, con Escape o pulsando de nuevo este boton, asi que
						  se pueden quitar varios favoritos seguidos.
						*/
						data-bs-auto-close="outside"
						aria-expanded="false"
					>
						<i className="fa-solid fa-heart" aria-hidden="true"></i>
						Favoritos
						<span className="z-tag z-tag--red ms-1">{store.favorites.length}</span>
					</button>

					<ul className="dropdown-menu dropdown-menu-end z-dropdown">
						{/* Mensaje cuando todavia no se ha marcado nada */}
						{store.favorites.length === 0 && (
							<li className="px-2 py-2 text-center" style={{ fontSize: "0.85rem", opacity: 0.6 }}>
								Aún no hay favoritos
							</li>
						)}

						{/* Grupo de personajes (solo si hay alguno) */}
						{favoriteCharacters.length > 0 && (
							<>
								<li className="z-dropdown-head">Personajes</li>
								{favoriteCharacters.map(renderFavoriteRow)}
							</>
						)}

						{/* Grupo de planetas (solo si hay alguno) */}
						{favoritePlanets.length > 0 && (
							<>
								<li className="z-dropdown-head">Planetas</li>
								{favoritePlanets.map(renderFavoriteRow)}
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};
