# Analytics y seguimiento de conversiones

La web queda preparada para medir actividad comercial básica con Google Analytics 4.

## 1. Qué mide la web

Si se configura GA4, la web puede medir:

- visitas generales del sitio público;
- clics a WhatsApp;
- clics a Instagram;
- vistas de propiedades;
- clics en cards de propiedades.

Eventos enviados:

- `whatsapp_click`
- `instagram_click`
- `property_view`
- `property_card_click`

## 2. Cómo activar Google Analytics

1. Crear una propiedad en Google Analytics 4.
2. Obtener el Measurement ID, con formato similar a `G-XXXXXXXXXX`.
3. Cargar la variable en Vercel:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Hacer redeploy del proyecto.

Si la variable no existe o está vacía, no se carga ningún script de Google Analytics.

## 3. Cómo verificar eventos

1. Abrir la web pública.
2. Entrar a Google Analytics 4.
3. Abrir la vista de tiempo real.
4. Navegar por la home, listado y una propiedad.
5. Hacer clic en WhatsApp, Instagram y cards de propiedades.
6. Confirmar que aparezcan eventos como `whatsapp_click`, `instagram_click`, `property_view` y `property_card_click`.

## 4. Privacidad y alcance

- No se trackean rutas admin.
- No se guardan credenciales.
- No se usa `service_role`.
- El Measurement ID de GA4 es público.
- Los eventos son comerciales y generales.
- Los eventos de propiedades envían datos básicos como título, slug, operación, tipo y ubicación.

## 5. Cómo desactivar Analytics

1. Eliminar `NEXT_PUBLIC_GA_MEASUREMENT_ID` de Vercel.
2. Hacer redeploy.

Sin esa variable, la web sigue funcionando normalmente y los eventos simplemente no se envían.
