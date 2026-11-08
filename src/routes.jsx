import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { CharacterDetails } from "./pages/CharacterDetails";
import { PlanetDetails } from "./pages/PlanetDetails";

/* ==========================================================================
   RUTAS DE LA APLICACION
   --------------------------------------------------------------------------
   Todas las paginas cuelgan de la ruta "/" con el Layout, que pone el navbar
   y el footer. Cada ruta hija se pinta en el <Outlet /> del Layout, asi que
   una pagina nueva que necesite navbar y footer va dentro de esa ruta.

   errorElement es lo que se muestra si la URL no coincide con ninguna ruta
   o si una pagina falla al pintarse.
   ========================================================================== */
export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Las rutas con ":id" leen ese trozo de la URL con useParams() */}
        <Route path= "/" element={<Home />} />
        <Route path="/characters/:id" element={<CharacterDetails />} />
        <Route path="/planets/:id" element={<PlanetDetails />} />
      </Route>
    )
);