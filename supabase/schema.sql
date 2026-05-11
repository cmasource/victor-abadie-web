create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text default 'admin',
  created_at timestamptz default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  operation text not null,
  type text not null,
  title text not null,
  description text,
  excerpt text,
  location text,
  city text,
  neighborhood text,
  status text default 'Disponible',
  price text default 'Consultar precio',
  numeric_price numeric null,
  currency text,
  area text,
  lot_area text,
  bedrooms integer null,
  bathrooms integer null,
  rooms integer null,
  garage boolean default false,
  featured boolean default false,
  published boolean default true,
  main_image_url text,
  features text[] default '{}',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  url text not null,
  path text,
  alt text,
  sort_order integer default 0,
  is_main boolean default false,
  created_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
before update on public.properties
for each row
execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

drop policy if exists "Admins can read own admin record" on public.admin_users;
create policy "Admins can read own admin record"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read published properties" on public.properties;
create policy "Public can read published properties"
on public.properties
for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Admins can insert properties" on public.properties;
create policy "Admins can insert properties"
on public.properties
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update properties" on public.properties;
create policy "Admins can update properties"
on public.properties
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete properties" on public.properties;
create policy "Admins can delete properties"
on public.properties
for delete
to authenticated
using (public.is_admin());

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

drop policy if exists "Admins can insert property images" on public.property_images;
create policy "Admins can insert property images"
on public.property_images
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update property images" on public.property_images;
create policy "Admins can update property images"
on public.property_images
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete property images" on public.property_images;
create policy "Admins can delete property images"
on public.property_images
for delete
to authenticated
using (public.is_admin());

-- Storage setup:
-- Supabase allows creating buckets from SQL in many projects, but if this fails,
-- create it manually from Dashboard > Storage > New bucket:
-- name: property-images, public bucket: enabled.
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read property images bucket" on storage.objects;
create policy "Public can read property images bucket"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'property-images');

drop policy if exists "Admins can upload property images" on storage.objects;
create policy "Admins can upload property images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "Admins can update property images bucket" on storage.objects;
create policy "Admins can update property images bucket"
on storage.objects
for update
to authenticated
using (bucket_id = 'property-images' and public.is_admin())
with check (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "Admins can delete property images bucket" on storage.objects;
create policy "Admins can delete property images bucket"
on storage.objects
for delete
to authenticated
using (bucket_id = 'property-images' and public.is_admin());
