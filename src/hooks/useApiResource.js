import { useState, useEffect } from "react";
import { ApiError } from "../services/services.js";

/* ==========================================================================
   HOOK PARA PEDIR UN ELEMENTO A LA API
   --------------------------------------------------------------------------
   Lo usan las paginas de detalle (personaje y planeta), que hacen lo mismo:
   coger el id de la URL, pedirlo a la API y pintar segun lo que pase.

   Devuelve { status, data, retry }, donde status es uno de estos:
     - "loading"  : la peticion esta en marcha
     - "ready"    : ha llegado, y esta en data
     - "notFound" : ese id no existe
     - "error"    : no hay conexion o la API ha fallado; retry() reintenta
   ========================================================================== */

// La API responde 400 (y no 404) cuando se pide un id que no existe
const NOT_FOUND_STATUSES = [400, 404];

// Los ids son numeros. Con texto ("abc") la API devuelve un 500, asi que
// ni se le pregunta: se da por no encontrado directamente.
const isValidId = (id) => /^\d+$/.test(id);

/**
 * @param {(id: string) => Promise<Object>} fetcher Funcion de services.js
 *        (getCharacter o getPlanet). Tiene que ser siempre la misma funcion,
 *        no una creada en cada render, o la peticion se repetiria sin parar.
 * @param {string} id Id leido de la URL con useParams()
 */
export const useApiResource = (fetcher, id) => {
	// Cada reintento cambia "attempt", y con el la clave de la peticion
	const [attempt, setAttempt] = useState(0);
	const requestKey = `${id}#${attempt}`;

	// Resultado de la ultima peticion terminada, junto a la clave que lo pidio
	const [result, setResult] = useState({ key: null, status: "loading", data: null });

	const validId = isValidId(id);

	useEffect(() => {
		if (!validId) return;

		/*
		  "ignore" evita que una respuesta vieja pise a una nueva. Si se pasa
		  de un personaje a otro antes de que llegue el primero, React limpia
		  este efecto (return de abajo) y esa respuesta ya no se guarda.
		*/
		let ignore = false;

		fetcher(id)
			.then((data) => {
				if (!ignore) setResult({ key: requestKey, status: "ready", data });
			})
			.catch((error) => {
				if (ignore) return;
				const notFound = error instanceof ApiError && NOT_FOUND_STATUSES.includes(error.status);
				setResult({ key: requestKey, status: notFound ? "notFound" : "error", data: null });
			});

		return () => {
			ignore = true;
		};
	}, [fetcher, id, validId, requestKey]);

	const retry = () => setAttempt((prev) => prev + 1);

	if (!validId) return { status: "notFound", data: null, retry };

	// Si el resultado guardado es de otra peticion (otro id u otro intento),
	// la actual sigue en marcha
	if (result.key !== requestKey) return { status: "loading", data: null, retry };

	return { status: result.status, data: result.data, retry };
};
