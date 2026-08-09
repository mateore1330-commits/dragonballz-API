import { useContext, useReducer, createContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store"

/* ==========================================================================
   HOOK DEL ESTADO GLOBAL
   --------------------------------------------------------------------------
   Conecta el reducer de store.js con toda la aplicacion usando el Context de
   React, para no tener que ir pasando el estado de padres a hijos por props
   nivel por nivel.

   Se compone de dos piezas:
     - StoreProvider    : envuelve la app y reparte el estado (se usa en main.jsx)
     - useGlobalReducer : atajo para que cualquier componente lea el estado
   ========================================================================== */

// Contexto donde viaja el estado global. Se llama "store" para no confundirlo
// con los useState locales de cada componente.
const StoreContext = createContext()

/**
 * Provider: crea el estado con useReducer y lo pone a disposicion de todos
 * los componentes que tenga por debajo en el arbol.
 */
export function StoreProvider({ children }) {
    // store    -> los datos actuales
    // dispatch -> la funcion para lanzar acciones al reducer
    const [store, dispatch] = useReducer(storeReducer, initialStore())

    /*
      Persistencia automatica en el navegador.

      Este efecto se ejecuta cada vez que el store cambia y vuelca una copia
      completa en localStorage. Al estar centralizado aqui, no hace falta
      acordarse de guardar nada en cada dispatch suelto: favoritos, personajes
      y planetas se guardan solos.

      Es la pieza que permite que, al recargar la pagina, initialStore()
      recupere los datos y la web no tenga que llamar de nuevo a la API.
    */
    useEffect(() => {
        localStorage.setItem("store", JSON.stringify(store))
    }, [store])

    return <StoreContext.Provider value={{ store, dispatch }}>
        {children}
    </StoreContext.Provider>
}

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
