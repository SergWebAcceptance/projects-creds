"use client";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import ProjectForm from "@/components/ProjectForm";
import ProjectsList from "@/components/ProjectsList";
import SidebarNavigation from "@/components/SidebarNavigation";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main>
        <div className="flex gap-7 w-full mt-5">
          Loading...
        </div>
      </main>
    );
  }

  if (status === "authenticated") {
    return (
      <main>
        <div className="flex gap-7 w-full mt-5">
          <div className="w-1/4">
            <SidebarNavigation />
          </div>
          <div className="w-3/4">
            <ProjectsList />
          </div>
        </div>
      </main>
    );
  }

  return <LoginForm/>;

}
