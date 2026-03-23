create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null,
  country text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  street_address text not null,
  apartment text,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists addresses_user_default_idx
  on public.addresses (user_id)
  where is_default = true;

create index if not exists addresses_user_created_idx
  on public.addresses (user_id, created_at desc);

create table if not exists public.bag_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_slug text not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, product_slug)
);

create index if not exists bag_items_user_idx
  on public.bag_items (user_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null check (status in ('awaiting_payment', 'paid', 'payment_failed', 'cancelled')),
  subtotal numeric(12, 2) not null,
  shipping_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null,
  currency text not null default 'usd',
  stripe_payment_intent_id text unique,
  shipping_address_id uuid references public.addresses (id) on delete set null,
  shipping_address_snapshot jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_user_created_idx
  on public.orders (user_id, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null,
  total_price numeric(12, 2) not null,
  product_snapshot jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists order_items_order_idx
  on public.order_items (order_id);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger addresses_set_updated_at
before update on public.addresses
for each row
execute function public.set_updated_at();

create trigger bag_items_set_updated_at
before update on public.bag_items
for each row
execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        avatar_url = excluded.avatar_url,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.bag_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "addresses_manage_own"
on public.addresses
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "bag_items_manage_own"
on public.bag_items
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "orders_select_own"
on public.orders
for select
using (auth.uid() = user_id);

create policy "orders_manage_own"
on public.orders
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "order_items_select_own"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders
    where public.orders.id = order_items.order_id
      and public.orders.user_id = auth.uid()
  )
);

create policy "order_items_manage_own"
on public.order_items
for all
using (
  exists (
    select 1
    from public.orders
    where public.orders.id = order_items.order_id
      and public.orders.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.orders
    where public.orders.id = order_items.order_id
      and public.orders.user_id = auth.uid()
  )
);
