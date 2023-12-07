import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Header from "~/components/header";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "~/stores";
import Footer from "~/components/footer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const currentTheme = useThemeStore.use.theme();
  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen w-full flex-col pt-[95px]">
        <ThemeProvider
          attribute="class"
          defaultTheme={currentTheme}
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <Component {...pageProps} />
          <Toaster />
          <Footer />
        </ThemeProvider>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
