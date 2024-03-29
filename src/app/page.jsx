'use client';
import Header from "@/components/Header";
import ProjectForm from "@/components/ProjectForm";
import ProjectsList from "@/components/ProjectsList";
import SidebarNavigation from "@/components/SidebarNavigation";
import { useProjects } from "@/contexts/ProjectsContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  

  return (
    <main>
      <div className="flex gap-7 w-full mt-5">
        <div className="w-1/4">
          <SidebarNavigation/>
        </div>
        <div className="w-3/4">
          <ProjectsList/>
        </div>
      </div>
    </main>
  );
}
