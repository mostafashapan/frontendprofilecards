import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client'; // Import ApolloProvider
import App from './App';
import client from './apolloClient'; // Import Apollo Client configuration

// Get the root element where your app will be rendered
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Wrap your app with ApolloProvider and StrictMode
root.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
