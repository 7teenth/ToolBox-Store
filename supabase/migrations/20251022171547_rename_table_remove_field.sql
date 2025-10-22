drop trigger if exists "handle_updated_at" on "public"."customer_address";

revoke delete on table "public"."customer_address" from "anon";

revoke insert on table "public"."customer_address" from "anon";

revoke references on table "public"."customer_address" from "anon";

revoke select on table "public"."customer_address" from "anon";

revoke trigger on table "public"."customer_address" from "anon";

revoke truncate on table "public"."customer_address" from "anon";

revoke update on table "public"."customer_address" from "anon";

revoke delete on table "public"."customer_address" from "authenticated";

revoke insert on table "public"."customer_address" from "authenticated";

revoke references on table "public"."customer_address" from "authenticated";

revoke select on table "public"."customer_address" from "authenticated";

revoke trigger on table "public"."customer_address" from "authenticated";

revoke truncate on table "public"."customer_address" from "authenticated";

revoke update on table "public"."customer_address" from "authenticated";

revoke delete on table "public"."customer_address" from "service_role";

revoke insert on table "public"."customer_address" from "service_role";

revoke references on table "public"."customer_address" from "service_role";

revoke select on table "public"."customer_address" from "service_role";

revoke trigger on table "public"."customer_address" from "service_role";

revoke truncate on table "public"."customer_address" from "service_role";

revoke update on table "public"."customer_address" from "service_role";

alter table "public"."customer_address" drop constraint "customer_address_customer_id_fkey";

alter table "public"."order" drop constraint "order_customer_address_id_fkey";

alter table "public"."customer_address" drop constraint "customer_address_pkey";

drop index if exists "public"."customer_address_pkey";

drop table "public"."customer_address";

create table "public"."order_shipping_address" (
    "id" uuid not null default gen_random_uuid(),
    "region" character varying not null,
    "city" character varying not null,
    "address" character varying not null,
    "postal_code" character varying not null,
    "phone" character varying not null,
    "customer_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone
);


alter table "public"."order_shipping_address" enable row level security;

alter table "public"."customer" drop column "password";

alter table "public"."order" drop column "customer_address_id";

alter table "public"."order" add column "order_shipping_address_id" uuid not null;

CREATE UNIQUE INDEX customer_address_pkey ON public.order_shipping_address USING btree (id);

alter table "public"."order_shipping_address" add constraint "customer_address_pkey" PRIMARY KEY using index "customer_address_pkey";

alter table "public"."order" add constraint "order_order_shipping_address_id_fkey" FOREIGN KEY (order_shipping_address_id) REFERENCES order_shipping_address(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "public"."order" validate constraint "order_order_shipping_address_id_fkey";

alter table "public"."order_shipping_address" add constraint "customer_address_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."order_shipping_address" validate constraint "customer_address_customer_id_fkey";

grant delete on table "public"."order_shipping_address" to "anon";

grant insert on table "public"."order_shipping_address" to "anon";

grant references on table "public"."order_shipping_address" to "anon";

grant select on table "public"."order_shipping_address" to "anon";

grant trigger on table "public"."order_shipping_address" to "anon";

grant truncate on table "public"."order_shipping_address" to "anon";

grant update on table "public"."order_shipping_address" to "anon";

grant delete on table "public"."order_shipping_address" to "authenticated";

grant insert on table "public"."order_shipping_address" to "authenticated";

grant references on table "public"."order_shipping_address" to "authenticated";

grant select on table "public"."order_shipping_address" to "authenticated";

grant trigger on table "public"."order_shipping_address" to "authenticated";

grant truncate on table "public"."order_shipping_address" to "authenticated";

grant update on table "public"."order_shipping_address" to "authenticated";

grant delete on table "public"."order_shipping_address" to "service_role";

grant insert on table "public"."order_shipping_address" to "service_role";

grant references on table "public"."order_shipping_address" to "service_role";

grant select on table "public"."order_shipping_address" to "service_role";

grant trigger on table "public"."order_shipping_address" to "service_role";

grant truncate on table "public"."order_shipping_address" to "service_role";

grant update on table "public"."order_shipping_address" to "service_role";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.order_shipping_address FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


