"use client";
import React from "react";
import Link from "next/link";
import { usePathname  } from "next/navigation";

function SidebarNavigation() {
  const pathname = usePathname();
  console.log(pathname);


  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="flex flex-col gap-3 bg-gray-100 px-4 py-4 rounded-lg">
      <Link
        href="/"
        className={`rounded block p-2 ${isActive("/") ? "bg-teal-600 text-white" : ""}`}
      >
        Projects
      </Link>
      <Link href="/emails" className={`rounded block p-2 ${isActive('/emails') ? 'bg-teal-600 text-white' : ''}`}>Emails</Link>
    </nav>
  );
}

export default SidebarNavigation;
