/* ==========================================================================
   PIE DE PAGINA
   --------------------------------------------------------------------------
   Componente estatico, sin estado ni logica. Se muestra en todas las vistas
   porque forma parte de Layout.jsx.
   ========================================================================== */
export const Footer = () => (
	<footer className="z-footer">
		{/* Kanji decorativo: "guerrero / vinculo / destino / esperanza" */}
		<p className="z-footer-kanji mb-2">戦士絆運命希望</p>

		<p className="mb-1">
			Datos de la{" "}
			<a href="https://dragonball-api.com" target="_blank" rel="noreferrer">
				Dragon Ball API
				{/* Solo para lectores de pantalla: avisa de que no se queda en la web */}
				<span className="visually-hidden"> (se abre en una pestaña nueva)</span>
			</a>
		</p>

		<p className="mb-0" style={{ opacity: 0.7 }}>
			Proyecto de práctica con React — Mateo Design
		</p>
	</footer>
);
