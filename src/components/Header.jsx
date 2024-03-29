"use client";
import { useProjects } from "@/contexts/ProjectsContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

function Header() {
  const { projectsCategory, setProjectsCategory } = useProjects();
  return (
    <header className="bg-white w-full">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link
                  className={`text-gray-500 pb-1 border-b-2  transition hover:text-gray-500/75 ${
                    projectsCategory == "Anywires" ? "border-teal-600" : "border-white"
                  }`}
                  onClick={() => setProjectsCategory("Anywires")}
                  href={"/"}
                  data-category={projectsCategory}
                >
                  Anywires
                </Link>
              </li>
              <li>
                <Link
                  className={`text-gray-500 pb-1 border-b-2 transition hover:text-gray-500/75 ${
                    projectsCategory == "TradeProof" ? "border-teal-600" : "border-white"
                  }`}
                  onClick={() => setProjectsCategory("TradeProof")}
                  href={"/"}
                  data-category={projectsCategory}
                >
                  TradeProf
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                className="flex gap-2 items-center rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                href="/form-email"
              >
                <Plus /> Email
              </Link>
              <Link
                className="flex gap-2 items-center rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                href="/form"
              >
                <Plus /> Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
