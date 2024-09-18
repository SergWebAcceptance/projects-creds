"use client";
import { useProjects } from "@/contexts/ProjectsContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();
  const { projectsCategory, setProjectsCategory } = useProjects();
  const { data: session, status } = useSession();
  const userRole = session ? session.user.role : "";

  const logoutHandler = async () => {
    await signOut({ redirect: false });
    // Optionally, redirect the user after logging out
    router.replace("/");
  };

    return (
      <header className="bg-white w-full mb-10">
        <div className="mx-auto flex max-w-screen-xl items-center gap-8 px-4  mt-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 flex-col sm:flex-row items-center justify-between gap-4">
            <nav aria-label="Global" className="block">
              <ul className="flex items-center gap-6 text-xs">
                {userRole !== "manager" && (
                  <li>
                    <Link
                      className={`text-gray-500 pb-1 border-b-2  transition hover:text-gray-500/75 ${
                        projectsCategory == "Development"
                          ? "border-teal-600"
                          : "border-white"
                      }`}
                      onClick={() => setProjectsCategory("Development")}
                      href={"/"}
                      data-category={projectsCategory}
                    >
                      Development
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    className={`text-gray-500 pb-1 border-b-2 transition hover:text-gray-500/75 ${
                      projectsCategory == "TradeProof"
                        ? "border-teal-600"
                        : "border-white"
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

            <div className="flex items-center gap-3">
              <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:flex sm:gap-2">
                {userRole !== "manager" && (
                  <>
                    <Link
                      className="flex gap-2 items-center rounded-md bg-teal-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-teal-700"
                      href="/users"
                    >
                      Users
                    </Link>
                    <Link
                      className="flex gap-2 items-center rounded-md bg-teal-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-teal-700"
                      href="/form-email"
                    >
                      <Plus /> Email
                    </Link>
                    <Link
                      className="flex gap-2 items-center rounded-md bg-teal-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-teal-700"
                      href="/form-hostings"
                    >
                      <Plus /> Hosting
                    </Link>
                    <Link
                      className="flex gap-2 items-center rounded-md bg-teal-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-teal-700"
                      href="/form-domain-registers"
                    >
                      <Plus /> Domain Registrar
                    </Link>
                    <Link
                      className="flex gap-2 items-center rounded-md bg-teal-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-teal-700"
                      href="/form-dns"
                    >
                      <Plus /> DNS Account
                    </Link>
                    <Link
                      className="flex gap-2 items-center rounded-md bg-teal-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-teal-700"
                      href="/form-ftp"
                    >
                      <Plus /> FTP Account
                    </Link>
                    <Link
                      className="flex gap-2 items-center rounded-md bg-teal-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-teal-700"
                      href="/form-git"
                    >
                      <Plus /> Git Account
                    </Link>
                    <Link
                      className="flex gap-2 items-center rounded-md bg-teal-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-teal-700"
                      href="/form"
                    >
                      <Plus /> Project
                    </Link>
                  </>
                )}

                <button
                  className="flex gap-2 items-center rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  
}

export default Header;
