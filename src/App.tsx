import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext";
import EducatorLanding from "./pages/EducatorLanding";
import SubmissionDetail from "./pages/SubmissionDetail";
import Profile from "./pages/Profile";
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EducatorLanding />} />
            <Route path="/educator-landing" element={<EducatorLanding />} />
            <Route path="/submission-detail" element={<SubmissionDetail />} />
            <Route path="/dashboard" element={<SubmissionDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
