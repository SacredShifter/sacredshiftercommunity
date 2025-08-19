import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: { 
          headers: { 
            Authorization: req.headers.get("Authorization")! 
          } 
        }
      }
    );

    const { command } = await req.json();

    // Verify user has admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      throw new Error('Admin role required');
    }

    // Generate preview based on command type
    const preview = await generatePreview(supabase, command);

    return new Response(
      JSON.stringify({ ok: true, preview }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Aura preview error:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generatePreview(supabase: any, command: any) {
  console.log('Generating preview for:', command.kind);

  switch (command.kind) {
    case 'site.style.preview': {
      return {
        type: 'style_preview',
        tokens: command.payload.tokens,
        affected_components: ['buttons', 'cards', 'navigation', 'text'],
        estimated_elements: 150,
        preview_url: `/preview?tokens=${encodeURIComponent(JSON.stringify(command.payload.tokens))}`
      };
    }

    case 'site.style.apply': {
      return {
        type: 'style_application',
        tokens: command.payload.tokens,
        warning: 'This will permanently change the site appearance',
        affected_users: 'all',
        rollback_available: true
      };
    }

    case 'module.scaffold': {
      const files = [
        `src/modules/${command.payload.name}/index.tsx`,
        `src/modules/${command.payload.name}/types.ts`,
        `src/modules/${command.payload.name}/hooks/use${command.payload.name}.ts`,
        `src/modules/${command.payload.name}/components/`,
      ];

      return {
        type: 'module_scaffold',
        module_name: command.payload.name,
        files_to_create: files,
        dependencies: ['@/components/ui', '@/hooks'],
        estimated_lines: 500
      };
    }

    case 'site.page.create': {
      const route = command.payload.route;
      const scaffold = command.payload.scaffold;

      let template = '';
      if (scaffold === 'doc') {
        template = 'Documentation page with TOC and content sections';
      } else if (scaffold === 'feed') {
        template = 'Feed page with posts, filters, and pagination';
      } else {
        template = 'Blank page with basic layout';
      }

      return {
        type: 'page_creation',
        route,
        scaffold,
        template_description: template,
        files_to_create: [
          `src/pages${route}.tsx`,
          `src/components/${route.split('/').pop()}/index.tsx`
        ],
        navigation_update: true
      };
    }

    case 'schema.migration': {
      return {
        type: 'database_migration',
        sql: command.payload.sql,
        warning: 'Database migrations are irreversible',
        backup_recommended: true,
        estimated_downtime: '< 1 minute',
        affected_tables: extractTableNames(command.payload.sql)
      };
    }

    default:
      return {
        type: 'generic_preview',
        command: command.kind,
        payload: command.payload,
        warning: 'Preview not implemented for this command type'
      };
  }
}

function extractTableNames(sql: string): string[] {
  // Simple regex to extract table names from SQL
  const tableMatches = sql.match(/(?:FROM|INSERT INTO|UPDATE|DELETE FROM|ALTER TABLE|CREATE TABLE)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi);
  
  if (!tableMatches) return [];
  
  return [...new Set(tableMatches.map(match => 
    match.split(/\s+/).pop()?.toLowerCase() || ''
  ).filter(Boolean))];
}