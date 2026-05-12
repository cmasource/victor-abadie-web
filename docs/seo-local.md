# Estrategia futura de SEO local

Este sprint deja preparada la base técnica de SEO. Las páginas locales conviene implementarlas en una etapa posterior, con contenido útil y propiedades reales filtradas por zona, para evitar páginas finas o repetitivas.

## Rutas sugeridas

- `/propiedades/san-luis`
- `/propiedades/juana-koslay`
- `/propiedades/la-punta`
- `/propiedades/el-volcan`
- `/propiedades/potrero-de-los-funes`
- `/propiedades/trapiche`

## Estructura recomendada por página

Cada página local debería incluir:

- Un H1 natural, por ejemplo `Propiedades en Juana Koslay`.
- Un texto introductorio breve sobre la zona, sin inventar datos ni promesas.
- Propiedades publicadas filtradas por `city`, `neighborhood`, `location` o tags.
- Enlaces internos hacia el catálogo general y otras zonas cercanas.
- Preguntas frecuentes reales sobre compra, venta, consulta, disponibilidad o tasación.
- Un CTA visible a WhatsApp para consultas y tasaciones.

## Criterios de contenido

- Mantener lenguaje local y profesional.
- No repetir el mismo texto cambiando solo el nombre de la ciudad.
- No hacer keyword stuffing.
- No publicar páginas vacías: si una zona no tiene propiedades disponibles, mostrar una explicación honesta y CTA de consulta.
- Usar metadata específica por zona con canonical propio.

## Implementación futura sugerida

Crear una ruta dinámica controlada, por ejemplo `src/app/(site)/propiedades/[zona]/page.tsx`, solo si no entra en conflicto con los slugs actuales de propiedades. Como hoy `/propiedades/[slug]` ya pertenece a detalles de propiedades, una alternativa más segura es usar una carpeta separada:

- `/zonas/san-luis`
- `/zonas/juana-koslay`
- `/zonas/la-punta`
- `/zonas/el-volcan`
- `/zonas/potrero-de-los-funes`
- `/zonas/trapiche`

Esa alternativa evita ambigüedad entre slugs de propiedades y páginas locales.
