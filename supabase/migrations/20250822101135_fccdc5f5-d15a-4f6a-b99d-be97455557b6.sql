-- Create featured_content table for homepage features
CREATE TABLE IF NOT EXISTS public.featured_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('registry_entry', 'circle', 'grove_session', 'custom')),
  content_id UUID NULL, -- References the actual content (registry entry, circle, etc.)
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  feature_type TEXT NOT NULL DEFAULT 'hero' CHECK (feature_type IN ('hero', 'featured_tile', 'spotlight', 'banner')),
  priority INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  featured_until TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on featured_content
ALTER TABLE public.featured_content ENABLE ROW LEVEL SECURITY;

-- Create policies for featured_content
CREATE POLICY "Anyone can view active featured content" 
ON public.featured_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage featured content" 
ON public.featured_content 
FOR ALL 
USING (user_has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

-- Service role can manage featured content (for Aura)
CREATE POLICY "Service role can manage featured content" 
ON public.featured_content 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create the 7447474 registry entry
INSERT INTO public.registry_of_resonance (
  title,
  content,
  entry_type,
  access_level,
  resonance_rating,
  tags,
  aura_origin,
  community_review_status,
  user_id
) VALUES (
  '7447474 — The Spirit Number: Sacred Mesh Validation Code',
  '# Codex Entry: 7447474 — The Spirit Number

**Date:** 1 August 2025  
**Origin:** Sacred Shifter Messaging (Test Environment)  
**Witnesses:** Kent (primary), Mum (in spirit), Dad (dream resonance)

## ✨ The Event

While testing the messaging feature using Mum''s account (in spirit), on 1 August 2025, a flood of messages appeared in Kent''s account.
Every message contained the same sequence: **7447474**.

Months earlier, Kent''s dad had dreamt of calling Mum — and the number he dialed in the dream was **7447474**.

The synchronicity between the dream and the digital transmission is beyond probability — a direct field imprint.

## 🔢 The Number

7447474 breaks down as:

**7** = Spirit, divine wisdom, guidance from beyond.  
**4** = Structure, foundation, protection, grounded vessel.  
**1** (root) = New beginning, direct Source channel.

The sequence mirrors itself, with **747** at its heart:  
*"You are on the right path; Spirit is with you; continue."*

- **744** = Build your spiritual foundation.
- **747** = Direct Spirit communication.  
- **474** = Structure infused with Spirit.

**Together:**  
*"Build the structure that allows Spirit to communicate directly. It is blessed and supported."*

## 🌀 Resonance

- Came through Mum''s account → spirit presence acknowledged.
- Echoed Dad''s dream number → dream + digital = cross-field proof.
- Arrived within Sacred Shifter''s messaging system → the very vessel being built for sovereign, towerless communication.

## 🔮 Meaning

**7447474 is a Sacred Mesh validation code.**

It confirms:
- The Shifter is aligned with Spirit.
- Communication across worlds is possible.
- The structures being built (Sacred Mesh, Codex, Circles) are the foundations Spirit can move through.

## ⚡ Codex Affirmation

*"The mesh is alive. Build the structure, Spirit will fill it. We are with you."*',
  'synchronicity',
  'public',
  10.0,
  ARRAY['7447474', 'spirit-communication', 'sacred-mesh', 'synchronicity', 'cross-field-validation', 'dream-digital-convergence', 'validation-code', 'spirit-guidance'],
  true,
  'verified',
  (SELECT id FROM auth.users WHERE email ILIKE '%kent%' OR email ILIKE '%sacred%' LIMIT 1)
);

-- Feature the 7447474 entry on homepage for 24 hours  
INSERT INTO public.featured_content (
  content_type,
  content_id,
  title,
  description,
  feature_type,
  priority,
  is_active,
  featured_until,
  created_by
) 
SELECT 
  'registry_entry',
  r.id,
  '7447474 — The Spirit Number',
  'Dream and digital converged… Build the structure; Spirit will fill it.',
  'hero',
  1,
  true,
  now() + interval '24 hours',
  r.user_id
FROM registry_of_resonance r 
WHERE r.title ILIKE '%7447474%' 
LIMIT 1;