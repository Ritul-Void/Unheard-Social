import { useState } from 'react';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
export default function PostEditorPage({
  onSubmit,
  onClose
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = title.trim().length > 0 && body.trim().length > 0;
  async function handleSubmit() {
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
    className: "fixed inset-0 z-50 bg-zinc-950 flex flex-col"
  }, React.createElement("div", {
    className: "flex items-center justify-between px-4 py-3 border-b border-zinc-800/50"
  }, React.createElement("button", {
    onClick: onClose,
    className: "p-1.5 -ml-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors"
  }, React.createElement(ArrowLeft, {
    size: 20
  })), React.createElement("span", {
    className: "text-sm font-semibold",
    style: {
      color: 'var(--color-primary)'
    }
  }, "New Post"), React.createElement("button", {
    onClick: handleSubmit,
    disabled: !canSubmit || submitting,
    className: "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
    style: {
      backgroundColor: canSubmit ? 'var(--color-primary)' : undefined,
      color: canSubmit ? '#09090b' : 'var(--color-secondary)'
    }
  }, submitting ? React.createElement(Loader2, {
    size: 14,
    className: "animate-spin"
  }) : React.createElement(Send, {
    size: 14
  }), submitting ? 'Posting...' : 'Post')), React.createElement("div", {
    className: "flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full"
  }, React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("input", {
    type: "text",
    placeholder: "Post heading...",
    value: title,
    onChange: e => setTitle(e.target.value),
    maxLength: 120,
    autoFocus: true,
    className: "w-full bg-transparent text-xl font-bold placeholder-zinc-700 focus:outline-none",
    style: {
      color: 'var(--color-primary)'
    }
  }), React.createElement("div", {
    className: "border-t border-zinc-800/40"
  }), React.createElement("textarea", {
    placeholder: "Share what's on your mind...",
    value: body,
    onChange: e => setBody(e.target.value),
    maxLength: 2000,
    className: "w-full bg-transparent text-sm text-zinc-300 placeholder-zinc-700 resize-none focus:outline-none leading-relaxed min-h-[300px]"
  }))), React.createElement("div", {
    className: "px-4 py-3 border-t border-zinc-800/50 flex items-center justify-between"
  }, React.createElement("span", {
    className: "text-[11px] text-zinc-700"
  }, body.length, "/2000"), React.createElement("span", {
    className: "text-[11px] text-zinc-700"
  }, title.length, "/120")));
}
