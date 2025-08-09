
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PinterestGuide from "./pages/PinterestGuide";
import NichePage from "./pages/NichePage";
import NotFound from "./pages/NotFound";
import BillingSuccess from "./pages/BillingSuccess";
import BillingCanceled from "./pages/BillingCanceled";
import BillingPortalReturn from "./pages/BillingPortalReturn";
import BillingStatus from "./pages/BillingStatus";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/generate-pins" element={<PinterestGuide />} />
                <Route path="/niche/:category/:subcategory" element={<NichePage />} />
                <Route path="/billing/success" element={<BillingSuccess />} />
                <Route path="/billing/canceled" element={<BillingCanceled />} />
                <Route path="/billing/portal-return" element={<BillingPortalReturn />} />
                <Route path="/billing/status" element={<BillingStatus />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
