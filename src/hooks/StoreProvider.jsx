import { useReducer, useEffect } from "react";
import storeReducer, { initialStore, saveStore } from "../store";
import { StoreContext } from "./storeContext.js";

/* ==========================================================================
   PROVIDER DEL ESTADO GLOBAL
   --------------------------------------------------------------------------
   Crea el estado con useReducer y lo pone a disposicion de todos los
   componentes que tenga por debajo en el arbol (se usa en main.jsx).

   Esta en su propio archivo, separado del hook, porque la recarga en
   caliente de Vite solo funciona en archivos que exportan componentes.
   ========================================================================== */
export function StoreProvider({ children }) {
    // store    -> los datos actuales
    // dispatch -> la funcion para lanzar acciones al reducer
    const [store, dispatch] = useReducer(storeReducer, initialStore())

    /*
      Persistencia automatica en el navegador.

      Este efecto se ejecuta cada vez que el store cambia y vuelca una copia
      en localStorage (saveStore, en store.js, decide que se guarda). Al
      estar centralizado aqui, no hace falta acordarse de guardar nada en
      cada dispatch suelto: favoritos, personajes y planetas se guardan solos.

      Es la pieza que permite que, al recargar la pagina, initialStore()
      recupere los datos y la web no tenga que llamar de nuevo a la API.
    */
    useEffect(() => {
        saveStore(store)
    }, [store])

    return <StoreContext.Provider value={{ store, dispatch }}>
        {children}
    </StoreContext.Provider>
}
