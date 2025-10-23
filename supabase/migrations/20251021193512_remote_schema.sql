create extension if not exists "moddatetime" with schema "extensions";

alter table "public"."attribute" alter column "updated_at" drop default;

alter table "public"."attribute" alter column "updated_at" drop not null;

alter table "public"."attribute_filter_ui_type" alter column "updated_at" drop default;

alter table "public"."attribute_filter_ui_type" alter column "updated_at" drop not null;

alter table "public"."attribute_type" alter column "updated_at" drop default;

alter table "public"."attribute_type" alter column "updated_at" drop not null;

alter table "public"."brand" alter column "updated_at" drop default;

alter table "public"."brand" alter column "updated_at" drop not null;

alter table "public"."category" alter column "updated_at" drop default;

alter table "public"."category" alter column "updated_at" drop not null;

alter table "public"."customer" alter column "updated_at" drop default;

alter table "public"."customer" alter column "updated_at" drop not null;

alter table "public"."customer_address" alter column "updated_at" drop default;

alter table "public"."customer_address" alter column "updated_at" drop not null;

alter table "public"."link_attribute_category" alter column "updated_at" drop default;

alter table "public"."link_attribute_category" alter column "updated_at" drop not null;

alter table "public"."link_attribute_product" alter column "updated_at" drop default;

alter table "public"."link_attribute_product" alter column "updated_at" drop not null;

alter table "public"."link_product_badge_product" alter column "updated_at" drop default;

alter table "public"."link_product_badge_product" alter column "updated_at" drop not null;

alter table "public"."order" alter column "updated_at" drop default;

alter table "public"."order" alter column "updated_at" drop not null;

alter table "public"."order_item" alter column "updated_at" drop default;

alter table "public"."order_item" alter column "updated_at" drop not null;

alter table "public"."order_status" alter column "updated_at" drop default;

alter table "public"."order_status" alter column "updated_at" drop not null;

alter table "public"."payment" alter column "updated_at" drop default;

alter table "public"."payment" alter column "updated_at" drop not null;

alter table "public"."payment_status" alter column "updated_at" drop default;

alter table "public"."payment_status" alter column "updated_at" drop not null;

alter table "public"."product" alter column "updated_at" drop default;

alter table "public"."product" alter column "updated_at" drop not null;

alter table "public"."product_badge" alter column "updated_at" drop default;

alter table "public"."product_badge" alter column "updated_at" drop not null;

alter table "public"."product_image" alter column "updated_at" drop default;

alter table "public"."product_image" alter column "updated_at" drop not null;

alter table "public"."product_status" alter column "updated_at" drop default;

alter table "public"."product_status" alter column "updated_at" drop not null;

alter table "public"."review" alter column "updated_at" drop default;

alter table "public"."review" alter column "updated_at" drop not null;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.attribute FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.attribute_filter_ui_type FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.attribute_type FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.brand FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.category FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.customer FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.customer_address FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.link_attribute_category FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.link_attribute_product FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.link_product_badge_product FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public."order" FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.order_item FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.order_status FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payment FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payment_status FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.product FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.product_badge FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.product_image FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.product_status FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.review FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');
