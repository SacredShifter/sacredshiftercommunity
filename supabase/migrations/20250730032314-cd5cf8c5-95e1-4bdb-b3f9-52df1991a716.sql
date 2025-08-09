-- Fix the handle_new_user function to work with the existing profiles table structure
-- The profiles table already has a user_id column that should be used instead of id

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles using user_id (not id) since that's what the table expects
  INSERT INTO public.profiles (user_id, display_name, full_name)
  VALUES (
    NEW.id,                    -- Set user_id to the new user's ID
    COALESCE(
      NEW.raw_user_meta_data->>'display_name', 
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)  -- Fallback to email username if no metadata
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)  -- Fallback to email username if no metadata
    )
  );
  
  -- Also create a default user role entry
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log detailed error but don't block user creation
  RAISE WARNING 'Error creating profile for user % (email: %): % - %', NEW.id, NEW.email, SQLSTATE, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;