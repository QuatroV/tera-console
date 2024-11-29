import { createTRPCProxyClient, getFetch, httpBatchLink } from "@trpc/client";
import { AppRouter } from "@backend/src/routes";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
      fetch: async (input, init?) => {
        const fetch = getFetch();
        return fetch(input, {
          ...init,
          credentials: "include",
        });
      },
    }),
  ],
});

export default trpc;
