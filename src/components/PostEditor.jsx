import { useState } from 'react';
import { X, Send } from 'lucide-react';
export default function PostEditor({
  onSubmit,
  onClose
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = title.trim().length > 0 && body.trim().length > 0;
  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim()
      });
      onClose();
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  }
  return React.createElement("div", {
    className: "fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
  }, React.createElement("div", {
    className: "bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 space-y-4 animate-slide-up"
  }, React.createElement("div", {
    className: "flex items-center justify-between"
  }, React.createElement("h2", {
    className: "text-lg font-semibold text-zinc-100"
  }, "New Post"), React.createElement("button", {
    onClick: onClose,
    className: "p-1.5 rounded-full hover:bg-zinc-800 text-zinc-500 transition-colors"
  }, React.createElement(X, {
    size: 20
  }))), React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-3"
  }, React.createElement("input", {
    type: "text",
    placeholder: "Post heading...",
    value: title,
    onChange: e => setTitle(e.target.value),
    maxLength: 120,
    className: "w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition"
  }), React.createElement("textarea", {
    placeholder: "Share what's on your mind...",
    value: body,
    onChange: e => setBody(e.target.value),
    rows: 5,
    maxLength: 2000,
    className: "w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition"
  }), React.createElement("button", {
    type: "submit",
    disabled: !canSubmit || submitting,
    className: "w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium py-3 rounded-xl transition-colors"
  }, React.createElement(Send, {
    size: 16
  }), submitting ? 'Posting...' : 'Post'))));
}
