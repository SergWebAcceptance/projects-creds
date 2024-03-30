"use client";
import ProjectsList from "@/components/ProjectsList";
import SidebarNavigation from "@/components/SidebarNavigation";


export default function Home() {

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
