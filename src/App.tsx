import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";

import Index from "./pages/Index";
import TripPlanner from "./pages/TripPlanner";
import DestinationPage from "./pages/DestinationPage";
import HyderabadPage from "./pages/HyderabadPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/* Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planner" element={<TripPlanner />} />
          <Route path="/destination/hyderabad" element={<HyderabadPage />} />
          <Route path="/destination/:slug" element={<DestinationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;