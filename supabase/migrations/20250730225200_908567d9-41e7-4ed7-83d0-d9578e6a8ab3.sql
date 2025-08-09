-- Grant admin role to the current user
INSERT INTO user_roles (user_id, role) 
VALUES ('8a513906-2158-4bf7-a25b-0399bfc37b97', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;