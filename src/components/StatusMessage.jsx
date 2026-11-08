/* ==========================================================================
   MENSAJE DE ESTADO
   --------------------------------------------------------------------------
   Bloque comun para todo lo que no es "contenido normal": cargando, no
   encontrado o error. Asi la 404, la pagina de error y las fichas avisan
   con el mismo aspecto.

   Props:
     - kanji    : kanji decorativo grande (opcional)
     - title    : titular del mensaje
     - children : texto explicativo (opcional)
     - actions  : botones o enlaces que se pintan debajo (opcional)
     - role     : "status" para avisos que cambian solos (cargando) o
                  "alert" para errores; el lector de pantalla los anuncia
     - level    : nivel del titular (1 a 6). 1 cuando el mensaje es toda la
                  pagina (404, fichas); mas alto cuando va dentro de una
                  seccion que ya tiene su propio titular (home)
   ========================================================================== */
export const StatusMessage = ({ kanji, title, children, actions, role = "status", level = 1 }) => {
	const Heading = `h${level}`;
	return (
		<section className="z-status text-center" role={role}>
			{kanji && <p className="z-status-kanji" aria-hidden="true">{kanji}</p>}
			<Heading className="z-title z-title--sm">{title}</Heading>
			{children && <p className="z-status-text">{children}</p>}
			{actions && <div className="d-flex justify-content-center flex-wrap gap-3">{actions}</div>}
		</section>
	);
};
