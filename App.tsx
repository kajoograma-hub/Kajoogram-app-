
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import SplashScreen from './pages/SplashScreen';
import GetStarted from './pages/GetStarted';
import Auth from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import FriendsList from './pages/FriendsList';
import Wishlist from './pages/Wishlist';
import Discover from './pages/Discover';
import DiscoverSearch from './pages/DiscoverSearch';
import Reels from './pages/Reels';
import Create from './pages/Create';
import CategoryPage from './pages/CategoryPage';
import PlatformPage from './pages/PlatformPage';
import LabelPage from './pages/LabelPage';
import ProductDetails from './pages/ProductDetails';
import VideoDetail from './pages/VideoDetail';
import ChannelPage from './pages/ChannelPage';
import GenericPage from './pages/GenericPage';
import AdminHome from './pages/admin/AdminHome';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPlatforms from './pages/admin/AdminPlatforms';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryDetails from './pages/admin/AdminCategoryDetails';
import AdminSliders from './pages/admin/AdminSliders';
import AdminLabels from './pages/admin/AdminLabels';
import AdminMenuPages from './pages/admin/AdminMenuPages';
import AdminPageEditor from './pages/admin/AdminPageEditor';
import AdminReports from './pages/admin/AdminReports';
import AdminReportDetail from './pages/admin/AdminReportDetail';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminNotificationSend from './pages/admin/AdminNotificationSend';
import Dashboard from './pages/dashboard/Dashboard';
import Analytics from './pages/dashboard/Analytics';
import PostList from './pages/dashboard/PostList';
import { AppContextProvider } from './context/AppContext';
import { ProductContextProvider } from './context/ProductContext';
import { PlatformContextProvider } from './context/PlatformContext';
import { CategoryContextProvider } from './context/CategoryContext';
import { SliderContextProvider } from './context/SliderContext';
import { LabelContextProvider } from './context/LabelContext';
import { ContentContextProvider } from './context/ContentContext';
import { ReportContextProvider } from './context/ReportContext';
import { NotificationContextProvider } from './context/NotificationContext';
import { FriendContextProvider } from './context/FriendContext';
import { PostContextProvider } from './context/PostContext';
import { User } from './types';

// Update this version string to force a cache clear on client devices
const APP_VERSION = '1.0.4-supabase-connect';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children?: React.ReactNode;
}

const ProtectedRoute = ({ isLoggedIn, children }: ProtectedRouteProps) => {
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Strict Admin Route Protection
const AdminRoute = ({ user, children }: { user: User; children?: React.ReactNode }) => {
  if (!user.isLoggedIn || !user.isAdmin) {
    return <Navigate to="/profile" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User>({
    id: '',
    username: '',
    email: '',
    isLoggedIn: false,
    isAdmin: false
  });

  // Version Check & Stale Data Cleanup
  useEffect(() => {
    const currentVersion = localStorage.getItem('app_version');
    if (currentVersion !== APP_VERSION) {
      console.log('New version detected. Cleaning up stale data...');
      
      // Clear specific context storage keys that might hold outdated schema/data
      localStorage.removeItem('kajoogram_content_pages');
      localStorage.removeItem('kajoogram_reports');
      localStorage.removeItem('kajoogram_notifications');
      
      // Update version
      localStorage.setItem('app_version', APP_VERSION);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Supabase Auth Listener
  useEffect(() => {
    // 1. Check active session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const isAdmin = session.user.email === 'patwaadmin@gmail.com';
        setUser(prev => ({
          ...prev,
          id: session.user.id,
          username: session.user.user_metadata?.username || prev.username || 'User',
          email: session.user.email || '',
          isLoggedIn: true,
          isAdmin: isAdmin,
          // Supabase stores extra data in user_metadata
          profilePhoto: session.user.user_metadata?.avatar_url || prev.profilePhoto || undefined
        }));
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const isAdmin = session.user.email === 'patwaadmin@gmail.com';
        setUser(prev => ({
          ...prev,
          id: session.user.id,
          username: session.user.user_metadata?.username || prev.username || 'User',
          email: session.user.email || '',
          isLoggedIn: true,
          isAdmin: isAdmin,
          profilePhoto: session.user.user_metadata?.avatar_url || prev.profilePhoto || undefined
        }));
      } else {
        setUser({
          id: '',
          username: '',
          email: '',
          isLoggedIn: false,
          isAdmin: false
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <AppContextProvider>
      <PlatformContextProvider>
        <CategoryContextProvider>
          <SliderContextProvider>
            <LabelContextProvider>
              <ContentContextProvider>
                <ReportContextProvider>
                  <NotificationContextProvider>
                    <ProductContextProvider>
                      <FriendContextProvider>
                        <PostContextProvider>
                          <HashRouter>
                            <div className="max-w-[480px] mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden">
                              <Routes>
                                {/* Change: Landing page is now Home */}
                                <Route path="/" element={<Home user={user} />} />
                                
                                <Route path="/get-started" element={<GetStarted />} />
                                
                                {/* Fix: Merging partial user updates into current state */}
                                <Route path="/auth" element={<Auth onAuthSuccess={(u) => setUser({ ...user, ...u, isLoggedIn: true })} />} />
                                <Route path="/setup" element={<ProfileSetup user={user} onComplete={(u) => setUser(u)} />} />
                                
                                <Route path="/home" element={<Home user={user} />} />
                                
                                {/* Change: Search is now public */}
                                <Route path="/search" element={<Search />} />

                                {/* Change: Category Page is now public but receives auth state */}
                                <Route path="/category/:id" element={<CategoryPage isLoggedIn={user.isLoggedIn} />} />

                                {/* New Route: Platform Page */}
                                <Route path="/platform/:name" element={<PlatformPage isLoggedIn={user.isLoggedIn} />} />
                                
                                {/* New Route: Label Page */}
                                <Route path="/label/:id" element={<LabelPage isLoggedIn={user.isLoggedIn} />} />

                                {/* New Route: Product Details */}
                                <Route path="/product/:id" element={<ProductDetails />} />

                                {/* Generic Page Viewer (Help, About, etc.) */}
                                <Route path="/page/:pageId" element={<GenericPage />} />
                                
                                <Route path="/discover" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Discover />
                                  </ProtectedRoute>
                                } />

                                <Route path="/discover/search" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <DiscoverSearch />
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/video/:id" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <VideoDetail />
                                  </ProtectedRoute>
                                } />

                                <Route path="/channel/:id" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <ChannelPage />
                                  </ProtectedRoute>
                                } />

                                <Route path="/reels" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Reels />
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/create" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Create />
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/profile" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Profile user={user} onLogout={() => {
                                      supabase.auth.signOut().catch((error) => console.error("Sign out error", error));
                                    }} />
                                  </ProtectedRoute>
                                } />

                                <Route path="/user/:userId" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <UserProfile />
                                  </ProtectedRoute>
                                } />

                                <Route path="/friends" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <FriendsList />
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/wishlist" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Wishlist />
                                  </ProtectedRoute>
                                } />

                                {/* Dashboard Routes */}
                                <Route path="/dashboard" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><Dashboard /></ProtectedRoute>} />
                                <Route path="/dashboard/:metric" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><Analytics /></ProtectedRoute>} />
                                <Route path="/dashboard/:metric/posts" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><PostList /></ProtectedRoute>} />

                                {/* Admin Routes */}
                                <Route path="/admin" element={
                                  <AdminRoute user={user}>
                                    <AdminHome />
                                  </AdminRoute>
                                } />
                                <Route path="/admin/products" element={<AdminRoute user={user}><AdminProducts /></AdminRoute>} />
                                <Route path="/admin/platforms" element={<AdminRoute user={user}><AdminPlatforms /></AdminRoute>} />
                                <Route path="/admin/categories" element={<AdminRoute user={user}><AdminCategories /></AdminRoute>} />
                                <Route path="/admin/categories/:id" element={<AdminRoute user={user}><AdminCategoryDetails /></AdminRoute>} />
                                <Route path="/admin/sliders" element={<AdminRoute user={user}><AdminSliders /></AdminRoute>} />
                                <Route path="/admin/labels" element={<AdminRoute user={user}><AdminLabels /></AdminRoute>} />
                                <Route path="/admin/menu-pages" element={<AdminRoute user={user}><AdminMenuPages /></AdminRoute>} />
                                <Route path="/admin/menu-pages/:pageId" element={<AdminRoute user={user}><AdminPageEditor /></AdminRoute>} />
                                <Route path="/admin/reports" element={<AdminRoute user={user}><AdminReports /></AdminRoute>} />
                                <Route path="/admin/reports/:id" element={<AdminRoute user={user}><AdminReportDetail /></AdminRoute>} />
                                <Route path="/admin/notifications" element={<AdminRoute user={user}><AdminNotifications /></AdminRoute>} />
                                <Route path="/admin/notifications/:mode" element={<AdminRoute user={user}><AdminNotificationSend mode="broadcast" /></AdminRoute>} />
                                <Route path="/admin/notifications/user/:userId" element={<AdminRoute user={user}><AdminNotificationSend mode="personal" /></AdminRoute>} />

                              </Routes>
                            </div>
                          </HashRouter>
                        </PostContextProvider>
                      </FriendContextProvider>
                    </ProductContextProvider>
                  </NotificationContextProvider>
                </ReportContextProvider>
              </ContentContextProvider>
            </LabelContextProvider>
          </SliderContextProvider>
        </CategoryContextProvider>
      </PlatformContextProvider>
    </AppContextProvider>
  );
};

export default App;
