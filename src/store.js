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

/**
 * Estado inicial de la aplicacion.
 *
 * Antes de empezar de cero se mira si hay una copia guardada en el
 * localStorage del navegador. Si la hay, se recupera: gracias a eso los
 * favoritos y las listas ya descargadas sobreviven a un F5 y la web no
 * vuelve a llamar a la API en cada recarga.
 */
export const initialStore = () => {
  const saved = localStorage.getItem("store");
  if (saved) return JSON.parse(saved);

  return {
    favorites: [],           // Personajes y planetas marcados con el corazon
    characters: [],          // Listado completo de personajes
    planets: [],             // Listado completo de planetas
    characterFetchedAt: null, // Cuando se descargaron los personajes
    planetsFetchedAt: null,   // Cuando se descargaron los planetas
  };
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
