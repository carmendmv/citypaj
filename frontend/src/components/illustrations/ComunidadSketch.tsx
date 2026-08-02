export default function ComunidadSketch({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 700 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-full h-auto ${className}`}
      role="img"
      aria-label="Grupo de jóvenes reunidos en comunidad"
    >
      {/* Figura 1 - apoyada con brazo */}
      <path d="M70 120 Q50 100 70 80 Q90 60 110 80 Q130 100 110 120 Q90 140 70 120" />
      <path d="M90 140 Q70 160 80 210" />
      <path d="M75 155 L45 205" />
      <path d="M85 210 L55 260" />
      <path d="M95 210 L125 260" />
      <circle cx="83" cy="100" r="3" fill="currentColor" stroke="none" />
      <circle cx="100" cy="100" r="3" fill="currentColor" stroke="none" />
      <path d="M85 115 Q92 120 100 115" />

      {/* Figura 2 - brazo levantado */}
      <path d="M170 120 Q150 100 170 80 Q190 60 210 80 Q230 100 210 120 Q190 140 170 120" />
      <path d="M190 140 Q170 160 180 210" />
      <path d="M195 150 L195 60" />
      <circle cx="195" cy="55" r="5" fill="currentColor" stroke="none" />
      <path d="M180 210 L155 260" />
      <path d="M195 210 L220 260" />

      {/* Figura 3 - de espaldas, sin rostro */}
      <path d="M270 120 Q250 100 270 80 Q290 60 310 80 Q330 100 310 120 Q290 140 270 120" />
      <path d="M290 140 Q270 160 280 210" />
      <path d="M275 210 L245 255" />
      <path d="M290 210 L320 255" />

      {/* Figura 4 - brazos apoyados */}
      <path d="M370 120 Q350 100 370 80 Q390 60 410 80 Q430 100 410 120 Q390 140 370 120" />
      <path d="M390 140 Q370 160 380 210" />
      <path d="M380 155 L355 185" />
      <path d="M400 155 L420 180" />
      <path d="M380 210 L350 260" />
      <path d="M400 210 L430 260" />
      <circle cx="383" cy="100" r="3" fill="currentColor" stroke="none" />
      <circle cx="400" cy="100" r="3" fill="currentColor" stroke="none" />
      <path d="M385 115 Q392 120 400 115" />

      {/* Figura 5 - sentada */}
      <path d="M470 120 Q450 100 470 80 Q490 60 510 80 Q530 100 510 120 Q490 140 470 120" />
      <path d="M490 140 Q470 160 480 210" />
      <path d="M475 155 L455 185" />
      <path d="M505 155 L525 185" />
      <path d="M480 210 L455 260" />
      <path d="M500 210 L525 260" />
      <circle cx="483" cy="100" r="3" fill="currentColor" stroke="none" />
      <circle cx="500" cy="100" r="3" fill="currentColor" stroke="none" />
      <path d="M485 115 Q492 120 500 115" />
    </svg>
  );
}
