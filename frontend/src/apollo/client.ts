import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

/**
 * Error handling link.
 * Catches GraphQL and network errors globally and logs them to the console.
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

/**
 * HTTP link.
 * Specifies the GraphQL endpoint for API requests.
 */
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
});


/**
 * Apollo Client instance.
 * Combines the error and HTTP links and sets up an in-memory cache.
 */
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
