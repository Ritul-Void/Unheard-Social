import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Heart, Loader2, Send } from 'lucide-react';
import Avatar from '../components/Avatar';
import CommentItem, { buildCommentTree } from '../components/CommentItem';
import { fetchPostById } from '../services/commentService';
import { fetchComments, createComment } from '../services/commentService';
import { useAuth } from '../hooks/useAuth';
import { formatTimeAgo } from '../utils/time';
export default function PostViewPage({
  postId,
  isRelated,
  onRelate,
  onBack
}) {
  const {
    user
  } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [postData, commentsData] = await Promise.all([fetchPostById(postId), fetchComments(postId)]);
      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      console.error('Failed to load post:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);
  useEffect(() => {
    loadData();
  }, [loadData]);
  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!commentText.trim() || submitting || !user) return;
    setSubmitting(true);
    try {
      const newComment = await createComment({
        postId,
        userId: user.id,
        body: commentText.trim(),
        parentCommentId: replyTo
      });
      setComments(prev => [...prev, newComment]);
      setPost(prev => prev ? {
        ...prev,
        comment_count: (prev.comment_count || 0) + 1
      } : prev);
      setCommentText('');
      setReplyTo(null);
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmitting(false);
    }
  }
  function handleReply(commentId) {
    setReplyTo(commentId);
    document.getElementById('comment-input')?.focus();
  }
  function cancelReply() {
    setReplyTo(null);
  }
  const replyToComment = replyTo ? comments.find(c => c.id === replyTo) : null;
  const commentTree = buildCommentTree(comments);
  if (loading) {
    return React.createElement("div", {
      className: "min-h-screen flex items-center justify-center"
    }, React.createElement(Loader2, {
      className: "animate-spin",
      size: 28,
      style: {
        color: 'var(--color-primary)'
      }
    }));
  }
  if (!post) {
    return React.createElement("div", {
      className: "min-h-screen flex flex-col items-center justify-center gap-3"
    }, React.createElement("p", {
      className: "text-zinc-500"
    }, "Post not found"), React.createElement("button", {
      onClick: onBack,
      className: "text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
    }, "Go back"));
  }
  const username = post.users?.username || 'Anonymous';
  return React.createElement("div", {
    className: "max-w-lg mx-auto min-h-screen flex flex-col"
  }, React.createElement("div", {
    className: "sticky top-0 z-30 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/50 px-4 py-3 flex items-center gap-3"
  }, React.createElement("button", {
    onClick: onBack,
    className: "p-1.5 -ml-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors"
  }, React.createElement(ArrowLeft, {
    size: 20
  })), React.createElement("span", {
    className: "text-sm font-medium",
    style: {
      color: 'var(--color-primary)'
    }
  }, "Post")), React.createElement("div", {
    className: "px-4 py-4 border-b border-zinc-800/50"
  }, React.createElement("div", {
    className: "flex items-center gap-2.5 mb-3"
  }, React.createElement(Avatar, {
    seed: post.users?.avatar_seed,
    size: 36
  }), React.createElement("div", null, React.createElement("span", {
    className: "text-sm font-medium",
    style: {
      color: 'var(--color-primary)'
    }
  }, "@", username), React.createElement("p", {
    className: "text-[11px]",
    style: {
      color: 'var(--color-secondary)'
    }
  }, formatTimeAgo(post.created_at)))), React.createElement("h1", {
    className: "text-lg font-bold mb-2",
    style: {
      color: 'var(--color-primary)'
    }
  }, post.title), React.createElement("p", {
    className: "text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-4"
  }, post.body), React.createElement("div", {
    className: "flex items-center gap-4 pt-2 border-t border-zinc-800/40"
  }, React.createElement("button", {
    onClick: () => onRelate(post.id),
    className: `flex items-center gap-1.5 text-sm transition-all
              ${isRelated ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'}`
  }, React.createElement(Heart, {
    size: 16,
    fill: isRelated ? 'currentColor' : 'none',
    strokeWidth: 2
  }), React.createElement("span", null, post.relate_count || 0)), React.createElement("span", {
    className: "text-sm text-zinc-600"
  }, post.comment_count || 0, " comment", (post.comment_count || 0) !== 1 ? 's' : ''))), React.createElement("div", {
    className: "flex-1 px-4 py-3 pb-32"
  }, commentTree.length === 0 ? React.createElement("p", {
    className: "text-center text-zinc-600 text-sm py-8"
  }, "No comments yet. Be the first.") : React.createElement("div", {
    className: "space-y-1"
  }, commentTree.map(c => React.createElement(CommentItem, {
    key: c.id,
    comment: c,
    onReply: handleReply
  })))), React.createElement("div", {
    className: "fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 px-4 py-3"
  }, React.createElement("div", {
    className: "max-w-lg mx-auto"
  }, replyToComment && React.createElement("div", {
    className: "flex items-center justify-between mb-2 px-1"
  }, React.createElement("span", {
    className: "text-[11px] text-zinc-500"
  }, "Replying to ", React.createElement("span", {
    style: {
      color: 'var(--color-primary)'
    }
  }, "@", replyToComment.users?.username || 'Anonymous')), React.createElement("button", {
    onClick: cancelReply,
    className: "text-[11px] text-zinc-600 hover:text-zinc-400"
  }, "Cancel")), React.createElement("form", {
    onSubmit: handleSubmitComment,
    className: "flex items-center gap-2"
  }, React.createElement("input", {
    id: "comment-input",
    type: "text",
    value: commentText,
    onChange: e => setCommentText(e.target.value),
    placeholder: replyTo ? 'Write a reply...' : 'Write a comment...',
    maxLength: 1000,
    className: "flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition"
  }), React.createElement("button", {
    type: "submit",
    disabled: !commentText.trim() || submitting,
    className: "p-2.5 rounded-xl transition-colors disabled:text-zinc-700",
    style: {
      color: commentText.trim() ? 'var(--color-primary)' : undefined
    }
  }, React.createElement(Send, {
    size: 18
  }))))));
}
