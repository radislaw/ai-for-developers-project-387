import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './App.css';
import App from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);