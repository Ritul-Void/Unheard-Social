import { Heart, MessageCircle } from 'lucide-react';
import Avatar from './Avatar';
import { formatTimeAgo } from '../utils/time';
export default function PostCard({
  post,
  isRelated,
  onRelate,
  onOpenPost
}) {
  const username = post.users?.username || 'Anonymous';
  return React.createElement("article", {
    className: "bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-colors hover:border-zinc-700 cursor-pointer",
    onClick: () => onOpenPost?.(post.id)
  }, React.createElement("div", {
    className: "p-4 space-y-2.5"
  }, React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, React.createElement(Avatar, {
    seed: post.users?.avatar_seed,
    size: 32
  }), React.createElement("div", {
    className: "flex-1 min-w-0"
  }, React.createElement("span", {
    className: "text-xs font-medium block truncate",
    style: {
      color: 'var(--color-primary)'
    }
  }, "@", username), React.createElement("span", {
    className: "text-[10px] block",
    style: {
      color: 'var(--color-secondary)'
    }
  }, formatTimeAgo(post.created_at)))), React.createElement("h3", {
    className: "text-[15px] font-semibold leading-snug",
    style: {
      color: 'var(--color-primary)'
    }
  }, post.title), React.createElement("p", {
    className: "text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap line-clamp-4"
  }, post.body)), React.createElement("div", {
    className: "flex items-center gap-6 px-4 py-2.5 border-t border-zinc-800/50"
  }, React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onRelate(post.id);
    },
    className: `flex items-center gap-1.5 text-sm transition-all
            ${isRelated ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'}`
  }, React.createElement(Heart, {
    size: 15,
    fill: isRelated ? 'currentColor' : 'none',
    strokeWidth: 2
  }), React.createElement("span", {
    className: "text-xs"
  }, post.relate_count || 0)), React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onOpenPost?.(post.id);
    },
    className: "flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
  }, React.createElement(MessageCircle, {
    size: 15,
    strokeWidth: 2
  }), React.createElement("span", {
    className: "text-xs"
  }, post.comment_count || 0))));
}
