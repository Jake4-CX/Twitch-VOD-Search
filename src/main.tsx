import ReactDOM from 'react-dom/client'
import '@/index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from '@/redux/provider';
import { ThemeProvider } from '@/components/themeProvider';
import LandingPage from '@/views/landing';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route index element={<LandingPage />} />
    </Route>
  )
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      staleTime: 10000,
      refetchOnWindowFocus: false,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
      <Toaster position='top-right' />
    </QueryClientProvider>
  </ReduxProvider>,
)
