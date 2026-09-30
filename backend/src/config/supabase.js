import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

let supabaseClient = null;
let isSupabaseOnline = false;

if (config.supabase.url && (config.supabase.serviceRoleKey || config.supabase.anonKey)) {
  const keyToUse = config.supabase.serviceRoleKey || config.supabase.anonKey;
  try {
    supabaseClient = createClient(config.supabase.url, keyToUse, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        // Fast timeout to avoid hanging if ISP blocks Cloudflare/Supabase
        fetch: (url, options = {}) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          return fetch(url, { ...options, signal: controller.signal })
            .then(res => {
              isSupabaseOnline = true;
              return res;
            })
            .catch(err => {
              isSupabaseOnline = false;
              throw err;
            })
            .finally(() => clearTimeout(timeoutId));
        }
      }
    });

    console.log('[Supabase] Client configured for:', config.supabase.url);

    // Initial background health ping
    fetch(config.supabase.url, { signal: AbortSignal.timeout(2000) })
      .then(() => {
        isSupabaseOnline = true;
        console.log('[Supabase] Host is reachable and live.');
      })
      .catch((err) => {
        isSupabaseOnline = false;
        console.log('[Supabase] Remote host unreachable from current network. Using instant self-healing store.');
      });
  } catch (err) {
    console.warn('[Supabase] Initialization error:', err.message);
  }
} else {
  console.log('[Supabase] Running in high-performance local store mode.');
}

export const supabase = supabaseClient;
export const isOnline = () => isSupabaseOnline;
