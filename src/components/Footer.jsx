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
			Data provided by{" "}
			<a href="https://dragonball-api.com" target="_blank" rel="noreferrer">
				Dragon Ball API
			</a>
		</p>

		<p className="mb-0" style={{ opacity: 0.7 }}>
			React practice project — Mateo Design
		</p>
	</footer>
);
