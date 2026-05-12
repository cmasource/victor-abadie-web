# Importador desde copy de Instagram

El importador permite pegar el texto de una publicación de Instagram y convertirlo en una ficha inmobiliaria editable para acelerar la carga de propiedades.

## Cómo usarlo

1. Entrar al panel admin.
2. Ir a `Importar Instagram`.
3. Copiar el texto completo de una publicación de Instagram.
4. Pegar el texto en el campo `Copy de Instagram`.
5. Presionar `Analizar publicación`.
6. Revisar y corregir los campos detectados.
7. Usar `Crear propiedad con estos datos`.
8. El sistema redirige a `/admin/propiedades/nueva?from=instagram`.
9. Revisar nuevamente la ficha, subir fotos manualmente y guardar.

## Qué intenta detectar

- Operación: venta, alquiler u oportunidad.
- Tipo: casa, departamento, terreno, local, campo, inversión o desarrollo.
- Título.
- Ubicación, localidad y barrio/zona.
- Precio visible, moneda y precio numérico.
- Superficie cubierta y terreno.
- Dormitorios, baños, ambientes y cochera.
- Características.
- Descripción web limpia.
- Slug sugerido.
- Caption original para Instagram.

## Limitaciones

- No descarga fotos automáticamente.
- No llama a Instagram.
- No usa OpenAI ni APIs pagas.
- No hace scraping.
- Es un parser local basado en reglas, por lo que siempre conviene revisar la ficha antes de guardar.

## Fotos

Las imágenes se cargan manualmente desde el formulario normal de nueva propiedad. Esto evita errores de permisos, contenido externo o imágenes de baja calidad.

## Seguridad

La ruta `/admin/importar-instagram` está protegida como el resto del panel. Pueden acceder usuarios `owner` y `editor`.
