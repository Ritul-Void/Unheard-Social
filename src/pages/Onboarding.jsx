import { useState, useRef } from 'react';
import { UserPlus, Key, Loader2, Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import KeyReveal from './KeyReveal';
export default function Onboarding() {
  const {
    signup,
    login
  } = useAuth();
  const [mode, setMode] = useState('welcome');
  const [username, setUsername] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const [serviceKey, setServiceKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  async function handleSignup(e) {
    e.preventDefault();
    if (!username.trim() || username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await signup(username.trim());
      setServiceKey(result.serviceKey);
      setMode('key_reveal');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }
  async function handleLogin(e) {
    e.preventDefault();
    if (!loginKey.trim()) {
      setError('Please enter your service key');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(loginKey.trim());
    } catch (err) {
      setError(err.message || 'Invalid service key');
    } finally {
      setLoading(false);
    }
  }
  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (json.service_key) {
        setLoginKey(json.service_key);
        setLoading(true);
        try {
          await login(json.service_key);
        } catch (err) {
          setError(err.message || 'Invalid service key in file');
        } finally {
          setLoading(false);
        }
      } else {
        setError('No service_key found in the JSON file');
      }
    } catch {
      setError('Invalid JSON file');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
  if (mode === 'key_reveal') {
    return React.createElement(KeyReveal, {
      serviceKey: serviceKey,
      username: username
    });
  }
  return React.createElement("div", {
    className: "min-h-screen bg-zinc-950 flex items-center justify-center px-4"
  }, React.createElement("div", {
    className: "w-full max-w-sm space-y-8"
  }, React.createElement("div", {
    className: "text-center space-y-2"
  }, React.createElement("h1", {
    className: "text-3xl font-bold text-zinc-100 tracking-tight"
  }, "Unheard"), React.createElement("p", {
    className: "text-sm text-zinc-500"
  }, "Share anonymously. Be heard.")), mode === 'welcome' && React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("button", {
    onClick: () => setMode('signup'),
    className: "w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-zinc-950 font-medium py-3 rounded-xl transition-colors"
  }, React.createElement(UserPlus, {
    size: 18
  }), "Create Account"), React.createElement("button", {
    onClick: () => setMode('login'),
    className: "w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium py-3 rounded-xl transition-colors"
  }, React.createElement(Key, {
    size: 18
  }), "Login with Service Key")), mode === 'signup' && React.createElement("form", {
    onSubmit: handleSignup,
    className: "space-y-4"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide"
  }, "Choose a username"), React.createElement("input", {
    type: "text",
    value: username,
    onChange: e => setUsername(e.target.value),
    placeholder: "e.g. silentvoice",
    maxLength: 24,
    autoFocus: true,
    className: "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition"
  })), error && React.createElement("p", {
    className: "text-xs text-red-400"
  }, error), React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-medium py-3 rounded-xl transition-colors"
  }, loading ? React.createElement(Loader2, {
    size: 18,
    className: "animate-spin"
  }) : React.createElement(UserPlus, {
    size: 18
  }), loading ? 'Creating...' : 'Continue'), React.createElement("button", {
    type: "button",
    onClick: () => {
      setMode('welcome');
      setError('');
    },
    className: "w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1"
  }, "Back")), mode === 'login' && React.createElement("form", {
    onSubmit: handleLogin,
    className: "space-y-4"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide"
  }, "Service Key"), React.createElement("input", {
    type: "text",
    value: loginKey,
    onChange: e => setLoginKey(e.target.value),
    placeholder: "Paste your 25-character key",
    autoFocus: true,
    className: "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 font-mono focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition"
  })), React.createElement("div", null, React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    accept: ".json",
    onChange: handleFileUpload,
    className: "hidden",
    id: "key-file-upload"
  }), React.createElement("button", {
    type: "button",
    onClick: () => fileInputRef.current?.click(),
    className: "w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 font-medium py-2.5 rounded-xl transition-colors text-sm"
  }, React.createElement(Upload, {
    size: 16
  }), "Upload JSON Key File")), error && React.createElement("p", {
    className: "text-xs text-red-400"
  }, error), React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-medium py-3 rounded-xl transition-colors"
  }, loading ? React.createElement(Loader2, {
    size: 18,
    className: "animate-spin"
  }) : React.createElement(Key, {
    size: 18
  }), loading ? 'Verifying...' : 'Login'), React.createElement("button", {
    type: "button",
    onClick: () => {
      setMode('welcome');
      setError('');
    },
    className: "w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1"
  }, "Back"))));
}
