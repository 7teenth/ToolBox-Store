alter table "public"."product_image" drop column "order";

alter table "public"."product_image" add column "show_order" smallint not null default '0'::smallint;


