/* ==========================================================================
   STORE GLOBAL — ESTADO COMPARTIDO DE LA APLICACION
   --------------------------------------------------------------------------
   Aqui vive lo que necesita ser visto o modificado desde varios sitios a la
   vez. El resto de datos (por ejemplo el personaje concreto de una pagina de
   detalle) se queda en el useState local de su componente.

   Que guarda el store y por que:
     - favorites  : se marca desde una tarjeta y tiene que verse al instante
                    en el desplegable del navbar y en la pagina de detalle
     - characters : los usan la home y el buscador del navbar
     - planets    : igual que los personajes
     - *FetchedAt : marcas de tiempo para saber si los datos ya caducaron

   El estado NUNCA se modifica directamente: cada caso del reducer devuelve
   un objeto nuevo con el operador spread (...store). Asi React detecta el
   cambio y vuelve a pintar los componentes afectados.
   ========================================================================== */


/**
 * Tiempo que se considera "fresca" la informacion descargada: 1 hora.
 * Pasado ese rato se vuelve a pedir a la API para no mostrar datos antiguos
 * de forma indefinida.
 */
export const CACHE_TTL = 1000 * 60 * 60;

/**
 * Indica si unos datos ya han caducado y conviene volver a descargarlos.
 *
 * Devuelve true en dos situaciones:
 *   1. Nunca se han descargado (fetchedAt es null o undefined)
 *   2. Se descargaron hace mas tiempo del permitido por CACHE_TTL
 *
 * @param {number|null} fetchedAt Momento de la ultima descarga (Date.now())
 * @returns {boolean}
 */
export const isStale = (fetchedAt) => !fetchedAt || Date.now() - fetchedAt > CACHE_TTL;

// Clave con la que se guarda el store en el localStorage del navegador
const STORAGE_KEY = "store";

/**
 * Estado de partida cuando no hay nada guardado.
 * Sus claves son tambien las unicas que se guardan en localStorage.
 */
const emptyStore = () => ({
  favorites: [],           // Personajes y planetas marcados con el corazon
  characters: [],          // Listado completo de personajes
  planets: [],             // Listado completo de planetas
  characterFetchedAt: null, // Cuando se descargaron los personajes
  planetsFetchedAt: null,   // Cuando se descargaron los planetas
});

// Comprobaciones de forma para lo que llega de localStorage
const isList = (value) => Array.isArray(value) && value.every((item) => item && typeof item.id === "number");
const isFavorite = (fav) =>
  fav && typeof fav.id === "number" && (fav.type === "character" || fav.type === "planet") && typeof fav.name === "string";
const isTimestamp = (value) => value === null || typeof value === "number";

/**
 * Lee la copia guardada en localStorage, sin fiarse de ella.
 *
 * Puede estar corrupta (JSON roto), venir de una version antigua de la web
 * con otra forma, o el navegador puede bloquear el acceso (modo privado).
 * En cualquiera de esos casos la app no debe romperse: se recupera lo que
 * sea valido y el resto vuelve al valor de partida.
 *
 * Si una lista no es valida, tambien se olvida su marca de tiempo, para que
 * Layout.jsx la vuelva a descargar.
 *
 * @returns {Object|null} Lo que se pudo recuperar, o null si no hay nada
 */
const readSavedStore = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return null;

    const store = emptyStore();
    if (Array.isArray(saved.favorites)) store.favorites = saved.favorites.filter(isFavorite);
    if (isList(saved.characters) && isTimestamp(saved.characterFetchedAt)) {
      store.characters = saved.characters;
      store.characterFetchedAt = saved.characterFetchedAt;
    }
    if (isList(saved.planets) && isTimestamp(saved.planetsFetchedAt)) {
      store.planets = saved.planets;
      store.planetsFetchedAt = saved.planetsFetchedAt;
    }
    return store;
  } catch {
    return null;
  }
};

/**
 * Estado inicial de la aplicacion.
 *
 * Antes de empezar de cero se mira si hay una copia guardada en el
 * localStorage del navegador. Si la hay, se recupera: gracias a eso los
 * favoritos y las listas ya descargadas sobreviven a un F5 y la web no
 * vuelve a llamar a la API en cada recarga.
 */
export const initialStore = () => readSavedStore() ?? emptyStore();

/**
 * Guarda en localStorage la parte del store que debe sobrevivir a un F5.
 *
 * Solo se guardan las claves de emptyStore(): lo demas (por ejemplo, si una
 * descarga fallo) solo tiene sentido mientras la pagina esta abierta.
 * Si el navegador no deja guardar (modo privado, almacenamiento lleno), la
 * web sigue funcionando; simplemente no recordara nada al recargar.
 *
 * @param {Object} store Estado actual
 */
export const saveStore = (store) => {
  const persisted = {};
  for (const key of Object.keys(emptyStore())) persisted[key] = store[key];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Sin almacenamiento disponible: no hay nada mas que hacer
  }
};

/**
 * Reducer: recibe el estado actual y una accion, y devuelve el estado nuevo.
 * Es la unica puerta de entrada para modificar el store.
 */
export default function storeReducer(store, action = {}) {
  switch (action.type) {

    // --- Anadir un elemento a favoritos ---
    // El payload guarda solo lo imprescindible para pintarlo en el navbar:
    // { id, type, name, image }
    case 'add_favorite':
      return {
        ...store,
        favorites: [...store.favorites, action.payload],
      };

    // --- Quitar un elemento de favoritos ---
    // IMPORTANTE: se compara el id Y el tipo a la vez.
    // La API reutiliza los ids entre colecciones (Goku es el personaje 1 y
    // Namek es el planeta 1), asi que filtrar solo por id borraria los dos.
    case 'remove_favorite':
      return {
        ...store,
        favorites: store.favorites.filter(
          (item) => !(item.id === action.payload.id && item.type === action.payload.type)
        ),
      };

    // --- Guardar el listado de personajes descargado de la API ---
    // Se anota la hora para que isStale() pueda decidir mas adelante si
    // hace falta volver a pedirlos.
    case 'set_characters':
      return {
        ...store,
        characters: action.payload,
        characterFetchedAt: Date.now(),
      };

    // --- Guardar el listado de planetas descargado de la API ---
    case 'set_planets':
      return {
        ...store,
        planets: action.payload,
        planetsFetchedAt: Date.now(),
      };

    // Si llega una accion que no existe es un error de programacion:
    // mejor avisar en la consola que fallar en silencio.
    default:
      throw Error('Unknown action.');
  }
}
