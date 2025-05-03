import {
  createTRPCProxyClient,
  httpBatchLink,
  splitLink,
  createWSClient,
  wsLink,
  getFetch,
  loggerLink,
} from "@trpc/client";
import type { AppRouter } from "@backend/src/routes";

// HTTP(S) endpoint вашего tRPC-сервера
const httpUrl = "http://localhost:4000/trpc";
// Автоматически переключаем на ws:// или wss://
const wsUrl = httpUrl.replace(/^http/, "ws");

function getCookie(name: string): string | undefined {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
  return value ? decodeURIComponent(value) : undefined;
}

// WebSocket-клиент для подписок
const wsClient = createWSClient({
  url: wsUrl,
  connectionParams: async () => {
    return {
      token: getCookie("access_token"),
    };
  },
});

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink(),
    splitLink({
      // для подписок — WS
      condition: (op) => op.type === "subscription",
      true: wsLink({ client: wsClient }),
      // для queries и mutations — HTTP
      false: httpBatchLink({
        url: httpUrl,
        fetch: (input, init) => {
          const fetch = getFetch();
          return fetch(input, {
            ...init,
            credentials: "include",
          });
        },
      }),
    }),
  ],
});

export default trpc;
