import { createClient } from '@supabase/supabase-js';

// Credentials from the .env file
const supabaseUrl = 'https://mikltjgbvxrxndtszorb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pa2x0amdidnhyeG5kdHN6b3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDI3MDksImV4cCI6MjA1OTIxODcwOX0.f4QfhZzSZJ92AjCfbkEMrrmzJrWI617H-FyjJKJ8_70';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('Attempting to fetch data from registry_of_resonance...');

  try {
    const { data, error, count } = await supabase
      .from('registry_of_resonance')
      .select('*', { count: 'exact', head: true }); // Use head:true to only get the count, not the data

    if (error) {
      console.error('An error occurred while fetching data:', error);
      return;
    }

    console.log(`Successfully connected to the database.`);
    console.log(`Found ${count} entries in the 'registry_of_resonance' table.`);

    if (count > 0) {
      console.log('This indicates the data is still present in the database.');
      console.log('The issue is likely with how the data is being fetched or displayed in the UI.');
    } else {
      console.log('This indicates the data is NOT present in the database. This points to a data loss issue.');
    }

  } catch (e) {
    console.error('A critical error occurred:', e);
  }
}

checkData();
