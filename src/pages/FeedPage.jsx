import { ArrowDownWideNarrow, Loader2 } from 'lucide-react';
import PostCard from '../components/PostCard';
export default function FeedPage({
  posts,
  relatedSet,
  loading,
  sortBy,
  setSortBy,
  toggleRelate,
  onOpenPost
}) {
  return React.createElement("div", {
    className: "max-w-lg mx-auto px-4 pt-4 pb-24 space-y-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between"
  }, React.createElement("h1", {
    className: "text-xl font-bold",
    style: {
      color: 'var(--color-primary)'
    }
  }, "Feed"), React.createElement("div", {
    className: "flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-full p-0.5"
  }, React.createElement("button", {
    onClick: () => setSortBy('newest'),
    className: "px-3 py-1 text-xs rounded-full font-medium transition-colors",
    style: sortBy === 'newest' ? {
      backgroundColor: 'var(--color-primary)',
      color: '#09090b'
    } : {
      color: '#71717a'
    }
  }, "Newest"), React.createElement("button", {
    onClick: () => setSortBy('most_related'),
    className: "px-3 py-1 text-xs rounded-full font-medium transition-colors flex items-center gap-1",
    style: sortBy === 'most_related' ? {
      backgroundColor: 'var(--color-primary)',
      color: '#09090b'
    } : {
      color: '#71717a'
    }
  }, React.createElement(ArrowDownWideNarrow, {
    size: 12
  }), "Top"))), loading ? React.createElement("div", {
    className: "flex justify-center py-20"
  }, React.createElement(Loader2, {
    className: "animate-spin",
    size: 28,
    style: {
      color: 'var(--color-primary)'
    }
  })) : posts.length === 0 ? React.createElement("div", {
    className: "text-center py-20 text-zinc-600"
  }, React.createElement("p", {
    className: "text-lg font-medium"
  }, "Nothing here yet"), React.createElement("p", {
    className: "text-sm mt-1"
  }, "Be the first to share something.")) : React.createElement("div", {
    className: "space-y-3"
  }, posts.map(post => React.createElement(PostCard, {
    key: post.id,
    post: post,
    isRelated: relatedSet.has(post.id),
    onRelate: toggleRelate,
    onOpenPost: onOpenPost
  }))));
}
