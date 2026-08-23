export default function CommunitySketch({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 520"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-full h-auto ${className}`}
      role="img"
      aria-label="Grupo de personas jóvenes conectadas"
    >
      {/* Figura 1 - izquierda, recostada */}
      <path d="M130 220 Q95 195 120 140 Q155 95 205 125 Q245 155 215 215 Q185 255 130 220" />
      <circle cx="145" cy="160" r="3" fill="currentColor" stroke="none" />
      <circle cx="175" cy="160" r="3" fill="currentColor" stroke="none" />
      <path d="M145 190 Q160 205 180 190" />
      <path d="M150 250 Q80 300 60 380" />
      <path d="M200 270 Q230 330 230 400" />
      <path d="M60 380 L30 410" />
      <path d="M230 400 Q240 430 260 420" />

      {/* Figura 2 - brazo levantado */}
      <path d="M290 225 Q255 195 280 125 Q315 75 375 110 Q420 145 385 220 Q355 260 290 225" />
      <circle cx="310" cy="145" r="3" fill="currentColor" stroke="none" />
      <circle cx="345" cy="145" r="3" fill="currentColor" stroke="none" />
      <path d="M315 175 Q330 190 350 175" />
      <path d="M350 255 Q380 190 370 95" />
      <path d="M370 95 Q360 65 345 75 Q335 95 355 105" />
      <path d="M300 270 Q270 330 280 410" />
      <path d="M375 270 Q420 330 415 410" />
      <path d="M280 410 Q270 440 290 450" />
      <path d="M415 410 Q425 440 405 450" />

      {/* Figura 3 - centro, sin rostro */}
      <path d="M430 230 Q395 195 420 120 Q455 65 520 110 Q570 155 530 230 Q495 275 430 230" />
      <path d="M470 275 Q450 350 460 420" />
      <path d="M530 275 Q580 330 640 310" />
      <path d="M460 420 Q450 455 480 460" />
      <path d="M640 310 Q660 295 670 315" />

      {/* Figura 4 - con piernas cruzadas */}
      <path d="M620 245 Q585 210 610 135 Q645 80 705 125 Q755 170 715 245 Q680 290 620 245" />
      <circle cx="645" cy="160" r="3" fill="currentColor" stroke="none" />
      <circle cx="680" cy="160" r="3" fill="currentColor" stroke="none" />
      <path d="M650 195 Q665 210 685 195" />
      <path d="M610 290 Q580 360 620 420" />
      <path d="M710 290 Q760 340 740 410" />
      <path d="M620 420 Q650 450 630 470" />
      <path d="M740 410 Q720 450 700 460" />

      {/* Figura 5 - derecha */}
      <path d="M750 250 Q715 215 740 140 Q775 85 835 130 Q885 175 845 250 Q810 295 750 250" />
      <circle cx="775" cy="165" r="3" fill="currentColor" stroke="none" />
      <circle cx="810" cy="165" r="3" fill="currentColor" stroke="none" />
      <path d="M780 200 Q795 215 815 200" />
      <path d="M740 295 Q720 360 750 420" />
      <path d="M840 295 Q880 340 870 410" />
      <path d="M750 420 Q765 450 790 455" />
      <path d="M870 410 Q855 450 830 455" />
    </svg>
  );
}
