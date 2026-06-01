import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ofroxwgpjfsnbgljzcaz.supabase.co";
const supabaseKey = "sb_publishable_pO6fZACzxVgZJKAAu78Mmw_nZmHMHgD";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('teams').select('*');
  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}
run();
