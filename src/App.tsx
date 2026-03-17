import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext";
import Welcome from "./pages/Welcome";
import OnboardingResident from "./pages/OnboardingResident";
import OnboardingResidentStep2 from "./pages/OnboardingResidentStep2";
import OnboardingEducator from "./pages/OnboardingEducator";
import DashboardResident from "./pages/DashboardResident";
import DashboardEducator from "./pages/DashboardEducator";
import NewSubmission from "./pages/NewSubmission";
import SubmissionDetail from "./pages/SubmissionDetail";
import Submissions from "./pages/Submissions";
import TraineeProfile from "./pages/TraineeProfile";
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
            <Route path="/" element={<SubmissionDetail />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/onboarding-resident" element={<OnboardingResident />} />
            <Route path="/onboarding-resident-step2" element={<OnboardingResidentStep2 />} />
            <Route path="/onboarding-educator" element={<OnboardingEducator />} />
            <Route path="/dashboard-resident" element={<SubmissionDetail />} />
            <Route path="/dashboard-educator" element={<SubmissionDetail />} />
            <Route path="/new-submission" element={<NewSubmission />} />
            <Route path="/submission-detail" element={<SubmissionDetail />} />
            <Route path="/submissions" element={<SubmissionDetail />} />
            <Route path="/trainee-profile" element={<TraineeProfile />} />
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
