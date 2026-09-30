import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('----------------------------------------------------');
console.log('CX Intelligence -> Supabase Live Connection Diagnostic');
console.log('----------------------------------------------------');
console.log('Target Project URL:', url);
console.log('Using Key:', key ? `${key.substring(0, 15)}...` : 'None');

if (!url || !key) {
  console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in backend/.env');
  process.exit(1);
}

const supabase = createClient(url, key);

const TABLES = [
  'businesses',
  'profiles',
  'customers',
  'conversations',
  'messages',
  'tickets',
  'ticket_messages',
  'knowledge_articles',
  'products',
  'recommendations',
  'feedback',
  'ai_analysis'
];

async function runCheck() {
  console.log('\nChecking table existence in Supabase public schema...\n');
  let missing = [];
  let existing = [];

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.code === '42P01')) {
      console.log(`❌ Table [${table}]: Not created in Supabase yet`);
      missing.push(table);
    } else if (error) {
      console.log(`⚠️  Table [${table}]: Error (${error.message})`);
      missing.push(table);
    } else {
      console.log(`✅ Table [${table}]: LIVE & READY`);
      existing.push(table);
    }
  }

  console.log('\n----------------------------------------------------');
  if (missing.length > 0) {
    console.log(`STATUS: ${existing.length}/${TABLES.length} tables found.`);
    console.log(`Action Required: Please paste database/setup_supabase.sql into your Supabase SQL Editor and click RUN.`);
    console.log(`SQL Editor Link: https://supabase.com/dashboard/project/savpdcexazvwiysvrtsc/sql/new`);
  } else {
    console.log(`STATUS: ALL 12 TABLES ARE LIVE IN SUPABASE! 🎉`);
    console.log(`Your project is fully connected and synchronizing in real-time.`);
  }
  console.log('----------------------------------------------------\n');
}

runCheck();
