# Backlog: pop-up promocional

Idea pendiente para una etapa futura: mostrar un video promocional breve al ingresar al sitio, por ejemplo para destacar una propiedad, una campaña de tasaciones o una oportunidad puntual.

## Comportamiento esperado

- Mostrar el pop-up una sola vez al ingresar, sin bloquear la navegación.
- Permitir cerrarlo con un botón `X` claro y accesible.
- Recordar el cierre con `localStorage` o cookie.
- No volver a mostrarlo durante un período definido, por ejemplo 7 o 15 días.
- Activarlo solo cuando exista un video optimizado para web.

## Criterios de cuidado

- No cargar videos pesados en el primer render.
- En mobile, evitar ocupar toda la pantalla sin una salida clara.
- Respetar rendimiento, accesibilidad y Core Web Vitals.
- Mantenerlo desactivado por defecto hasta que exista una campaña real.

## Implementación sugerida

- Crear un componente client `PromoPopup`.
- Leer una clave tipo `va_promo_popup_closed_at` desde `localStorage`.
- Renderizar el pop-up solo si pasó el tiempo definido.
- Usar un video comprimido en `/public/promos/` o un embed liviano validado.
- Integrarlo solo en el layout público cuando se decida activarlo.
