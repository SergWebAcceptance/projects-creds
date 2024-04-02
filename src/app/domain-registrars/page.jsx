import DomainRegistrarsList from "@/components/DomainRegistrarsList";
import EmailsList from "@/components/EmailsList";
import HostingsList from "@/components/HostingsList";
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
          <DomainRegistrarsList/>
        </div>
      </div>
    </main>
  );
}

export default Emails;
