# Supabase policies for public properties

The public website reads published properties with the anon key. Do not use `service_role` in frontend code.

Required public read policies:

```sql
drop policy if exists "Public can read published properties" on public.properties;
create policy "Public can read published properties"
on public.properties
for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Public can read images of published properties" on public.property_images;
create policy "Public can read images of published properties"
on public.property_images
for select
to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.properties
    where properties.id = property_images.property_id
      and properties.published = true
  )
);
```

The current schema uses hard delete for properties. Because `property_images.property_id` has `on delete cascade`, deleted properties and their image rows should disappear from public queries immediately.

If a future migration adds soft delete (`deleted_at`), update public reads and policies to add:

```sql
deleted_at is null
```

Keep `property-images` as a public bucket for image delivery, with write/update/delete restricted to authenticated admin users.
