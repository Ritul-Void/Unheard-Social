import { useState } from 'react';
import { Copy, Download, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
export default function KeyReveal({
  serviceKey,
  username
}) {
  const {
    markKeySaved
  } = useAuth();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const hasSaved = copied || downloaded;
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(serviceKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = serviceKey;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }
  function handleDownload() {
    const json = JSON.stringify({
      platform: 'Unheard',
      username,
      service_key: serviceKey
    }, null, 2);
    const blob = new Blob([json], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unheard_service_key.json';
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  }
  function handleContinue() {
    markKeySaved();
  }
  return React.createElement("div", {
    className: "min-h-screen bg-zinc-950 flex items-center justify-center px-4"
  }, React.createElement("div", {
    className: "w-full max-w-sm space-y-6"
  }, React.createElement("div", {
    className: "flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"
  }, React.createElement(AlertTriangle, {
    size: 20,
    className: "text-amber-400 shrink-0 mt-0.5"
  }), React.createElement("div", null, React.createElement("p", {
    className: "text-sm font-medium text-amber-300"
  }, "Save your service key!"), React.createElement("p", {
    className: "text-xs text-amber-400/70 mt-1 leading-relaxed"
  }, "This is your only way to log back in. There is no email or password recovery. If you lose this key, your account is gone forever."))), React.createElement("div", {
    className: "bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3"
  }, React.createElement("p", {
    className: "text-xs text-zinc-500 uppercase tracking-wide font-medium"
  }, "Your Service Key"), React.createElement("p", {
    className: "font-mono text-sm text-violet-300 bg-zinc-800/60 rounded-lg p-3 break-all select-all text-center tracking-widest"
  }, serviceKey)), React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, React.createElement("button", {
    onClick: handleCopy,
    className: "flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium py-3 rounded-xl transition-colors text-sm"
  }, copied ? React.createElement(Check, {
    size: 16,
    className: "text-green-400"
  }) : React.createElement(Copy, {
    size: 16
  }), copied ? 'Copied!' : 'Copy Key'), React.createElement("button", {
    onClick: handleDownload,
    className: "flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium py-3 rounded-xl transition-colors text-sm"
  }, downloaded ? React.createElement(Check, {
    size: 16,
    className: "text-green-400"
  }) : React.createElement(Download, {
    size: 16
  }), downloaded ? 'Saved!' : 'Download')), React.createElement("button", {
    onClick: handleContinue,
    disabled: !hasSaved,
    className: `w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl transition-colors
            ${hasSaved ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`
  }, "Continue", React.createElement(ArrowRight, {
    size: 16
  })), !hasSaved && React.createElement("p", {
    className: "text-center text-[10px] text-zinc-700"
  }, "Copy or download your key to continue")));
}
