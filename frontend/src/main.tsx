import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLoader from './components/loader/app-loader.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import FontSizeProvider from './providers/font-size-provider.tsx';
import NetworkProvider from './providers/network-provider.tsx';
import ThemeProvider from './providers/theme-provider.tsx';

const App = lazy(() => import('./App.tsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<AppLoader />}>
      <GoogleOAuthProvider clientId="264357646431-h94qfkhietkh62c234do423160s9nd45.apps.googleusercontent.com">
        <QueryClientProvider client={queryClient}>
          <NetworkProvider>
            <TooltipProvider>
              <App />
              <Toaster expand={true} />
              <ThemeProvider />
              <FontSizeProvider />
            </TooltipProvider>
          </NetworkProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </Suspense>
  </StrictMode>,
);
