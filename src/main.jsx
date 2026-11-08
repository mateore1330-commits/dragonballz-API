import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { StoreProvider } from './hooks/StoreProvider.jsx';

/* ==========================================================================
   PUNTO DE ENTRADA DE LA APLICACION
   --------------------------------------------------------------------------
   Monta React dentro del <div id="root"> de index.html y envuelve la app
   en sus dos piezas globales, de fuera hacia dentro:
     - StoreProvider  : reparte el estado global (favoritos, personajes y
                        planetas) a todos los componentes
     - RouterProvider : decide que pagina se pinta segun la URL (routes.jsx)

   El StoreProvider va por fuera para que cualquier pagina, incluida la de
   error, pueda leer el store.

   Se pinta directamente, sin un componente "Main" intermedio: este archivo
   no exporta nada, y la recarga en caliente de Vite solo funciona con
   componentes que se exportan.
   ========================================================================== */
ReactDOM.createRoot(document.getElementById('root')).render(
    // StrictMode solo actua en desarrollo: avisa de malas practicas en la consola
    <React.StrictMode>
        <StoreProvider>
            <RouterProvider router={router} />
        </StoreProvider>
    </React.StrictMode>
)
