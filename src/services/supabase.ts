import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE: Estos valores deben ser reemplazados luego por las verdaderas
// URL y KEY anónima de un proyecto Supabase real proporcionado por el usuario.
const SUPABASE_URL = 'https://abcdefghijklmnopqrst.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key_for_compilation';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Syncro Music Supabase Utils
 */

// Simulación de guardar el rol premium en base de datos.
export async function syncPremiumStatus(isPremium: boolean) {
  try {
    // Si tuvieramos tabla de profiles:
    // const { data: { user } } = await supabase.auth.getUser();
    // if (user) {
    //   await supabase.from('profiles').update({ premium: isPremium }).eq('id', user.id);
    // }
    console.log(`[Supabase Mock]: Status Premium sincronizado => ${isPremium}`);
  } catch (error) {
    console.error('Error sincronizando Supabase:', error);
  }
}
