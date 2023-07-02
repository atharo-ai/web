import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { MantineProvider, createEmotionCache } from "@mantine/core";

import "~/styles/globals.css";

const myCache = createEmotionCache({
  key: "mantine",

  // Fix overwrite by Tailwind
  // https://github.com/mantinedev/mantine/issues/823
  prepend: false,
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider emotionCache={myCache}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
