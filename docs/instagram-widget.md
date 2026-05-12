# Instagram widget externo

Este sprint deja preparada la sección "Novedades en Instagram" para mostrar un feed real mediante un proveedor externo como Elfsight, Taggbox o Flockler.

## Qué resuelve

- Permite activar un widget real sin usar la API de Meta.
- Mantiene la grilla visual actual como fallback.
- Evita scraping y llamadas directas a Instagram desde backend.
- Permite configurar por variables públicas de entorno en local y Vercel.

## Por qué existe fallback

La grilla actual no es un feed real: muestra propiedades publicadas o placas visuales locales. Sirve cuando:

- no hay widget configurado;
- se trabaja en local;
- el proveedor externo falla;
- se decide pausar el servicio por costos, límites o plan gratuito.

## Configuración central

El archivo principal es:

```txt
src/config/instagramWidget.ts
```

Campos:

- `enabled`: activa o desactiva el widget real.
- `provider`: `elfsight`, `taggbox`, `flockler` o `custom`.
- `scriptSrc`: URL del script externo.
- `containerHtml`: HTML del contenedor del widget.
- `rawEmbedHtml`: bloque completo opcional del proveedor.
- `fallbackMode`: `properties` o `visual`.

El proyecto trae un default activo para Elfsight porque el código no contiene secretos. Las variables `NEXT_PUBLIC_*` tienen prioridad sobre la configuración del archivo.

No pegues secretos. Estas variables son públicas porque se envían al navegador.

## Opción recomendada: Elfsight

1. Crear un widget de Instagram Feed en Elfsight.
2. Copiar el código del widget.
3. Separar:

```txt
scriptSrc:
https://elfsightcdn.com/platform.js
```

```html
containerHtml:
<div class="elfsight-app-XXXX" data-elfsight-app-lazy></div>
```

4. Configurar en `.env.local` o en Vercel.
5. Reiniciar `npm run dev` si estás en local.

Ejemplo local:

```env
NEXT_PUBLIC_INSTAGRAM_WIDGET_ENABLED=true
NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER=elfsight
NEXT_PUBLIC_INSTAGRAM_WIDGET_SCRIPT_SRC=https://elfsightcdn.com/platform.js
NEXT_PUBLIC_INSTAGRAM_WIDGET_CONTAINER_HTML=<div class="elfsight-app-XXXX" data-elfsight-app-lazy></div>
```

## Alternativa: Taggbox

1. Crear feed en Taggbox.
2. Generar el código embed.
3. Si entrega un `iframe`, usarlo como `containerHtml`.
4. Si entrega script externo, poner la URL en `scriptSrc`.

Ejemplo:

```env
NEXT_PUBLIC_INSTAGRAM_WIDGET_ENABLED=true
NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER=taggbox
NEXT_PUBLIC_INSTAGRAM_WIDGET_CONTAINER_HTML=<iframe src="https://widget.taggbox.com/..." style="width:100%;height:520px;border:0;"></iframe>
```

## Configurar en Vercel

Ir a:

```txt
Vercel > Project > Settings > Environment Variables
```

Agregar solo si querés sobrescribir el default:

```env
NEXT_PUBLIC_INSTAGRAM_WIDGET_ENABLED=true
NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER=elfsight
NEXT_PUBLIC_INSTAGRAM_WIDGET_SCRIPT_SRC=https://elfsightcdn.com/platform.js
NEXT_PUBLIC_INSTAGRAM_WIDGET_CONTAINER_HTML=<div class="elfsight-app-..." data-elfsight-app-lazy></div>
```

Después de cambiar variables en Vercel, hacer redeploy.

## Debug opcional

Para diagnosticar producción sin exponer HTML completo:

```env
NEXT_PUBLIC_INSTAGRAM_WIDGET_DEBUG=true
```

Esto muestra debajo de la sección Instagram una línea como:

```txt
Instagram widget: enabled=true | provider=elfsight | container=true | script=true
```

Desactivarlo al terminar la prueba.

## Volver al fallback

Para desactivar el widget real:

```env
NEXT_PUBLIC_INSTAGRAM_WIDGET_ENABLED=false
```

Luego redeployar. La sección vuelve a mostrar la grilla visual fallback.

## Seguridad y mantenimiento

- Usar solo código de proveedores confiables.
- No pegar scripts desconocidos.
- No pegar datos sensibles.
- El embed externo puede depender del plan del proveedor.
- Algunos proveedores limitan vistas mensuales o muestran marca de agua.
- Si el widget falla, la web debe seguir funcionando con fallback.

## Problemas frecuentes

### No se ve el widget

- Revisar que `NEXT_PUBLIC_INSTAGRAM_WIDGET_ENABLED` no esté en `false`.
- Revisar que `scriptSrc` y `containerHtml` estén completos.
- Activar temporalmente `NEXT_PUBLIC_INSTAGRAM_WIDGET_DEBUG=true`.
- Reiniciar el servidor local o redeployar en Vercel.

### Se ve en local pero no en Vercel

- Confirmar que las variables estén cargadas en Vercel si se usan overrides.
- Hacer redeploy después de agregarlas.
- Revisar restricciones del proveedor por dominio.
- Verificar en Elements que exista el `div` `elfsight-app-*`.

### Se ve en desktop pero no en mobile

- Revisar si el proveedor genera un iframe ancho.
- Preferir widgets responsive.
- Confirmar que el iframe use `width:100%`.

### El proveedor pide reconectar Instagram

- Entrar al panel del proveedor.
- Reconectar la cuenta de Instagram.
- Verificar permisos del perfil.

### Límite del plan gratuito

- Revisar vistas mensuales del proveedor.
- Si se agota el plan, desactivar el widget para volver al fallback.
