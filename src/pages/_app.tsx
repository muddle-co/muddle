import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter, Outfit } from "next/font/google";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [parent] = useAutoAnimate();
  return (
    <SessionProvider session={session}>
      <style jsx global>{`
        h1,
        h2,
        h3 {
          font-family: ${outfit.style.fontFamily};
        }
      `}</style>
      <div className={inter.className} ref={parent}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
