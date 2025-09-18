import { cacheExchange, createClient, fetchExchange } from "urql";

const DEFAULT_GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

export const graphqlClient = createClient({
  url: DEFAULT_GRAPHQL_URL,
  exchanges: [cacheExchange, fetchExchange],
  requestPolicy: "cache-first",
});

export function getGraphqlClient() {
  return graphqlClient;
}
