/* ==========================================================================
   SERVICIOS — LLAMADAS A LA API
   --------------------------------------------------------------------------
   Este archivo concentra TODAS las peticiones a la Dragon Ball API.
   Su unica responsabilidad es pedir los datos y devolverlos ya convertidos
   a objeto de JavaScript; no guarda estado ni decide como se muestran.

   Al tenerlo separado, si algun dia cambia la URL de la API o hay que anadir
   una cabecera de autenticacion, solo hay que tocar este archivo.

   Todas las funciones son "async" y devuelven una promesa, por eso quien las
   llama usa .then(...) para recoger el resultado y .catch(...) para el error.
   ========================================================================== */

const API_URL = "https://dragonball-api.com/api";

/**
 * Error de la API: la peticion llego, pero la API respondio con un error.
 *
 * Guarda el codigo HTTP para que cada pagina decida que mostrar. Por
 * ejemplo, la API responde 400 cuando se pide un id que no existe.
 *
 * Si ni siquiera hay respuesta (sin conexion, API caida), fetch lanza un
 * TypeError en su lugar, que no es un ApiError.
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Pide una ruta de la API y devuelve el JSON de la respuesta.
 *
 * fetch() solo falla si no hay respuesta: un 400 o un 500 los da por
 * buenos. Por eso hay que mirar response.ok y lanzar el error a mano;
 * si no, la pagina intentaria pintar el mensaje de error como si fueran
 * los datos y se romperia.
 *
 * @param {string} path Ruta dentro de la API, por ejemplo "/planets/1"
 * @returns {Promise<Object>}
 * @throws {ApiError} Si la API responde con un codigo de error
 */
const request = async (path) => {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new ApiError(response.status, `La API respondio ${response.status} en ${path}`);
  }
  return response.json();
};

/**
 * Devuelve el listado completo de personajes.
 *
 * La API esta paginada: por defecto solo devolveria los primeros 10, por eso
 * se pide limit=58, que es el total de personajes disponibles.
 *
 * @returns {Promise<Object>} { items: [...], meta: {...}, links: {...} }
 */
export const getAllCharacter = () => request("/characters?limit=58");

/**
 * Devuelve un unico personaje con toda su informacion ampliada.
 *
 * A diferencia del listado, aqui vienen ademas la descripcion, la afiliacion,
 * el objeto "originPlanet" y el array "transformations".
 *
 * @param {string|number} id Identificador del personaje
 * @returns {Promise<Object>} Objeto del personaje
 */
export const getCharacter = (id) => request(`/characters/${id}`);

/**
 * Devuelve el listado completo de planetas (20 en total).
 *
 * @returns {Promise<Object>} { items: [...], meta: {...}, links: {...} }
 */
export const getAllPlanets = () => request("/planets?limit=20");

/**
 * Devuelve un unico planeta.
 *
 * La respuesta incluye un array "characters" con los personajes originarios
 * de ese planeta, asi que no hace falta una segunda peticion para mostrarlos.
 *
 * @param {string|number} id Identificador del planeta
 * @returns {Promise<Object>} Objeto del planeta
 */
export const getPlanet = (id) => request(`/planets/${id}`);
