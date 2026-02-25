import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { usePosts } from './hooks/usePosts';
import Navbar from './components/Navbar';
import FeedPage from './pages/FeedPage';
import './App.css';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Onboarding from './pages/Onboarding';
import PostViewPage from './pages/PostViewPage';
import PostEditorPage from './pages/PostEditorPage';
import { Loader2 } from 'lucide-react';
function AppContent() {
  const {
    user,
    loading,
    showKeySaved
  } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [viewingPostId, setViewingPostId] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const {
    posts,
    relatedSet,
    loading: postsLoading,
    sortBy,
    setSortBy,
    addPost,
    toggleRelate,
    loadPosts
  } = usePosts();
  if (loading) {
    return React.createElement("div", {
      className: "min-h-screen flex items-center justify-center bg-zinc-950"
    }, React.createElement(Loader2, {
      className: "animate-spin",
      size: 32,
      style: {
        color: 'var(--color-primary)'
      }
    }));
  }
  if (!user || user && !showKeySaved && !localStorage.getItem('unheard_key_saved')) {
    if (user && !showKeySaved) {}
    if (!user) {
      return React.createElement(Onboarding, null);
    }
  }
  if (user && !localStorage.getItem('unheard_key_saved')) {
    localStorage.setItem('unheard_key_saved', 'true');
  }
  async function handlePostCreated(postData) {
    await addPost(postData);
    await loadPosts();
    setActiveTab('feed');
  }
  function handleOpenPost(postId) {
    setViewingPostId(postId);
  }
  function handleBackFromPost() {
    setViewingPostId(null);
  }
  if (showEditor) {
    return React.createElement(PostEditorPage, {
      onSubmit: handlePostCreated,
      onClose: () => setShowEditor(false)
    });
  }
  if (viewingPostId) {
    return React.createElement(PostViewPage, {
      postId: viewingPostId,
      isRelated: relatedSet.has(viewingPostId),
      onRelate: toggleRelate,
      onBack: handleBackFromPost
    });
  }
  return React.createElement("div", {
    className: "min-h-screen bg-zinc-950",
    style: {
      fontSize: 'var(--font-size-base)'
    }
  }, activeTab === 'feed' && React.createElement(FeedPage, {
    posts: posts,
    relatedSet: relatedSet,
    loading: postsLoading,
    sortBy: sortBy,
    setSortBy: setSortBy,
    toggleRelate: toggleRelate,
    onOpenPost: handleOpenPost
  }), activeTab === 'profile' && React.createElement(ProfilePage, {
    onOpenEditor: () => setShowEditor(true),
    onPostDeleted: loadPosts
  }), activeTab === 'settings' && React.createElement(SettingsPage, null), React.createElement(Navbar, {
    activeTab: activeTab,
    onTabChange: setActiveTab
  }));
}
export default function App() {
  return React.createElement(AppContent, null);
}
