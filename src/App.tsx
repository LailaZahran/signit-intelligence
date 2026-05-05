import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PersonaProvider } from "@/context/PersonaContext";
import { LanguageProvider } from "@/context/LanguageContext";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

import Landing from "@/pages/Landing";
import ContractList from "@/pages/ContractList";
import ContractDetail from "@/pages/ContractDetail";
import Portfolio from "@/pages/Portfolio";
import Upload from "@/pages/Upload";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/contracts" component={ContractList} />
        <Route path="/contracts/:id" component={ContractDetail} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/upload" component={Upload} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <PersonaProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </PersonaProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
