import { useState, useEffect, useCallback } from 'react';
import {
  fetchPosts,
  createPost,
  relateToPost,
  unrelatePost,
  fetchUserRelates,
  fetchUserPosts,
  getTotalRelatesReceived,
} from '../services/postService';
import { useAuth } from './useAuth';

export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [relatedSet, setRelatedSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'most_related'

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPosts(20);
      setPosts(data);
      if (user) {
        const relates = await fetchUserRelates(user.id);
        setRelatedSet(relates);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadPosts();
  }, [user, loadPosts]);

  const addPost = useCallback(
    async ({ title, body }) => {
      if (!user) return;
      const newPost = await createPost({ userId: user.id, title, body });
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    },
    [user]
  );

  const toggleRelate = useCallback(
    async (postId) => {
      if (!user) return;
      const isRelated = relatedSet.has(postId);

      if (isRelated) {
        await unrelatePost(user.id, postId);
        setRelatedSet((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, relate_count: Math.max((p.relate_count || 1) - 1, 0) }
              : p
          )
        );
      } else {
        await relateToPost(user.id, postId);
        setRelatedSet((prev) => new Set(prev).add(postId));
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, relate_count: (p.relate_count || 0) + 1 }
              : p
          )
        );
      }
    },
    [user, relatedSet]
  );

  // Sort posts client-side
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'most_related') {
      return (b.relate_count || 0) - (a.relate_count || 0);
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return {
    posts: sortedPosts,
    relatedSet,
    loading,
    sortBy,
    setSortBy,
    loadPosts,
    addPost,
    toggleRelate,
  };
}

export function useUserProfile() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [totalRelates, setTotalRelates] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [posts, relates] = await Promise.all([
        fetchUserPosts(user.id),
        getTotalRelatesReceived(user.id),
      ]);
      setUserPosts(posts);
      setTotalRelates(relates);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    userPosts,
    totalRelates,
    loading,
    loadProfile,
  };
}
