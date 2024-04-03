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
      <Link href="/hostings" className={`rounded block p-2 ${isActive('/hostings') ? 'bg-teal-600 text-white' : ''}`}>Hostings</Link>
      <Link href="/domain-registrars" className={`rounded block p-2 ${isActive('/domain-registrars') ? 'bg-teal-600 text-white' : ''}`}>Domain Registrars</Link>
      <Link href="/dns-accounts" className={`rounded block p-2 ${isActive('/dns-accounts') ? 'bg-teal-600 text-white' : ''}`}>DNS Accounts</Link>
      <Link href="/ftp-accounts" className={`rounded block p-2 ${isActive('/ftp-accounts') ? 'bg-teal-600 text-white' : ''}`}>FTP Accounts</Link>
      <Link href="/git-accounts" className={`rounded block p-2 ${isActive('/git-accounts') ? 'bg-teal-600 text-white' : ''}`}>Git Accounts</Link>
    </nav>
  );
}

export default SidebarNavigation;
