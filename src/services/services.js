/* ==========================================================================
   SERVICIOS — LLAMADAS A LA API
   --------------------------------------------------------------------------
   Este archivo concentra TODAS las peticiones a la Dragon Ball API.
   Su unica responsabilidad es pedir los datos y devolverlos ya convertidos
   a objeto de JavaScript; no guarda estado ni decide como se muestran.

   Al tenerlo separado, si algun dia cambia la URL de la API o hay que anadir
   una cabecera de autenticacion, solo hay que tocar este archivo.

   Todas las funciones son "async" y devuelven una promesa, por eso quien las
   llama usa .then(...) para recoger el resultado.
   ========================================================================== */


/**
 * Devuelve el listado completo de personajes.
 *
 * La API esta paginada: por defecto solo devolveria los primeros 10, por eso
 * se pide limit=58, que es el total de personajes disponibles.
 *
 * @returns {Promise<Object>} { items: [...], meta: {...}, links: {...} }
 */
export const getAllCharacter = async () => {
  const response = await fetch(`https://dragonball-api.com/api/characters?limit=58`);
  const data = await response.json();
  return data;
};

/**
 * Devuelve un unico personaje con toda su informacion ampliada.
 *
 * A diferencia del listado, aqui vienen ademas la descripcion, la afiliacion,
 * el objeto "originPlanet" y el array "transformations".
 *
 * @param {string|number} id Identificador del personaje
 * @returns {Promise<Object>} Objeto del personaje
 */
export const getCharacter = async (id) => {
  const response = await fetch(`https://dragonball-api.com/api/characters/${id}`);
  const data = await response.json();
  return data;
};

/**
 * Devuelve el listado completo de planetas (20 en total).
 *
 * @returns {Promise<Object>} { items: [...], meta: {...}, links: {...} }
 */
export const getAllPlanets = async () => {
  const response = await fetch(`https://dragonball-api.com/api/planets?limit=20`);
  const data = await response.json();
  return data;
};

/**
 * Devuelve un unico planeta.
 *
 * La respuesta incluye un array "characters" con los personajes originarios
 * de ese planeta, asi que no hace falta una segunda peticion para mostrarlos.
 *
 * @param {string|number} id Identificador del planeta
 * @returns {Promise<Object>} Objeto del planeta
 */
export const getPlanet = async (id) => {
  const response = await fetch(`https://dragonball-api.com/api/planets/${id}`);
  const data = await response.json();
  return data;
};
