"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddDnsAccountForm from "@/components/AddDnsAccountForm";
import AddFtpAccountForm from "@/components/AddFtpAccountForm";

function FormHostingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    if (session?.user?.role === "admin") {
      return <AddFtpAccountForm/>
    } else {
      router.push("/");
    }
  }
}

export default FormHostingsPage;
