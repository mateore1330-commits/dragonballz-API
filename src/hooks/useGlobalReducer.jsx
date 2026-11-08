import { useContext } from "react";
import { StoreContext } from "./storeContext.js";

/* ==========================================================================
   HOOK DEL ESTADO GLOBAL
   --------------------------------------------------------------------------
   Conecta el reducer de store.js con toda la aplicacion usando el Context de
   React, para no tener que ir pasando el estado de padres a hijos por props
   nivel por nivel.

   Se compone de tres piezas:
     - storeContext.js    : el contexto por el que viaja el estado
     - StoreProvider.jsx  : envuelve la app y reparte el estado (main.jsx)
     - useGlobalReducer   : este hook, el atajo para leer el estado
   ========================================================================== */

/**
 * Hook personalizado para consumir el estado global.
 *
 * Uso dentro de cualquier componente:
 *   const { store, dispatch } = useGlobalReducer();
 */
export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext)
    return { dispatch, store };
}
