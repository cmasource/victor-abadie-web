begin;

create table public.crm_inbound_messages (
  channel text not null check (channel in ('instagram', 'whatsapp')),
  account_id text not null,
  message_id text not null,
  sender_id text not null,
  received_at timestamptz not null,
  message_text text,
  primary key (channel, account_id, message_id)
);

alter table public.crm_inbound_messages enable row level security;

revoke all on public.crm_inbound_messages from public, anon, authenticated, service_role;
grant select, insert on public.crm_inbound_messages to service_role;

commit;
