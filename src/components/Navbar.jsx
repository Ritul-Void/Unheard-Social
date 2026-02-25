import { Home, User, Settings } from 'lucide-react';
import { useCustomization } from '../hooks/useCustomization';
const tabs = [{
  id: 'feed',
  label: 'Feed',
  Icon: Home
}, {
  id: 'profile',
  label: 'Profile',
  Icon: User
}, {
  id: 'settings',
  label: 'Settings',
  Icon: Settings
}];
export default function Navbar({
  activeTab,
  onTabChange
}) {
  const {
    prefs
  } = useCustomization();
  const isPill = prefs.navStyle === 'pill';
  if (isPill) {
    return React.createElement("nav", {
      className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    }, React.createElement("div", {
      className: "flex items-center gap-1 bg-zinc-900/95 backdrop-blur border border-zinc-800 rounded-full px-2 py-1.5 shadow-lg shadow-black/30"
    }, tabs.map(({
      id,
      label,
      Icon
    }) => {
      const active = activeTab === id;
      return React.createElement("button", {
        key: id,
        onClick: () => onTabChange(id),
        className: `flex items-center gap-1.5 px-4 py-2 rounded-full transition-all text-xs font-medium
                  ${active ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'}`,
        style: active ? {
          backgroundColor: 'var(--color-primary)',
          color: '#09090b'
        } : {}
      }, React.createElement(Icon, {
        size: 16,
        strokeWidth: active ? 2.5 : 1.5
      }), active && React.createElement("span", null, label));
    })));
  }
  return React.createElement("nav", {
    className: "fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur border-t border-zinc-800"
  }, React.createElement("div", {
    className: "max-w-lg mx-auto flex justify-around items-center h-14"
  }, tabs.map(({
    id,
    label,
    Icon
  }) => {
    const active = activeTab === id;
    return React.createElement("button", {
      key: id,
      onClick: () => onTabChange(id),
      className: "flex flex-col items-center gap-0.5 px-4 py-2 transition-colors",
      style: {
        color: active ? 'var(--color-primary)' : undefined
      }
    }, React.createElement(Icon, {
      size: 20,
      strokeWidth: active ? 2.5 : 1.5,
      className: active ? '' : 'text-zinc-500'
    }), React.createElement("span", {
      className: `text-[10px] font-medium ${active ? '' : 'text-zinc-500'}`
    }, label));
  })));
}
