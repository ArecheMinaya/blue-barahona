alter table public.orders
  add column if not exists fulfillment_status text not null default 'confirmed',
  add column if not exists fulfillment_timeline jsonb not null default '{}'::jsonb,
  add column if not exists carrier text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text,
  add column if not exists estimated_delivery timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_fulfillment_status_check'
  ) then
    alter table public.orders
      add constraint orders_fulfillment_status_check
      check (
        fulfillment_status in (
          'confirmed',
          'processing',
          'shipped',
          'out_for_delivery',
          'delivered'
        )
      );
  end if;
end
$$;

update public.orders
set fulfillment_status = coalesce(fulfillment_status, 'confirmed'),
    fulfillment_timeline = case
      when fulfillment_timeline is null or fulfillment_timeline = '{}'::jsonb
        then jsonb_build_object('confirmed', created_at)
      else fulfillment_timeline
    end,
    carrier = coalesce(carrier, 'DHL Express'),
    estimated_delivery = coalesce(estimated_delivery, created_at + interval '3 day');
