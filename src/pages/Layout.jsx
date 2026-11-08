import { useEffect } from "react"
import { Outlet, ScrollRestoration } from "react-router"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import { getAllCharacter, getAllPlanets } from "../services/services.js"
import { isStale } from "../store.js"

/* ==========================================================================
   LAYOUT — ESTRUCTURA COMUN A TODAS LAS PAGINAS
   --------------------------------------------------------------------------
   Envuelve todas las rutas (ver routes.jsx) para que el navbar y el footer
   se mantengan fijos y solo cambie el contenido del medio, que es lo que
   representa <Outlet />.

   Ademas es el lugar donde se descargan una unica vez los listados de
   personajes y planetas.
   ========================================================================== */
export const Layout = () => {
    const { store, dispatch } = useGlobalReducer()

    /*
      Descarga inicial de datos.

      Se hace aqui y no en Home.jsx por dos motivos:
        1. El buscador del navbar necesita las listas para poder filtrar,
           aunque el usuario entre directamente a una pagina de detalle sin
           haber pasado nunca por la home.
        2. Al estar en un unico sitio, se evita repetir la misma peticion
           desde varias vistas.

      La condicion isStale() es la que evita las llamadas innecesarias: si el
      store se recupero de localStorage y los datos siguen siendo recientes,
      no se pide nada a la API.

      Hay un efecto por lista, y no uno para las dos: cada efecto vuelve a
      ejecutarse cuando cambia su propia marca de tiempo, y en ese momento
      sus datos ya estan frescos, asi que no repite la peticion. Con un solo
      efecto, al llegar los personajes se volverian a pedir los planetas
      aunque su peticion siguiera en marcha.

      Si una descarga falla, se marca en store.loadFailed y el efecto deja de
      intentarlo (si no, reintentaria sin parar). El boton "Reintentar" de la
      home quita esa marca, el efecto vuelve a ejecutarse y pide la lista.
    */
    const charactersFailed = store.loadFailed.characters
    const planetsFailed = store.loadFailed.planets

    useEffect(() => {
        if (isStale(store.characterFetchedAt) && !charactersFailed) {
            getAllCharacter()
                .then((data) => dispatch({ type: "set_characters", payload: data.items }))
                .catch(() => dispatch({ type: "load_failed", payload: "characters" }))
        }
    }, [store.characterFetchedAt, charactersFailed, dispatch])

    useEffect(() => {
        if (isStale(store.planetsFetchedAt) && !planetsFailed) {
            getAllPlanets()
                .then((data) => dispatch({ type: "set_planets", payload: data.items }))
                .catch(() => dispatch({ type: "load_failed", payload: "planets" }))
        }
    }, [store.planetsFetchedAt, planetsFailed, dispatch])

    return (
        <>
            <Navbar />
            {/* Outlet: aqui React Router inserta la pagina de la ruta actual */}
            <Outlet />
            <Footer />
            {/*
              Control del scroll al navegar:
                - a una pagina nueva -> empieza arriba del todo
                - con "atras" o "adelante" del navegador -> vuelve a la
                  posicion en la que se dejo esa pagina
              Solo funciona con createBrowserRouter (el que usa routes.jsx).
            */}
            <ScrollRestoration />
        </>
    )
}
