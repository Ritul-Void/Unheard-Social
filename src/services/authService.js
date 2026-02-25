import { supabase } from './supabaseClient';

/**
 * Hash a string using SHA-256 via the Web Crypto API.
 * Returns the hex-encoded hash.
 */
export async function hashKey(key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a random 25-character alphanumeric service key.
 */
export function generateServiceKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  const array = new Uint8Array(25);
  crypto.getRandomValues(array);
  for (let i = 0; i < 25; i++) {
    key += chars[array[i] % chars.length];
  }
  return key;
}

/**
 * Create a new user with a hashed service key.
 * Returns { user, serviceKey } where serviceKey is the plain-text key
 * the user must save.
 */
export async function createUser(username) {
  const serviceKey = generateServiceKey();
  const serviceKeyHash = await hashKey(serviceKey);
  const avatarSeed = username + Date.now().toString(36);

  const { data, error } = await supabase
    .from('users')
    .insert({
      username,
      service_key_hash: serviceKeyHash,
      avatar_seed: avatarSeed,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return { user: data, serviceKey };
}

/**
 * Login by verifying a service key against stored hashes.
 * Fetches all non-suspended users and checks the key hash.
 */
export async function loginWithServiceKey(serviceKey) {
  const keyHash = await hashKey(serviceKey);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('service_key_hash', keyHash)
    .single();

  if (error || !data) throw new Error('Invalid service key');
  return data;
}

/**
 * Fetch a user by ID.
 */
export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}
