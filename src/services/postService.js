import { supabase } from './supabaseClient';

/**
 * Fetch the latest posts, ordered by created_at descending.
 * Joins user info for display.
 */
export async function fetchPosts(limit = 20) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(username, avatar_seed)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Create a new post.
 */
export async function createPost({ userId, title, body }) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      title,
      body,
      relate_count: 0,
      comment_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('*, users(username, avatar_seed)')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch posts by a specific user.
 */
export async function fetchUserPosts(userId) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(username, avatar_seed)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Relate (like) a post. Creates a relate record and increments relate_count.
 * Returns true if successful, false if already related.
 */
export async function relateToPost(userId, postId) {
  // Check if already related
  const { data: existing } = await supabase
    .from('relates')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  if (existing) return false; // Already related

  const { error: insertError } = await supabase
    .from('relates')
    .insert({ user_id: userId, post_id: postId });

  if (insertError) throw insertError;

  // Increment relate_count on the post
  const { error: rpcError } = await supabase.rpc('increment_relate_count', {
    p_post_id: postId,
  });

  // If the RPC doesn't exist, fall back to a manual update
  if (rpcError) {
    const { data: post } = await supabase
      .from('posts')
      .select('relate_count')
      .eq('id', postId)
      .single();

    await supabase
      .from('posts')
      .update({ relate_count: (post?.relate_count || 0) + 1 })
      .eq('id', postId);
  }

  return true;
}

/**
 * Unrelate a post. Removes relate record and decrements relate_count.
 */
export async function unrelatePost(userId, postId) {
  const { error: deleteError } = await supabase
    .from('relates')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (deleteError) throw deleteError;

  const { data: post } = await supabase
    .from('posts')
    .select('relate_count')
    .eq('id', postId)
    .single();

  await supabase
    .from('posts')
    .update({ relate_count: Math.max((post?.relate_count || 1) - 1, 0) })
    .eq('id', postId);

  return true;
}

/**
 * Fetch relates by a user (to know which posts they've related to).
 */
export async function fetchUserRelates(userId) {
  const { data, error } = await supabase
    .from('relates')
    .select('post_id')
    .eq('user_id', userId);

  if (error) throw error;
  return new Set(data.map((r) => r.post_id));
}

/**
 * Get total relates received across all of a user's posts.
 */
export async function getTotalRelatesReceived(userId) {
  const { data, error } = await supabase
    .from('posts')
    .select('relate_count')
    .eq('user_id', userId);

  if (error) throw error;
  return data.reduce((sum, p) => sum + (p.relate_count || 0), 0);
}
