/**
 * Titulo de la pestana para una ficha, segun el estado de useApiResource.
 *
 * Esta en su propio archivo y no en ResourceStatus.jsx porque ese solo debe
 * exportar componentes (si no, la recarga en caliente de Vite deja de funcionar).
 *
 * @param {string} status        "loading", "ready", "notFound" o "error"
 * @param {string} [name]        Nombre del personaje o planeta, si ya llego
 * @param {string} notFoundTitle Titulo cuando el id no existe
 * @returns {string}
 */
export const resourceTitle = (status, name, notFoundTitle) => {
	if (status === "ready") return name;
	if (status === "notFound") return notFoundTitle;
	if (status === "error") return "No se ha podido cargar";
	return "Cargando…";
};
