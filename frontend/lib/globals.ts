// Static data accessed across the app

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://plvofqwscloxamqxcxhz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdm9mcXdzY2xveGFtcXhjeGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4MjI1NDAsImV4cCI6MjAzMjM5ODU0MH0.ftgWznPWGedNu8elAiZiQFqP6Az1zD6YjaJXcbm41e8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);