// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT, // Make sure you add this in your .env file
  }),
  cache: new InMemoryCache(),
});

export default client;

