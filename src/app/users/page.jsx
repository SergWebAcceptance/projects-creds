'use client';
import AllowedUserForm from "@/components/AllowedUserForm";
import UserList from "@/components/UserList";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    if (session?.user?.role === "admin") {
      return (
        <div className="flex flex-col sm:flex-row gap-7 w-full mt-5">
          <div className="w-full sm:w-1/4">
            <h2>Add new user</h2>
            <AllowedUserForm />
          </div>
          <div className="w-full sm:w-3/4">
            <UserList />
          </div>
        </div>
      );
    } else {
      router.push("/");
    }
  }
}

export default Dashboard;
