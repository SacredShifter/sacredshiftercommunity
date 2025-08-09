-- Create the app_role type first
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'moderator');