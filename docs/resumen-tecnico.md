# Resumen técnico del proyecto

Este documento describe la implementación actual de la web de Víctor Abadie Inmobiliaria.

## Stack usado

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel
- Supabase Auth
- Supabase Database
- Supabase Storage

## Arquitectura general

La web está organizada en una parte pública y un panel administrativo. La parte pública muestra la home, el catálogo de propiedades, las fichas individuales, contacto y venta de propiedades. El panel admin permite gestionar la cartera inmobiliaria con usuarios autorizados.

## Next.js y TypeScript

El proyecto usa Next.js con App Router. Las rutas públicas viven dentro de `src/app/(site)` y las rutas administrativas dentro de `src/app/admin`. TypeScript se usa para tipar propiedades, formularios, roles y datos normalizados.

## Tailwind CSS

La interfaz usa Tailwind CSS con estilos consistentes para componentes públicos, panel admin, formularios, cards, galería y botones de acción.

## Vercel

La web pública está desplegada en Vercel:

https://victor-abadie-web.vercel.app

Vercel aloja el frontend y ejecuta las rutas de Next.js.

## Supabase

Supabase se usa para:

- Autenticación de usuarios del panel.
- Base de datos de propiedades, imágenes y usuarios admin.
- Storage de imágenes de propiedades.

Las claves privadas no deben exponerse en el frontend. El sitio público usa datos publicados y las operaciones del panel respetan los permisos configurados.

## Roles owner/editor

El panel distingue usuarios autorizados mediante la tabla de usuarios admin. El rol owner tiene control total. El rol editor puede operar la carga y edición habitual de propiedades, con límites sobre acciones críticas.

## SEO y Search Console

El sitio incluye metadata global, metadata por página, sitemap dinámico, robots y verificación de Google Search Console. Las rutas admin están configuradas para no indexarse.

## Instagram y WhatsApp

La home integra el feed real de Instagram con Elfsight y conserva un fallback visual controlado. La web incluye botones de WhatsApp para contacto directo y consultas por propiedad.

## Flujo de carga de propiedad

1. El usuario autorizado entra al panel.
2. Carga o importa datos de una propiedad.
3. Sube imágenes a Supabase Storage.
4. Marca la propiedad como publicada si corresponde.
5. La web pública lee las propiedades publicadas desde Supabase.

## Acceso al panel e infraestructura

El acceso al panel admin permite gestionar contenido de la web. No equivale a acceso a Vercel, Supabase ni otras herramientas de infraestructura, que deben mantenerse bajo control técnico separado.
