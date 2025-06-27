
-- Add type column to products table to distinguish between ready_product and raw_material
ALTER TABLE public.products 
ADD COLUMN type text NOT NULL DEFAULT 'ready_product';

-- Add a check constraint to ensure only valid types
ALTER TABLE public.products 
ADD CONSTRAINT products_type_check 
CHECK (type IN ('ready_product', 'raw_material'));

-- Also add photo_url column for ready products
ALTER TABLE public.products 
ADD COLUMN photo_url text;
