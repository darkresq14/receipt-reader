import { Database } from '@receipt-reader/shared-types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!supabasePublishableKey) {
  throw new Error('Missing SUPABABLE_PUBLISHABLE_KEY environment variable');
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
);
