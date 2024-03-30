import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import Provider from "@/lib/SessionProvider";
import Preloader from "@/components/Preloader";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Projects credentials",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <Provider>
      <html lang="en">
        <body className={inter.className}>
          <Preloader/>
          <ProjectsProvider>
            <Header />
            <main className="mx-auto max-w-screen-xl px-4 mb-10 sm:px-6 lg:px-8">
              {children}
            </main>
          </ProjectsProvider>
        </body>
      </html>
      </Provider>
  );
}
