# Usuarios administrativos

Este proyecto usa Supabase Auth para login y la tabla `public.admin_users` para autorizar el acceso al panel privado.

## Roles

- `owner`: puede ver dashboard, cargar, editar, publicar, ocultar, destacar y eliminar propiedades. También queda reservado para futuras configuraciones avanzadas y gestión de usuarios.
- `editor`: puede ver dashboard, cargar, editar, publicar, ocultar y destacar propiedades. No puede eliminar propiedades definitivamente ni gestionar usuarios.

Los usuarios antiguos con rol `admin` se tratan como `owner` para no bloquear instalaciones existentes.

## Crear un usuario administrador

1. Ir a Supabase Dashboard.
2. Abrir `Authentication > Users`.
3. Hacer clic en `Add user`.
4. Crear email y contraseña.
5. Copiar el `User UID`.
6. Insertar el usuario en `public.admin_users`.

Ejemplo para editor:

```sql
insert into public.admin_users (user_id, email, role)
values ('USER_ID', 'correo@ejemplo.com', 'editor');
```

Ejemplo para owner:

```sql
insert into public.admin_users (user_id, email, role)
values ('USER_ID', 'correo@ejemplo.com', 'owner');
```

## Cambiar rol a owner

```sql
update public.admin_users
set role = 'owner'
where email = 'correo@ejemplo.com';
```

## Cambiar rol a editor

```sql
update public.admin_users
set role = 'editor'
where email = 'correo@ejemplo.com';
```

## Permisos

El owner puede todo dentro del panel.

El editor puede cargar, editar, publicar, ocultar y destacar propiedades, pero no puede eliminar definitivamente. La interfaz oculta o deshabilita esa acción y la función de eliminación vuelve a validar el rol antes de borrar.

Para endurecimiento completo a nivel base de datos, conviene ajustar las políticas RLS para que `delete` en `properties` solo esté permitido para `role = 'owner'`.

## Cambio de contraseña

Un usuario autenticado puede entrar a:

```txt
/admin/mi-cuenta
```

Desde ahí puede actualizar su contraseña. Supabase requiere que el usuario tenga sesión activa para `auth.updateUser`.

La versión usada del cliente actualiza contraseña con:

```ts
supabase.auth.updateUser({ password: newPassword })
```

El campo de contraseña actual queda como validación visual del panel. Si una versión futura del SDK soporta `currentPassword` tipado en este proyecto, se puede sumar esa validación en la llamada.

## Recuperación de contraseña

Desde el login existe el enlace:

```txt
/admin/recuperar-password
```

El flujo envía un email con Supabase Auth y redirige a:

```txt
/admin/restablecer-password
```

Ahí el usuario define una nueva contraseña.

## Configuración necesaria en Supabase

Ir a:

```txt
Authentication > URL Configuration
```

Configurar:

```txt
Site URL:
https://victor-abadie-web.vercel.app
```

Redirect URLs:

```txt
http://localhost:3000/**
https://victor-abadie-web.vercel.app/**
```

Si luego se compra dominio propio, agregar también:

```txt
https://dominio-propio.com/**
```

## Email provider

Supabase debe tener activo el envío de emails de autenticación. El servicio default de Supabase tiene límites; para producción o uso frecuente conviene configurar SMTP propio.

## Seguridad

- No usar `service_role` en frontend.
- No exponer claves privadas.
- Solo usuarios incluidos en `public.admin_users` pueden entrar al panel.
- Revisar que el usuario tenga el rol correcto si ve `No autorizado`.
- Para permisos críticos definitivos, reforzar también RLS en Supabase.
