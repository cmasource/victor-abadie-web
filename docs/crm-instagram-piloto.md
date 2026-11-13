# Piloto de recepción de consultas de Instagram

El webhook guarda mensajes directos entrantes en una tabla privada de Supabase. La escritura de contactos, notas y tareas en HubSpot corresponde a la siguiente etapa, después de validar una entrega real. La implementación actual no envía respuestas, descarga adjuntos ni importa conversaciones anteriores. Un DM con adjuntos y sin texto queda registrado por su identificador y fecha.

## Preparar el entorno de prueba

1. Usar un despliegue de prueba accesible por HTTPS y un proyecto de Supabase de prueba. Aplicar allí la migración `supabase/migrations/20261113124236_crm_inbound_messages.sql`.
2. Configurar las variables del despliegue de prueba. Guardar los secretos en el panel de hosting y usar el ID de la cuenta profesional que muestra Meta, no el nombre de usuario.

   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL de Supabase del entorno de prueba |
   | `CRM_SUPABASE_SECRET_KEY` | Clave de servidor de ese proyecto de Supabase |
   | `INSTAGRAM_ACCOUNT_ID` | ID de la cuenta profesional de Instagram |
   | `INSTAGRAM_APP_SECRET` | App Secret de Meta |
   | `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` | Token aleatorio elegido para verificar el webhook, distinto del App Secret |

3. En [Meta for Developers](https://developers.facebook.com/apps/), abrir la aplicación que administrará la cuenta profesional, configurar **Instagram API with Instagram Login** y agregar los permisos `instagram_business_basic` e `instagram_business_manage_messages`. Autorizar la cuenta profesional y suscribir **messages** para esa cuenta. La URL de callback es `https://DOMINIO-DE-PRUEBA/api/webhooks/instagram`. Usar el mismo token de verificación del paso anterior. Si Meta exige acceso avanzado o revisión para entregar mensajes de una cuenta externa, completar ese requisito antes de la prueba externa.
4. Enviar un DM de prueba sin datos de clientes. Comprobar en Supabase que aparece una fila con el canal, el ID de la cuenta, el ID del remitente, el identificador del mensaje, el texto y la fecha. Enviar otro mensaje de la misma cuenta y comprobar que ambas filas mantienen el mismo remitente y tienen distinto ID de mensaje. Una retransmisión de la misma entrega conserva una sola fila por mensaje.
5. Verificar que los roles `anon` y `authenticated` no pueden leer la tabla. Retirar la suscripción de prueba o desactivar el receptor al terminar si todavía no se habilitará la sincronización.

Referencias [API de Instagram de Meta](https://www.postman.com/meta/instagram/collection/6yqw8pt/instagram-api) y [webhooks de Instagram](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-instagram/).

## Conectar HubSpot después de la prueba

El proceso de sincronización debe resolver el nombre visible y el usuario mediante la API oficial de Instagram, buscar o crear un contacto con una identidad estable por canal y cuenta, y guardar cada mensaje como nota. Una tarea abierta cubre el seguimiento de una consulta comercial. La publicación del webhook mantiene los mensajes en Supabase durante una interrupción del CRM. El proceso que los envíe a HubSpot debe registrar el avance y recuperar las escrituras pendientes.

En HubSpot, un administrador con acceso a herramientas de desarrollo puede preparar una [Service Key](https://developers.hubspot.com/changelog/service-keys) con los permisos mínimos de los endpoints de CRM que se utilicen. La conexión de HubSpot con ChatGPT sirve para revisar el portal y la clave permite que el proceso desplegado escriba directamente en el CRM.

Para WhatsApp Business se puede sumar un receptor separado de Cloud API que genere el mismo formato de registro, usando el ID del número empresarial como `account_id`. Cada identidad queda vinculada a su canal hasta que el cliente confirme un dato de contacto que permita asociarla a un contacto existente.
