import DnsAccountsList from "@/components/DnsAccountsList";
import SidebarNavigation from "@/components/SidebarNavigation";
import React from "react";

function Emails() {
  return (
    <main>
      <div className="flex flex-col sm:flex-row gap-7 w-full mt-5">
        <div className="w-full sm:w-1/4">
          <SidebarNavigation />
        </div>
        <div className="w-full sm:w-3/4">
          <DnsAccountsList/>
        </div>
      </div>
    </main>
  );
}

export default Emails;
