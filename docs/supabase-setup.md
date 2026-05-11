# Configuración de Supabase

Esta guía habilita el panel privado de Víctor Abadie Inmobiliaria con Auth, Postgres y Storage.

## 1. Crear proyecto

1. Entrar a Supabase.
2. Crear un proyecto nuevo.
3. Esperar a que termine la provisión de la base de datos.

## 2. Obtener claves

En Project Settings > API copiar:

- Project URL
- Publishable key

Si tu proyecto todavía muestra `anon key`, también sirve como fallback.

## 3. Crear `.env.local`

Crear un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Fallback soportado:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

No usar `service_role` en el frontend ni en variables `NEXT_PUBLIC_*`.

## 4. Ejecutar SQL

Abrir Supabase Dashboard > SQL Editor y ejecutar completo:

```text
supabase/schema.sql
```

Ese script crea:

- `admin_users`
- `properties`
- `property_images`
- trigger `updated_at`
- RLS
- políticas de lectura pública y escritura solo admin
- bucket `property-images` cuando el proyecto permite crearlo por SQL

## 5. Crear bucket manual si hace falta

Si el bucket no se creó por SQL:

1. Supabase Dashboard > Storage.
2. New bucket.
3. Nombre: `property-images`.
4. Activar Public bucket.

Las políticas de `storage.objects` del SQL permiten lectura pública y escritura solo a usuarios incluidos en `admin_users`.

## 6. Crear usuario administrador

1. Ir a Authentication > Users.
2. Crear usuario con email y contraseña.
3. Copiar el `user_id`.
4. Ejecutar:

```sql
insert into public.admin_users (user_id, email, role)
values ('USER_ID_AQUI', 'correo@ejemplo.com', 'admin');
```

## 7. Correr el proyecto

```bash
npm install
npm run dev
```

Entrar a:

```text
http://localhost:3000/admin/login
```

## 8. Cargar primera propiedad

1. Iniciar sesión.
2. Entrar a `Nueva propiedad`.
3. Completar datos básicos.
4. Guardar.
5. Subir imágenes.
6. Marcar una imagen como principal.
7. Confirmar que `Publicada` esté activo.
8. Revisar `/propiedades`.

## Problemas comunes

### "No autorizado"

El usuario existe en Supabase Auth pero no está en `admin_users`. Insertar su `user_id` en esa tabla.

### No suben imágenes

Revisar:

- El bucket `property-images` existe.
- Es público.
- Las políticas de storage fueron ejecutadas.
- El usuario está en `admin_users`.
- El archivo pesa menos de 5 MB y es JPG, PNG o WEBP.

### No aparecen propiedades públicas

Revisar que la propiedad tenga `published = true`. Si Supabase no está configurado, la web usa fallback desde `src/data/properties.json`.

## Deploy en Vercel

En Project Settings > Environment Variables agregar:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

No agregar `service_role`.
