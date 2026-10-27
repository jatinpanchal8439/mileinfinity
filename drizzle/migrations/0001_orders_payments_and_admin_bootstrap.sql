-- Payment tracking + state on orders
alter table public.orders add column if not exists state text;
alter table public.orders add column if not exists payment_method text not null default 'razorpay';
alter table public.orders add column if not exists payment_status text not null default 'pending';
alter table public.orders add column if not exists razorpay_order_id text;
alter table public.orders add column if not exists razorpay_payment_id text;

-- Data API grants aligned with existing RLS policies (grants were missing)
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
grant insert on public.orders to anon, authenticated;
grant select on public.orders to authenticated;
grant all on public.orders to service_role;
grant insert on public.order_items to anon, authenticated;
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

-- Bootstrap: the very first account to sign up becomes the store admin
create or replace function public.bootstrap_first_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_count integer;
begin
  select count(*) into admin_count from public.user_roles where role = 'admin';
  if admin_count = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.bootstrap_first_admin();
