import { Download, LogOut, Key, Shield, Paintbrush, Type, Navigation, RotateCcw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCustomization } from '../hooks/useCustomization';
const COLOR_PRESETS = [{
  label: 'White',
  value: '#ffffff'
}, {
  label: 'Violet',
  value: '#a78bfa'
}, {
  label: 'Blue',
  value: '#60a5fa'
}, {
  label: 'Green',
  value: '#4ade80'
}, {
  label: 'Rose',
  value: '#fb7185'
}, {
  label: 'Amber',
  value: '#fbbf24'
}, {
  label: 'Cyan',
  value: '#22d3ee'
}, {
  label: 'Orange',
  value: '#fb923c'
}];
const SECONDARY_PRESETS = [{
  label: 'Zinc',
  value: '#a1a1aa'
}, {
  label: 'Slate',
  value: '#94a3b8'
}, {
  label: 'Stone',
  value: '#a8a29e'
}, {
  label: 'Cool',
  value: '#9ca3af'
}, {
  label: 'Warm',
  value: '#d6d3d1'
}];
const FONT_SIZES = [{
  label: 'Small',
  value: 'small'
}, {
  label: 'Normal',
  value: 'normal'
}, {
  label: 'Large',
  value: 'large'
}];
const NAV_STYLES = [{
  label: 'Full Width',
  value: 'full'
}, {
  label: 'Floating Pill',
  value: 'pill'
}];
export default function SettingsPage() {
  const {
    user,
    serviceKey,
    logout
  } = useAuth();
  const {
    prefs,
    updatePref,
    resetToDefaults
  } = useCustomization();
  function downloadServiceKey() {
    const key = serviceKey || localStorage.getItem('unheard_service_key');
    if (!key) {
      alert('Service key not available locally. You may need to re-login with your key first.');
      return;
    }
    const json = JSON.stringify({
      platform: 'Unheard',
      username: user?.username || 'unknown',
      service_key: key
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
  }
  function handleLogout() {
    if (confirm('Are you sure you want to log out? Make sure you have your service key saved!')) {
      logout();
    }
  }
  return React.createElement("div", {
    className: "max-w-lg mx-auto px-4 pt-4 pb-28 space-y-5"
  }, React.createElement("h1", {
    className: "text-xl font-bold",
    style: {
      color: 'var(--color-primary)'
    }
  }, "Settings"), React.createElement("div", {
    className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
  }, React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("div", {
    className: "p-2 rounded-full bg-zinc-800"
  }, React.createElement(Shield, {
    size: 18,
    style: {
      color: 'var(--color-primary)'
    }
  })), React.createElement("div", null, React.createElement("p", {
    className: "text-sm font-medium",
    style: {
      color: 'var(--color-primary)'
    }
  }, "Account"), React.createElement("p", {
    className: "text-xs",
    style: {
      color: 'var(--color-secondary)'
    }
  }, "@", user?.username)))), React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "flex items-center gap-2 px-1"
  }, React.createElement(Paintbrush, {
    size: 14,
    style: {
      color: 'var(--color-primary)'
    }
  }), React.createElement("span", {
    className: "text-xs font-semibold uppercase tracking-wider",
    style: {
      color: 'var(--color-secondary)'
    }
  }, "Customization")), React.createElement("div", {
    className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
  }, React.createElement("p", {
    className: "text-sm font-medium",
    style: {
      color: 'var(--color-primary)'
    }
  }, "Primary Color"), React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, COLOR_PRESETS.map(c => React.createElement("button", {
    key: c.value,
    onClick: () => updatePref('primaryColor', c.value),
    className: `w-8 h-8 rounded-full border-2 transition-all ${prefs.primaryColor === c.value ? 'border-white scale-110' : 'border-zinc-700 hover:border-zinc-500'}`,
    style: {
      backgroundColor: c.value
    },
    title: c.label
  })))), React.createElement("div", {
    className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
  }, React.createElement("p", {
    className: "text-sm font-medium",
    style: {
      color: 'var(--color-primary)'
    }
  }, "Secondary Color"), React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, SECONDARY_PRESETS.map(c => React.createElement("button", {
    key: c.value,
    onClick: () => updatePref('secondaryColor', c.value),
    className: `w-8 h-8 rounded-full border-2 transition-all ${prefs.secondaryColor === c.value ? 'border-white scale-110' : 'border-zinc-700 hover:border-zinc-500'}`,
    style: {
      backgroundColor: c.value
    },
    title: c.label
  })))), React.createElement("div", {
    className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Type, {
    size: 14,
    style: {
      color: 'var(--color-primary)'
    }
  }), React.createElement("p", {
    className: "text-sm font-medium",
    style: {
      color: 'var(--color-primary)'
    }
  }, "Font Size")), React.createElement("div", {
    className: "flex gap-2"
  }, FONT_SIZES.map(fs => React.createElement("button", {
    key: fs.value,
    onClick: () => updatePref('fontSize', fs.value),
    className: `flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${prefs.fontSize === fs.value ? 'border-zinc-600 text-zinc-950' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`,
    style: prefs.fontSize === fs.value ? {
      backgroundColor: 'var(--color-primary)',
      color: '#09090b'
    } : {}
  }, fs.label)))), React.createElement("div", {
    className: "bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Navigation, {
    size: 14,
    style: {
      color: 'var(--color-primary)'
    }
  }), React.createElement("p", {
    className: "text-sm font-medium",
    style: {
      color: 'var(--color-primary)'
    }
  }, "Navigation Style")), React.createElement("div", {
    className: "flex gap-2"
  }, NAV_STYLES.map(ns => React.createElement("button", {
    key: ns.value,
    onClick: () => updatePref('navStyle', ns.value),
    className: `flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${prefs.navStyle === ns.value ? 'border-zinc-600' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`,
    style: prefs.navStyle === ns.value ? {
      backgroundColor: 'var(--color-primary)',
      color: '#09090b'
    } : {}
  }, ns.label)))), React.createElement("button", {
    onClick: resetToDefaults,
    className: "w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
  }, React.createElement(RotateCcw, {
    size: 13
  }), "Reset to Defaults")), React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("button", {
    onClick: downloadServiceKey,
    className: "w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 hover:bg-zinc-800/60 transition-colors text-left"
  }, React.createElement("div", {
    className: "p-2 rounded-full bg-amber-500/10"
  }, React.createElement(Key, {
    size: 18,
    className: "text-amber-400"
  })), React.createElement("div", {
    className: "flex-1"
  }, React.createElement("p", {
    className: "text-sm font-medium",
    style: {
      color: 'var(--color-primary)'
    }
  }, "Download Service Key"), React.createElement("p", {
    className: "text-xs",
    style: {
      color: 'var(--color-secondary)'
    }
  }, "Save as JSON file")), React.createElement(Download, {
    size: 16,
    className: "text-zinc-600"
  })), React.createElement("button", {
    onClick: handleLogout,
    className: "w-full bg-zinc-900 border border-red-900/30 rounded-2xl p-4 flex items-center gap-3 hover:bg-red-950/30 transition-colors text-left"
  }, React.createElement("div", {
    className: "p-2 rounded-full bg-red-500/10"
  }, React.createElement(LogOut, {
    size: 18,
    className: "text-red-400"
  })), React.createElement("div", {
    className: "flex-1"
  }, React.createElement("p", {
    className: "text-sm font-medium text-red-400"
  }, "Log Out"), React.createElement("p", {
    className: "text-xs text-zinc-500"
  }, "Clear your local session")))), React.createElement("div", {
    className: "text-center pt-2"
  }, React.createElement("p", {
    className: "text-xs text-zinc-700"
  }, "Unheard v2.0"), React.createElement("p", {
    className: "text-[10px] text-zinc-800"
  }, "Anonymous. Authentic. Unheard.")));
}
