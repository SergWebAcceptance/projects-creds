import EmailsList from "@/components/EmailsList";
import SidebarNavigation from "@/components/SidebarNavigation";
import React from "react";

function Emails() {
  return (
    <main>
      <div className="flex gap-7 w-full mt-5">
        <div className="w-1/4">
          <SidebarNavigation />
        </div>
        <div className="w-3/4">
          <EmailsList />
        </div>
      </div>
    </main>
  );
}

export default Emails;
