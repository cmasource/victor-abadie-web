# Preparación para Google Search Console

## Alta de la propiedad

1. Entrar a Google Search Console.
2. Agregar una propiedad de tipo `URL prefix`.
3. Usar esta URL:

```text
https://victor-abadie-web.vercel.app
```

## Verificación

Métodos recomendados para Vercel:

- HTML tag en metadata, agregando el código que entrega Google en `src/app/layout.tsx`.
- Archivo HTML de verificación en `public/`, si Google entrega un archivo descargable.

No modificar variables reales de entorno ni credenciales para esta verificación.

## Enviar sitemap

Una vez verificada la propiedad, enviar:

```text
https://victor-abadie-web.vercel.app/sitemap.xml
```

## Inspección de URLs

Usar la herramienta de inspección de URL para revisar:

- `https://victor-abadie-web.vercel.app`
- `https://victor-abadie-web.vercel.app/propiedades`
- Una propiedad individual publicada, por ejemplo `https://victor-abadie-web.vercel.app/propiedades/[slug]`

Luego solicitar indexación para las URLs principales.

## Seguimiento

Revisar periódicamente:

- Errores de cobertura o indexación.
- URLs descubiertas pero no indexadas.
- Problemas de sitemap.
- Canonicals elegidos por Google.
- Rendimiento por consultas locales.

## Cuando exista dominio propio

Cuando se compre y conecte el dominio definitivo:

1. Actualizar `NEXT_PUBLIC_SITE_URL` en Vercel con el nuevo dominio.
2. Agregar una nueva propiedad en Search Console para el dominio propio.
3. Verificar la propiedad.
4. Enviar el nuevo sitemap.
5. Inspeccionar home, `/propiedades` y una propiedad individual.
