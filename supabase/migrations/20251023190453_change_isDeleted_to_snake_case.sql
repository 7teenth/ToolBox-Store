alter table "public"."customer" drop column "isDeleted";

alter table "public"."customer" add column "is_deleted" boolean not null default false;

alter table "public"."order" drop column "isDeleted";

alter table "public"."order" add column "is_deleted" boolean not null default false;

alter table "public"."payment" drop column "isDeleted";

alter table "public"."payment" add column "is_deleted" boolean not null default false;

alter table "public"."product" drop column "isDeleted";

alter table "public"."product" add column "is_deleted" boolean not null default false;


