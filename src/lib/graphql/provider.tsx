"use client";

import { ReactNode } from "react";
import { Provider } from "urql";
import { graphqlClient } from "./client";

export function GraphqlProvider({ children }: { children: ReactNode }) {
  return <Provider value={graphqlClient}>{children}</Provider>;
}
