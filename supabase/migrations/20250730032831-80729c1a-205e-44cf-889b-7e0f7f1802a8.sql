-- Simplify the handle_new_user function to debug the issue
-- Remove the user_roles insertion temporarily to isolate the problem

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert into profiles first to test
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
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log detailed error but don't block user creation
  RAISE WARNING 'Error creating profile for user % (email: %): % - %', NEW.id, NEW.email, SQLSTATE, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;