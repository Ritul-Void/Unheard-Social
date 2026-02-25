import Avatar from './Avatar';
import { formatTimeAgo } from '../utils/time';
import { useState } from 'react';
import { Reply } from 'lucide-react';
export function buildCommentTree(comments) {
  const map = {};
  const roots = [];
  comments.forEach(c => {
    map[c.id] = {
      ...c,
      children: []
    };
  });
  comments.forEach(c => {
    if (c.parent_comment_id && map[c.parent_comment_id]) {
      map[c.parent_comment_id].children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
}
export default function CommentItem({
  comment,
  depth = 0,
  onReply
}) {
  const [showReplyHint, setShowReplyHint] = useState(false);
  const username = comment.users?.username || 'Anonymous';
  const maxDepth = 4;
  return React.createElement("div", {
    className: `${depth > 0 ? 'ml-4 pl-3 border-l border-zinc-800/60' : ''}`,
    style: {
      maxWidth: '100%'
    }
  }, React.createElement("div", {
    className: "py-2.5"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, React.createElement(Avatar, {
    seed: comment.users?.avatar_seed,
    size: 20
  }), React.createElement("span", {
    className: "text-xs font-medium",
    style: {
      color: 'var(--color-primary)'
    }
  }, "@", username), React.createElement("span", {
    className: "text-[10px]",
    style: {
      color: 'var(--color-secondary)'
    }
  }, formatTimeAgo(comment.created_at))), React.createElement("p", {
    className: "text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap ml-7"
  }, comment.body), depth < maxDepth && React.createElement("button", {
    onClick: () => onReply(comment.id),
    onMouseEnter: () => setShowReplyHint(true),
    onMouseLeave: () => setShowReplyHint(false),
    className: "ml-7 mt-1 flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
  }, React.createElement(Reply, {
    size: 12
  }), "Reply")), comment.children?.map(child => React.createElement(CommentItem, {
    key: child.id,
    comment: child,
    depth: depth + 1,
    onReply: onReply
  })));
}
