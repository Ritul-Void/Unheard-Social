import { supabase } from './supabaseClient';

/**
 * Fetch comments for a post, including user info.
 * Returns a flat list; threading is done client-side via parent_comment_id.
 */
export async function fetchComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(username, avatar_seed)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Create a new comment on a post.
 */
export async function createComment({ postId, userId, body, parentCommentId = null }) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      body,
      parent_comment_id: parentCommentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('*, users(username, avatar_seed)')
    .single();

  if (error) throw error;

  // Increment comment_count on the post
  const { data: post } = await supabase
    .from('posts')
    .select('comment_count')
    .eq('id', postId)
    .single();

  await supabase
    .from('posts')
    .update({ comment_count: (post?.comment_count || 0) + 1 })
    .eq('id', postId);

  return data;
}

/**
 * Fetch a single post by ID with user info.
 */
export async function fetchPostById(postId) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(username, avatar_seed)')
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a post by ID (cascade handles comments & relates).
 */
export async function deletePost(postId) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
  return true;
}
