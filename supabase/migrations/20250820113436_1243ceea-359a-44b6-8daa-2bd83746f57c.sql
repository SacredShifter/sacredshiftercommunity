-- Create admin function for direct SQL execution
CREATE OR REPLACE FUNCTION execute_admin_query(query_text TEXT)
RETURNS TABLE(result JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rec RECORD;
    result_array JSONB := '[]'::JSONB;
BEGIN
    -- Check if user is admin
    IF NOT user_has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Admin access required';
    END IF;
    
    -- Execute the query and return results as JSONB
    FOR rec IN EXECUTE query_text LOOP
        result_array := result_array || to_jsonb(rec);
    END LOOP;
    
    RETURN QUERY SELECT result_array;
END;
$$;