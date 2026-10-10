import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Onboarding from '../pages/onboarding/Onboarding';
import Profile from '../pages/profile/Profile';
import NotFound from '../pages/NotFound';
import AppShell from '../components/layout/AppShell';
import Home from '../pages/dashboard/Home';
import Wardrobe from '../pages/wardrobe/Wardrobe';
import WardrobeItemDetails from '../pages/wardrobe/WardrobeItemDetails';
import EditWardrobeItem from '../pages/wardrobe/EditWardrobeItem';
import AddWardrobeItem from '../pages/wardrobe/AddWardrobeItem';
import Outfits from '../pages/outfits/Outfits';
import OutfitDetails from '../pages/outfits/OutfitDetails';
import Planner from '../pages/planner/Planner';
import Inspiration from '../pages/inspiration/Inspiration';
import InspirationDetails from '../pages/inspiration/InspirationDetails';
import Analytics from '../pages/analytics/Analytics';

const FullPageLoader = () => (
  <div className="full-page-loader">
    <div className="loader-circle"></div>
    <p style={{ fontWeight: 500, marginTop: '8px' }}>Wardrobe AI<br/><span style={{fontSize: '0.85rem', fontWeight: 400}}>Loading...</span></p>
  </div>
);

const ProtectedRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return <AppShell />;
};

const OnboardingRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.onboardingCompleted) return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
};

const PublicRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <FullPageLoader />;
  if (isAuthenticated) {
    return user?.onboardingCompleted ? <Navigate to="/app/dashboard" replace /> : <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/onboarding" element={<OnboardingRoute />}>
          <Route index element={<Onboarding />} />
        </Route>
        <Route path="/app" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Home />} />
          <Route path="wardrobe" element={<Wardrobe />} />
          <Route path="wardrobe/add" element={<AddWardrobeItem />} />
          <Route path="wardrobe/:id" element={<WardrobeItemDetails />} />
          <Route path="wardrobe/:id/edit" element={<EditWardrobeItem />} />
          
          <Route path="outfits" element={<Outfits />} />
          <Route path="outfits/:id" element={<OutfitDetails />} />
          <Route path="outfits/history" element={<Navigate to="/app/outfits" replace />} />
          
          <Route path="planner" element={<Planner />} />
          <Route path="inspiration" element={<Inspiration />} />
          <Route path="inspiration/:id" element={<InspirationDetails />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route index element={<Navigate to="/app/dashboard" replace />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
