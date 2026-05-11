# Víctor Abadie Inmobiliaria

Web responsive para inmobiliaria local de San Luis creada con Next.js App Router, TypeScript y Tailwind CSS.

## Correr el proyecto

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Editar propiedades

Las propiedades se cargan desde:

```text
src/data/properties.json
```

Cada propiedad tiene campos como `slug`, `operation`, `type`, `title`, `location`, `city`, `neighborhood`, `price`, `numericPrice`, `createdAt`, `mainImage`, `images`, `features` y `tags`.

- Usá `numericPrice: null` cuando el precio sea "Consultar precio".
- Usá `createdAt` con formato `YYYY-MM-DD` para ordenar por recientes.
- El `slug` define la URL: `/propiedades/[slug]`.

## Agregar imágenes

Guardá las fotos en:

```text
public/properties/
```

Luego actualizá `mainImage` e `images` en el JSON. Ejemplo:

```json
"mainImage": "/properties/casa-juana-koslay-1.jpg"
```

Los logos están en:

```text
public/brand/logo-horizontal.jpg
public/brand/logo-cuadrado.png
public/brand/favicon.png
```

## Cambiar WhatsApp y teléfono

Editá:

```text
src/lib/whatsapp.ts
```

Ahí están `WHATSAPP_NUMBER`, `DISPLAY_WHATSAPP`, `PHONE_NUMBER` y los mensajes base.

## Cambiar SITE_URL

Mientras no haya dominio propio se usa:

```text
https://victor-abadie-inmobiliaria.vercel.app
```

Para cambiarlo, editá:

```text
src/lib/site.ts
```

Ese valor alimenta metadata, Open Graph, JSON-LD, sitemap y robots.

## Deploy en Vercel

1. Subir el proyecto a GitHub.
2. Importar el repositorio desde Vercel.
3. Framework: Next.js.
4. Build command: `npm run build`.
5. No requiere variables de entorno en esta versión.

## Panel administrativo con Supabase

El Sprint 4 agrega un panel privado en:

```text
/admin/login
```

Para activarlo hacen falta estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

También se soporta:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

No usar `service_role` en el frontend.

El SQL de base de datos y políticas está en:

```text
supabase/schema.sql
```

La guía paso a paso está en:

```text
docs/supabase-setup.md
```

Si Supabase no está configurado, las páginas públicas siguen funcionando con el fallback JSON de `src/data/properties.json`.
