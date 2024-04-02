"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddDomainRegisterForm from "@/components/AddDomainRegisterForm";

function FormHostingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    if (session?.user?.role === "admin") {
      return <AddDomainRegisterForm/>
    } else {
      router.push("/");
    }
  }
}

export default FormHostingsPage;
