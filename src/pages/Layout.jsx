import { useEffect } from "react"
import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
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
    */
    useEffect(() => {
        if (isStale(store.characterFetchedAt)) {
            getAllCharacter().then((data) => dispatch({ type: "set_characters", payload: data.items }))
        }
        if (isStale(store.planetsFetchedAt)) {
            getAllPlanets().then((data) => dispatch({ type: "set_planets", payload: data.items }))
        }
    }, [])

    return (
        <ScrollToTop>
            <Navbar />
            {/* Outlet: aqui React Router inserta la pagina de la ruta actual */}
            <Outlet />
            <Footer />
        </ScrollToTop>
    )
}
