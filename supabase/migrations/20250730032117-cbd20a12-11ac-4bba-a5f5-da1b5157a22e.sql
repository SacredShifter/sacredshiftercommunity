-- Let's fix the handle_new_user function to handle potential issues better
-- The error suggests the profiles table might have constraints that aren't being met

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles with all required fields properly set
  INSERT INTO public.profiles (id, user_id, display_name, full_name)
  VALUES (
    NEW.id,                    -- Use the new user's ID as the profile ID
    NEW.id,                    -- Also set user_id to the same value
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