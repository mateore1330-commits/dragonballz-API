import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';

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
   ========================================================================== */
const Main = () => {
    return (
        // StrictMode solo actua en desarrollo: avisa de malas practicas en la consola
        <React.StrictMode>
            <StoreProvider>
                <RouterProvider router={router} />
            </StoreProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
