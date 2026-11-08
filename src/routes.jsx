import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { CharacterDetails } from "./pages/CharacterDetails";
import { PlanetDetails } from "./pages/PlanetDetails";
import { NotFound } from "./pages/NotFound";
import { ErrorPage } from "./pages/ErrorPage";

/* ==========================================================================
   RUTAS DE LA APLICACION
   --------------------------------------------------------------------------
   Todas las paginas cuelgan de la ruta "/" con el Layout, que pone el navbar
   y el footer. Cada ruta hija se pinta en el <Outlet /> del Layout, asi que
   una pagina nueva que necesite navbar y footer va dentro de esa ruta.

   Hay dos errorElement, uno dentro de otro:
     - El de la ruta sin path que envuelve a las paginas: si una pagina
       falla al pintarse, el error se muestra dentro del Layout, con el
       navbar y el footer.
     - El de la raiz: solo entra si falla el propio Layout, y por eso se
       pinta solo, sin navbar ni footer.

   La ruta "*" recoge cualquier URL que no coincida con las demas.
   ========================================================================== */
export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<ErrorPage standalone />} >
        <Route errorElement={<ErrorPage />}>
          {/* Las rutas con ":id" leen ese trozo de la URL con useParams() */}
          <Route index element={<Home />} />
          <Route path="characters/:id" element={<CharacterDetails />} />
          <Route path="planets/:id" element={<PlanetDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    )
);