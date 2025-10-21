SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
COMMENT ON SCHEMA "public" IS 'standard public schema';
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
SET default_tablespace = '';
SET default_table_access_method = "heap";
CREATE TABLE IF NOT EXISTS "public"."attribute" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying NOT NULL,
    "name" character varying NOT NULL,
    "attribute_type_id" "uuid" NOT NULL,
    "attribute_filter_ui_type_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."attribute" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."attribute_filter_ui_type" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."attribute_filter_ui_type" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."attribute_type" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."attribute_type" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."brand" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying NOT NULL,
    "name" character varying NOT NULL,
    "image_url" character varying,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."brand" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."category" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "parent_id" "uuid",
    "slug" character varying NOT NULL,
    "name" character varying NOT NULL,
    "image_url" character varying,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."category" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."customer" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" character varying NOT NULL,
    "password" character varying NOT NULL,
    "first_name" character varying NOT NULL,
    "last_name" character varying NOT NULL,
    "middle_name" character varying,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."customer" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."customer_address" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "region" character varying NOT NULL,
    "city" character varying NOT NULL,
    "address" character varying NOT NULL,
    "postal_code" character varying NOT NULL,
    "phone" character varying NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."customer_address" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."link_attribute_category" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "attribute_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."link_attribute_category" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."link_attribute_product" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "attribute_id" "uuid" NOT NULL,
    "value" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."link_attribute_product" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."link_product_badge_product" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "product_id" "uuid",
    "product_badge_id" "uuid",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."link_product_badge_product" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."order" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "comment" "text",
    "total" numeric NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "customer_address_id" "uuid" NOT NULL,
    "order_status_id" "uuid" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."order" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."order_item" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "quantity" smallint NOT NULL,
    "price" numeric NOT NULL,
    "discount" smallint,
    "order_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."order_item" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."order_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."order_status" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."payment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "amount" numeric NOT NULL,
    "provider" character varying NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "order_id" "uuid" NOT NULL,
    "payment_status_id" "uuid" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."payment" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."payment_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."payment_status" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."product" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "price" numeric NOT NULL,
    "discont" smallint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "product_status_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "brand_id" "uuid" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL
);
ALTER TABLE "public"."product" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."product_badge" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying NOT NULL,
    "name" character varying NOT NULL,
    "color" character varying DEFAULT '#fff'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."product_badge" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."product_image" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "url" character varying NOT NULL,
    "order" smallint DEFAULT '0'::smallint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "product_id" "uuid" NOT NULL
);
ALTER TABLE "public"."product_image" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."product_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."product_status" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."review" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rating" smallint NOT NULL,
    "comment" "text",
    "product_id" "uuid" NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."review" OWNER TO "postgres";
ALTER TABLE ONLY "public"."attribute_filter_ui_type"
    ADD CONSTRAINT "attribute_filter_ui_type_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."attribute_filter_ui_type"
    ADD CONSTRAINT "attribute_filter_ui_type_type_key" UNIQUE ("type");
ALTER TABLE ONLY "public"."attribute"
    ADD CONSTRAINT "attribute_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."attribute"
    ADD CONSTRAINT "attribute_slug_key" UNIQUE ("slug");
ALTER TABLE ONLY "public"."attribute_type"
    ADD CONSTRAINT "attribute_type_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."attribute_type"
    ADD CONSTRAINT "attribute_type_type_key" UNIQUE ("type");
ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "brand_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "brand_slug_key" UNIQUE ("slug");
ALTER TABLE ONLY "public"."category"
    ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."category"
    ADD CONSTRAINT "category_slug_key" UNIQUE ("slug");
ALTER TABLE ONLY "public"."customer_address"
    ADD CONSTRAINT "customer_address_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."customer"
    ADD CONSTRAINT "customer_email_key" UNIQUE ("email");
ALTER TABLE ONLY "public"."customer"
    ADD CONSTRAINT "customer_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."link_attribute_category"
    ADD CONSTRAINT "link_attribute_category_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."link_attribute_product"
    ADD CONSTRAINT "link_attribute_product_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."link_product_badge_product"
    ADD CONSTRAINT "link_product_badge_product_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."order_item"
    ADD CONSTRAINT "order_item_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."order"
    ADD CONSTRAINT "order_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."order_status"
    ADD CONSTRAINT "order_status_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."payment_status"
    ADD CONSTRAINT "payment_status_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."product_badge"
    ADD CONSTRAINT "product_badge_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."product_badge"
    ADD CONSTRAINT "product_badge_slug_key" UNIQUE ("slug");
ALTER TABLE ONLY "public"."product_image"
    ADD CONSTRAINT "product_image_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."product"
    ADD CONSTRAINT "product_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."product"
    ADD CONSTRAINT "product_slug_key" UNIQUE ("slug");
ALTER TABLE ONLY "public"."product_status"
    ADD CONSTRAINT "product_status_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."product_status"
    ADD CONSTRAINT "product_status_slug_key" UNIQUE ("slug");
ALTER TABLE ONLY "public"."review"
    ADD CONSTRAINT "review_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."attribute"
    ADD CONSTRAINT "attribute_attribute_filter_ui_type_id_fkey" FOREIGN KEY ("attribute_filter_ui_type_id") REFERENCES "public"."attribute_filter_ui_type"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."attribute"
    ADD CONSTRAINT "attribute_attribute_type_id_fkey" FOREIGN KEY ("attribute_type_id") REFERENCES "public"."attribute_type"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."customer_address"
    ADD CONSTRAINT "customer_address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."link_attribute_category"
    ADD CONSTRAINT "link_attribute_category_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "public"."attribute"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."link_attribute_category"
    ADD CONSTRAINT "link_attribute_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."link_attribute_product"
    ADD CONSTRAINT "link_attribute_product_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "public"."attribute"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."link_attribute_product"
    ADD CONSTRAINT "link_attribute_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."link_product_badge_product"
    ADD CONSTRAINT "link_product_badge_product_product_badge_id_fkey" FOREIGN KEY ("product_badge_id") REFERENCES "public"."product_badge"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."link_product_badge_product"
    ADD CONSTRAINT "link_product_badge_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."order"
    ADD CONSTRAINT "order_customer_address_id_fkey" FOREIGN KEY ("customer_address_id") REFERENCES "public"."customer_address"("id") ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."order"
    ADD CONSTRAINT "order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."order_item"
    ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."order_item"
    ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."order"
    ADD CONSTRAINT "order_order_status_id_fkey" FOREIGN KEY ("order_status_id") REFERENCES "public"."order_status"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_payment_status_id_fkey" FOREIGN KEY ("payment_status_id") REFERENCES "public"."payment_status"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."product"
    ADD CONSTRAINT "product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."product"
    ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."product_image"
    ADD CONSTRAINT "product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."product"
    ADD CONSTRAINT "product_product_status_id_fkey" FOREIGN KEY ("product_status_id") REFERENCES "public"."product_status"("id") ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."review"
    ADD CONSTRAINT "review_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."review"
    ADD CONSTRAINT "review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "public"."attribute" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."attribute_filter_ui_type" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."attribute_type" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."brand" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."customer_address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."link_attribute_category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."link_attribute_product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."link_product_badge_product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."order_item" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."order_status" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."payment_status" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product_badge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product_image" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product_status" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."review" ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT ALL ON TABLE "public"."attribute" TO "anon";
GRANT ALL ON TABLE "public"."attribute" TO "authenticated";
GRANT ALL ON TABLE "public"."attribute" TO "service_role";
GRANT ALL ON TABLE "public"."attribute_filter_ui_type" TO "anon";
GRANT ALL ON TABLE "public"."attribute_filter_ui_type" TO "authenticated";
GRANT ALL ON TABLE "public"."attribute_filter_ui_type" TO "service_role";
GRANT ALL ON TABLE "public"."attribute_type" TO "anon";
GRANT ALL ON TABLE "public"."attribute_type" TO "authenticated";
GRANT ALL ON TABLE "public"."attribute_type" TO "service_role";
GRANT ALL ON TABLE "public"."brand" TO "anon";
GRANT ALL ON TABLE "public"."brand" TO "authenticated";
GRANT ALL ON TABLE "public"."brand" TO "service_role";
GRANT ALL ON TABLE "public"."category" TO "anon";
GRANT ALL ON TABLE "public"."category" TO "authenticated";
GRANT ALL ON TABLE "public"."category" TO "service_role";
GRANT ALL ON TABLE "public"."customer" TO "anon";
GRANT ALL ON TABLE "public"."customer" TO "authenticated";
GRANT ALL ON TABLE "public"."customer" TO "service_role";
GRANT ALL ON TABLE "public"."customer_address" TO "anon";
GRANT ALL ON TABLE "public"."customer_address" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_address" TO "service_role";
GRANT ALL ON TABLE "public"."link_attribute_category" TO "anon";
GRANT ALL ON TABLE "public"."link_attribute_category" TO "authenticated";
GRANT ALL ON TABLE "public"."link_attribute_category" TO "service_role";
GRANT ALL ON TABLE "public"."link_attribute_product" TO "anon";
GRANT ALL ON TABLE "public"."link_attribute_product" TO "authenticated";
GRANT ALL ON TABLE "public"."link_attribute_product" TO "service_role";
GRANT ALL ON TABLE "public"."link_product_badge_product" TO "anon";
GRANT ALL ON TABLE "public"."link_product_badge_product" TO "authenticated";
GRANT ALL ON TABLE "public"."link_product_badge_product" TO "service_role";
GRANT ALL ON TABLE "public"."order" TO "anon";
GRANT ALL ON TABLE "public"."order" TO "authenticated";
GRANT ALL ON TABLE "public"."order" TO "service_role";
GRANT ALL ON TABLE "public"."order_item" TO "anon";
GRANT ALL ON TABLE "public"."order_item" TO "authenticated";
GRANT ALL ON TABLE "public"."order_item" TO "service_role";
GRANT ALL ON TABLE "public"."order_status" TO "anon";
GRANT ALL ON TABLE "public"."order_status" TO "authenticated";
GRANT ALL ON TABLE "public"."order_status" TO "service_role";
GRANT ALL ON TABLE "public"."payment" TO "anon";
GRANT ALL ON TABLE "public"."payment" TO "authenticated";
GRANT ALL ON TABLE "public"."payment" TO "service_role";
GRANT ALL ON TABLE "public"."payment_status" TO "anon";
GRANT ALL ON TABLE "public"."payment_status" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_status" TO "service_role";
GRANT ALL ON TABLE "public"."product" TO "anon";
GRANT ALL ON TABLE "public"."product" TO "authenticated";
GRANT ALL ON TABLE "public"."product" TO "service_role";
GRANT ALL ON TABLE "public"."product_badge" TO "anon";
GRANT ALL ON TABLE "public"."product_badge" TO "authenticated";
GRANT ALL ON TABLE "public"."product_badge" TO "service_role";
GRANT ALL ON TABLE "public"."product_image" TO "anon";
GRANT ALL ON TABLE "public"."product_image" TO "authenticated";
GRANT ALL ON TABLE "public"."product_image" TO "service_role";
GRANT ALL ON TABLE "public"."product_status" TO "anon";
GRANT ALL ON TABLE "public"."product_status" TO "authenticated";
GRANT ALL ON TABLE "public"."product_status" TO "service_role";
GRANT ALL ON TABLE "public"."review" TO "anon";
GRANT ALL ON TABLE "public"."review" TO "authenticated";
GRANT ALL ON TABLE "public"."review" TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
RESET ALL;
create policy "Allow delete products"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'products'::text));
create policy "Allow insert to products bucket"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'products'::text));
create policy "Allow read products"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'products'::text));
