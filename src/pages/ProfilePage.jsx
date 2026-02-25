import { useState } from 'react';
import { Plus, Loader2, Heart, FileText, Trash2 } from 'lucide-react';
import Avatar from '../components/Avatar';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/usePosts';
import { deletePost } from '../services/commentService';
import { formatTimeAgo } from '../utils/time';
export default function ProfilePage({
  onOpenEditor,
  onPostDeleted
}) {
  const {
    user
  } = useAuth();
  const {
    userPosts,
    totalRelates,
    loading,
    loadProfile
  } = useUserProfile();
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);
  async function handleDelete(postId) {
    setDeletingId(postId);
    try {
      await deletePost(postId);
      await loadProfile();
      if (onPostDeleted) onPostDeleted();
    } catch (err) {
      console.error('Failed to delete post:', err);
    } finally {
      setDeletingId(null);
      setShowConfirm(null);
    }
  }
  if (!user) return null;
  return React.createElement("div", {
    className: "max-w-lg mx-auto px-4 pt-4 pb-28 space-y-6"
  }, React.createElement("button", {
    onClick: onOpenEditor,
    className: "fixed bottom-20 right-4 sm:right-auto sm:left-1/2 sm:translate-x-[calc(256px-28px)] z-40 p-3.5 rounded-full shadow-lg transition-colors",
    style: {
      backgroundColor: 'var(--color-primary)',
      color: '#09090b'
    }
  }, React.createElement(Plus, {
    size: 22
  })), React.createElement("div", {
    className: "flex flex-col items-center gap-3 pt-4"
  }, React.createElement(Avatar, {
    seed: user.avatar_seed,
    size: 80
  }), React.createElement("div", {
    className: "text-center"
  }, React.createElement("h2", {
    className: "text-lg font-bold",
    style: {
      color: 'var(--color-primary)'
    }
  }, "@", user.username), React.createElement("p", {
    className: "text-xs mt-0.5",
    style: {
      color: 'var(--color-secondary)'
    }
  }, "Joined ", new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })))), React.createElement("div", {
    className: "flex justify-center gap-8"
  }, React.createElement("div", {
    className: "flex flex-col items-center"
  }, React.createElement("div", {
    className: "flex items-center gap-1.5 font-semibold",
    style: {
      color: 'var(--color-primary)'
    }
  }, React.createElement(FileText, {
    size: 14
  }), userPosts.length), React.createElement("span", {
    className: "text-[10px] uppercase tracking-wide",
    style: {
      color: 'var(--color-secondary)'
    }
  }, "Posts")), React.createElement("div", {
    className: "flex flex-col items-center"
  }, React.createElement("div", {
    className: "flex items-center gap-1.5 font-semibold",
    style: {
      color: 'var(--color-primary)'
    }
  }, React.createElement(Heart, {
    size: 14
  }), totalRelates), React.createElement("span", {
    className: "text-[10px] uppercase tracking-wide",
    style: {
      color: 'var(--color-secondary)'
    }
  }, "Relates"))), React.createElement("div", {
    className: "border-t border-zinc-800"
  }), loading ? React.createElement("div", {
    className: "flex justify-center py-12"
  }, React.createElement(Loader2, {
    className: "animate-spin",
    size: 24,
    style: {
      color: 'var(--color-primary)'
    }
  })) : userPosts.length === 0 ? React.createElement("div", {
    className: "text-center py-12 text-zinc-600"
  }, React.createElement("p", {
    className: "text-sm"
  }, "You haven't posted anything yet.")) : React.createElement("div", {
    className: "space-y-3"
  }, userPosts.map(post => React.createElement("article", {
    key: post.id,
    className: "bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-1.5"
  }, React.createElement("div", {
    className: "flex items-start justify-between gap-2"
  }, React.createElement("div", {
    className: "flex-1 min-w-0"
  }, React.createElement("h4", {
    className: "text-sm font-medium truncate",
    style: {
      color: 'var(--color-primary)'
    }
  }, post.title), React.createElement("span", {
    className: "text-[10px]",
    style: {
      color: 'var(--color-secondary)'
    }
  }, formatTimeAgo(post.created_at))), React.createElement("button", {
    onClick: () => setShowConfirm(post.id),
    className: "p-1.5 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0",
    title: "Delete post"
  }, React.createElement(Trash2, {
    size: 14
  }))), React.createElement("p", {
    className: "text-xs text-zinc-500 leading-relaxed line-clamp-3 whitespace-pre-wrap"
  }, post.body), React.createElement("div", {
    className: "flex items-center gap-1 text-xs text-zinc-600"
  }, React.createElement(Heart, {
    size: 10
  }), post.relate_count || 0), showConfirm === post.id && React.createElement("div", {
    className: "flex items-center gap-2 pt-2 border-t border-zinc-800/50"
  }, React.createElement("p", {
    className: "text-[11px] text-red-400 flex-1"
  }, "Delete this post permanently?"), React.createElement("button", {
    onClick: () => setShowConfirm(null),
    className: "text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
  }, "Cancel"), React.createElement("button", {
    onClick: () => handleDelete(post.id),
    disabled: deletingId === post.id,
    className: "text-[11px] px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
  }, deletingId === post.id ? 'Deleting...' : 'Delete'))))));
}
