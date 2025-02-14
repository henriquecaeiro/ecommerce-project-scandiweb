import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

// Lazy loading the pages to optimize performance
const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ProductDetail = lazy(() => import("../pages/ProductDetail/ProductDetail"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound")); 

/**
 * AppRoutes Component
 * Defines all application routes and wraps them in Suspense for lazy loading
 */
const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen/>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} /> {/* 404 fallback route */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
