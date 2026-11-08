import { createContext } from "react";

/* ==========================================================================
   CONTEXTO DEL ESTADO GLOBAL
   --------------------------------------------------------------------------
   Es el "canal" por el que viaja el store. Vive en su propio archivo porque
   lo comparten dos piezas:
     - StoreProvider.jsx     : lo rellena con el estado
     - useGlobalReducer.jsx  : lo lee desde cualquier componente

   Se llama "store" para no confundirlo con los useState locales de cada
   componente.
   ========================================================================== */
export const StoreContext = createContext();
