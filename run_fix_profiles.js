const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the migration file
const migrationFilePath = path.join(__dirname, 'supabase/migrations/20250803000000_fix_profiles_query_issue.sql');

// Check if the migration file exists
if (!fs.existsSync(migrationFilePath)) {
  console.error('Migration file not found:', migrationFilePath);
  process.exit(1);
}

// Read the migration SQL
const sql = fs.readFileSync(migrationFilePath, 'utf8');

try {
  // Run the migration using Supabase CLI
  console.log('Running migration to fix profiles table...');
  execSync('npx supabase migration up', { stdio: 'inherit' });
  console.log('Migration completed successfully.');
  
  console.log('Restarting Supabase services...');
  execSync('npx supabase restart', { stdio: 'inherit' });
  console.log('Supabase services restarted.');
  
  console.log('Fix completed. Please restart your application.');
} catch (error) {
  console.error('Error running migration:', error.message);
  process.exit(1);
}