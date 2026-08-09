import { Link } from "react-router-dom";
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

	// Se separan por tipo para poder mostrarlos agrupados bajo su titulo
	const favoriteCharacters = store.favorites.filter((fav) => fav.type === "character");
	const favoritePlanets = store.favorites.filter((fav) => fav.type === "planet");

	// Quitar un favorito desde el propio desplegable
	const removeFavorite = (id, type) => {
		dispatch({ type: "remove_favorite", payload: { id, type } });
	};

	// Fila reutilizable del desplegable (misma pinta para personajes y planetas)
	const renderFavoriteRow = (fav) => (
		<li key={`${fav.type}-${fav.id}`}>
			<div className="z-fav-row">
				<div className="d-flex align-items-center gap-2 overflow-hidden">
					<img src={fav.image} alt={fav.name} className="z-fav-thumb" />
					<span className="text-truncate">{fav.name}</span>
				</div>
				<button
					className="z-btn-remove"
					onClick={() => removeFavorite(fav.id, fav.type)}
					aria-label={`Quitar ${fav.name} de favoritos`}
				>
					<i className="fa-solid fa-xmark"></i>
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
						className="z-btn dropdown-toggle"
						type="button"
						data-bs-toggle="dropdown"
						/*
						  auto-close="false": por defecto Bootstrap cierra el menu con
						  cualquier clic. Al desactivarlo, el desplegable solo se cierra
						  pulsando de nuevo este boton, y no al borrar un favorito.
						*/
						data-bs-auto-close="false"
						aria-expanded="false"
					>
						<i className="fa-solid fa-heart"></i>
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
