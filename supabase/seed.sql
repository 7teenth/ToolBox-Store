-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert initial data for attribute_filter_ui_type
INSERT INTO public.attribute_filter_ui_type (id, type, created_at) VALUES
(gen_random_uuid(), 'checkbox', NOW()),
(gen_random_uuid(), 'radio', NOW()),
(gen_random_uuid(), 'range', NOW()),
(gen_random_uuid(), 'select', NOW()),
(gen_random_uuid(), 'color', NOW());

-- Insert initial data for attribute_type
INSERT INTO public.attribute_type (id, type, created_at) VALUES
(gen_random_uuid(), 'text', NOW()),
(gen_random_uuid(), 'number', NOW()),
(gen_random_uuid(), 'boolean', NOW()),
(gen_random_uuid(), 'color', NOW()),
(gen_random_uuid(), 'size', NOW());

-- Insert initial data for product_status
INSERT INTO public.product_status (id, name, slug, created_at) VALUES
(gen_random_uuid(), 'Active', 'active', NOW()),
(gen_random_uuid(), 'Draft', 'draft', NOW()),
(gen_random_uuid(), 'Archived', 'archived', NOW()),
(gen_random_uuid(), 'Out of Stock', 'out-of-stock', NOW());

-- Insert initial data for order_status
INSERT INTO public.order_status (id, name, created_at) VALUES
(gen_random_uuid(), 'Pending', NOW()),
(gen_random_uuid(), 'Confirmed', NOW()),
(gen_random_uuid(), 'Processing', NOW()),
(gen_random_uuid(), 'Shipped', NOW()),
(gen_random_uuid(), 'Delivered', NOW()),
(gen_random_uuid(), 'Cancelled', NOW());

-- Insert initial data for payment_status
INSERT INTO public.payment_status (id, name, created_at) VALUES
(gen_random_uuid(), 'Pending', NOW()),
(gen_random_uuid(), 'Completed', NOW()),
(gen_random_uuid(), 'Failed', NOW()),
(gen_random_uuid(), 'Refunded', NOW()),
(gen_random_uuid(), 'Cancelled', NOW());

-- Insert initial data for product_badge
INSERT INTO public.product_badge (id, slug, name, color, created_at) VALUES
(gen_random_uuid(), 'new', 'New', '#22c55e', NOW()),
(gen_random_uuid(), 'sale', 'Sale', '#ef4444', NOW()),
(gen_random_uuid(), 'bestseller', 'Bestseller', '#f59e0b', NOW()),
(gen_random_uuid(), 'limited', 'Limited Edition', '#8b5cf6', NOW()),
(gen_random_uuid(), 'featured', 'Featured', '#3b82f6', NOW());

-- Insert initial data for brand
INSERT INTO public.brand (id, slug, name, image_url, created_at) VALUES
(gen_random_uuid(), 'nike', 'Nike', 'https://example.com/images/brands/nike.png', NOW()),
(gen_random_uuid(), 'adidas', 'Adidas', 'https://example.com/images/brands/adidas.png', NOW()),
(gen_random_uuid(), 'apple', 'Apple', 'https://example.com/images/brands/apple.png', NOW()),
(gen_random_uuid(), 'samsung', 'Samsung', 'https://example.com/images/brands/samsung.png', NOW()),
(gen_random_uuid(), 'sony', 'Sony', 'https://example.com/images/brands/sony.png', NOW());

-- Insert initial data for category (with hierarchy)
WITH root_categories AS (
  INSERT INTO public.category (id, parent_id, slug, name, image_url, description, created_at)
  VALUES
  (gen_random_uuid(), NULL, 'electronics', 'Electronics', 'https://example.com/images/categories/electronics.png', 'Latest electronic gadgets and devices', NOW()),
  (gen_random_uuid(), NULL, 'clothing', 'Clothing', 'https://example.com/images/categories/clothing.png', 'Fashionable clothing for everyone', NOW()),
  (gen_random_uuid(), NULL, 'sports', 'Sports', 'https://example.com/images/categories/sports.png', 'Sports equipment and accessories', NOW())
  RETURNING id, slug
),
electronics_sub AS (
  INSERT INTO public.category (id, parent_id, slug, name, image_url, description, created_at)
  SELECT
    gen_random_uuid(),
    (SELECT id FROM root_categories WHERE slug = 'electronics'),
    unnest(ARRAY['smartphones', 'laptops', 'headphones']),
    unnest(ARRAY['Smartphones', 'Laptops', 'Headphones']),
    unnest(ARRAY[
      'https://example.com/images/categories/smartphones.png',
      'https://example.com/images/categories/laptops.png',
      'https://example.com/images/categories/headphones.png'
    ]),
    unnest(ARRAY[
      'Latest smartphones from top brands',
      'Powerful laptops for work and gaming',
      'High-quality audio headphones'
    ]),
    NOW()
  RETURNING id, slug
),
clothing_sub AS (
  INSERT INTO public.category (id, parent_id, slug, name, image_url, description, created_at)
  SELECT
    gen_random_uuid(),
    (SELECT id FROM root_categories WHERE slug = 'clothing'),
    unnest(ARRAY['mens', 'womens', 'kids']),
    unnest(ARRAY['Men''s Clothing', 'Women''s Clothing', 'Kids Clothing']),
    unnest(ARRAY[
      'https://example.com/images/categories/mens.png',
      'https://example.com/images/categories/womens.png',
      'https://example.com/images/categories/kids.png'
    ]),
    unnest(ARRAY[
      'Stylish clothing for men',
      'Fashionable clothing for women',
      'Comfortable clothing for kids'
    ]),
    NOW()
  RETURNING id, slug
)
SELECT 1;

-- Insert initial data for attributes
INSERT INTO public.attribute (id, slug, name, attribute_type_id, attribute_filter_ui_type_id, created_at)
SELECT
  gen_random_uuid(),
  attr.slug,
  attr.name,
  (SELECT id FROM public.attribute_type WHERE type = attr.attribute_type),
  (SELECT id FROM public.attribute_filter_ui_type WHERE type = attr.filter_ui_type),
  NOW()
FROM (VALUES
  ('color', 'Color', 'color', 'color'),
  ('size', 'Size', 'text', 'select'),
  ('weight', 'Weight', 'number', 'range'),
  ('storage', 'Storage', 'text', 'radio'),
  ('material', 'Material', 'text', 'checkbox'),
  ('brand', 'Brand', 'text', 'checkbox'),
  ('wireless', 'Wireless', 'boolean', 'checkbox')
) AS attr(slug, name, attribute_type, filter_ui_type);

-- Link attributes to categories
INSERT INTO public.link_attribute_category (id, attribute_id, category_id, created_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM public.attribute WHERE slug = attr_slug),
  (SELECT id FROM public.category WHERE slug = cat_slug),
  NOW()
FROM (VALUES
  ('color', 'electronics'),
  ('storage', 'smartphones'),
  ('brand', 'smartphones'),
  ('wireless', 'headphones'),
  ('color', 'clothing'),
  ('size', 'clothing'),
  ('material', 'clothing')
) AS links(attr_slug, cat_slug);

-- Insert sample customers
INSERT INTO public.customer (id, email, first_name, last_name, middle_name, created_at) VALUES
(gen_random_uuid(), 'john.doe@example.com', 'John', 'Doe', NULL, NOW()),
(gen_random_uuid(), 'jane.smith@example.com', 'Jane', 'Smith', 'Marie', NOW()),
(gen_random_uuid(), 'mike.johnson@example.com', 'Mike', 'Johnson', NULL, NOW());

-- Insert order shipping addresses
INSERT INTO public.order_shipping_address (id, region, city, address, postal_code, phone, customer_id, created_at)
SELECT
  gen_random_uuid(),
  addr.region,
  addr.city,
  addr.address,
  addr.postal_code,
  addr.phone,
  (SELECT id FROM public.customer WHERE email = addr.customer_email),
  NOW()
FROM (VALUES
  ('California', 'Los Angeles', '123 Main St', '90001', '+1-555-0101', 'john.doe@example.com'),
  ('New York', 'New York', '456 Park Ave', '10001', '+1-555-0102', 'jane.smith@example.com'),
  ('Texas', 'Houston', '789 Oak St', '77001', '+1-555-0103', 'mike.johnson@example.com')
) AS addr(region, city, address, postal_code, phone, customer_email);

-- Insert sample products
INSERT INTO public.product (id, slug, name, description, price, discont, product_status_id, category_id, brand_id, created_at)
SELECT
  gen_random_uuid(),
  prod.slug,
  prod.name,
  prod.description,
  prod.price,
  prod.discont,
  (SELECT id FROM public.product_status WHERE slug = 'active'),
  (SELECT id FROM public.category WHERE slug = prod.category_slug),
  (SELECT id FROM public.brand WHERE slug = prod.brand_slug),
  NOW()
FROM (VALUES
  ('iphone-15-pro', 'iPhone 15 Pro', 'Latest iPhone with advanced features', 999.99, 10, 'smartphones', 'apple'),
  ('galaxy-s24', 'Galaxy S24', 'Powerful Android smartphone', 849.99, 5, 'smartphones', 'samsung'),
  ('macbook-pro', 'MacBook Pro 16"', 'Professional laptop for creatives', 2399.99, NULL, 'laptops', 'apple'),
  ('airpods-pro', 'AirPods Pro', 'Wireless noise cancelling earbuds', 249.99, 15, 'headphones', 'apple'),
  ('nike-air-force', 'Nike Air Force 1', 'Classic white sneakers', 120.00, 20, 'mens', 'nike'),
  ('adidas-ultraboost', 'Adidas Ultraboost', 'Comfortable running shoes', 180.00, NULL, 'sports', 'adidas')
) AS prod(slug, name, description, price, discont, category_slug, brand_slug);

-- Insert product images
INSERT INTO public.product_image (id, url, show_order, product_id, created_at)
SELECT
  gen_random_uuid(),
  img.url,
  img.show_order,
  (SELECT id FROM public.product WHERE slug = img.product_slug),
  NOW()
FROM (VALUES
  ('iphone-15-pro', 'https://example.com/images/products/iphone-15-pro-1.jpg', 0),
  ('iphone-15-pro', 'https://example.com/images/products/iphone-15-pro-2.jpg', 1),
  ('galaxy-s24', 'https://example.com/images/products/galaxy-s24-1.jpg', 0),
  ('macbook-pro', 'https://example.com/images/products/macbook-pro-1.jpg', 0),
  ('airpods-pro', 'https://example.com/images/products/airpods-pro-1.jpg', 0),
  ('nike-air-force', 'https://example.com/images/products/nike-air-force-1.jpg', 0)
) AS img(product_slug, url, show_order);

-- Link product badges to products
INSERT INTO public.link_product_badge_product (id, product_id, product_badge_id, created_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM public.product WHERE slug = prod_slug),
  (SELECT id FROM public.product_badge WHERE slug = badge_slug),
  NOW()
FROM (VALUES
  ('iphone-15-pro', 'new'),
  ('iphone-15-pro', 'featured'),
  ('galaxy-s24', 'bestseller'),
  ('airpods-pro', 'sale'),
  ('nike-air-force', 'sale'),
  ('nike-air-force', 'featured')
) AS links(prod_slug, badge_slug);

-- Link attributes to products
INSERT INTO public.link_attribute_product (id, product_id, attribute_id, value, created_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM public.product WHERE slug = prod_slug),
  (SELECT id FROM public.attribute WHERE slug = attr_slug),
  attr_value,
  NOW()
FROM (VALUES
  ('iphone-15-pro', 'color', 'Space Black'),
  ('iphone-15-pro', 'storage', '256GB'),
  ('iphone-15-pro', 'brand', 'Apple'),
  ('galaxy-s24', 'color', 'Phantom Black'),
  ('galaxy-s24', 'storage', '128GB'),
  ('airpods-pro', 'wireless', 'true'),
  ('nike-air-force', 'color', 'White'),
  ('nike-air-force', 'size', '10'),
  ('nike-air-force', 'material', 'Leather')
) AS links(prod_slug, attr_slug, attr_value);

-- Insert sample reviews
INSERT INTO public.review (id, rating, comment, product_id, customer_id, created_at)
SELECT
  gen_random_uuid(),
  review.rating,
  review.comment,
  (SELECT id FROM public.product WHERE slug = review.product_slug),
  (SELECT id FROM public.customer WHERE email = review.customer_email),
  NOW()
FROM (VALUES
  (5, 'Excellent phone! Love the camera quality.', 'iphone-15-pro', 'john.doe@example.com'),
  (4, 'Great performance but battery could be better.', 'galaxy-s24', 'jane.smith@example.com'),
  (5, 'Best laptop I have ever used for video editing.', 'macbook-pro', 'mike.johnson@example.com'),
  (5, 'Amazing sound quality and noise cancellation.', 'airpods-pro', 'john.doe@example.com'),
  (4, 'Very comfortable shoes, true to size.', 'nike-air-force', 'jane.smith@example.com')
) AS review(rating, comment, product_slug, customer_email);

-- Insert sample orders
INSERT INTO public.order (id, comment, total, customer_id, order_shipping_address_id, order_status_id, created_at)
SELECT
  gen_random_uuid(),
  ord.comment,
  ord.total,
  (SELECT id FROM public.customer WHERE email = ord.customer_email),
  (SELECT id FROM public.order_shipping_address WHERE id IN (
    SELECT id FROM public.order_shipping_address WHERE customer_id = (SELECT id FROM public.customer WHERE email = ord.customer_email) LIMIT 1
  )),
  (SELECT id FROM public.order_status WHERE name = ord.status),
  NOW()
FROM (VALUES
  ('Please deliver after 5 PM', 1249.98, 'john.doe@example.com', 'Confirmed'),
  ('Gift wrapping required', 2399.99, 'jane.smith@example.com', 'Processing'),
  (NULL, 96.00, 'mike.johnson@example.com', 'Delivered')
) AS ord(comment, total, customer_email, status);

-- Insert order items
INSERT INTO public.order_item (id, quantity, price, discount, order_id, product_id, created_at)
SELECT
  gen_random_uuid(),
  item.quantity,
  item.price,
  item.discount,
  (SELECT o.id FROM public.order o
   JOIN public.customer c ON o.customer_id = c.id
   WHERE c.email = item.customer_email
   ORDER BY o.created_at DESC LIMIT 1),
  (SELECT id FROM public.product WHERE slug = item.product_slug),
  NOW()
FROM (VALUES
  ('john.doe@example.com', 'iphone-15-pro', 1, 999.99, 10),
  ('john.doe@example.com', 'airpods-pro', 1, 249.99, 15),
  ('jane.smith@example.com', 'macbook-pro', 1, 2399.99, NULL),
  ('mike.johnson@example.com', 'nike-air-force', 1, 120.00, 20)
) AS item(customer_email, product_slug, quantity, price, discount);

-- Insert sample payments
INSERT INTO public.payment (id, amount, provider, customer_id, order_id, payment_status_id, created_at)
SELECT
  gen_random_uuid(),
  pay.amount,
  pay.provider,
  (SELECT customer_id FROM public.order WHERE id = pay.order_id),
  pay.order_id,
  (SELECT id FROM public.payment_status WHERE name = pay.status),
  NOW()
FROM (VALUES
  ((SELECT id FROM public.order WHERE total = 1249.98), 1249.98, 'stripe', 'Completed'),
  ((SELECT id FROM public.order WHERE total = 2399.99), 2399.99, 'paypal', 'Pending'),
  ((SELECT id FROM public.order WHERE total = 96.00), 96.00, 'credit_card', 'Completed')
) AS pay(order_id, amount, provider, status);