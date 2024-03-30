"use client";
import AddEmailForm from "@/components/AddEmailForm";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function FormEmailsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    if (session?.user?.role === "admin") {
      return <AddEmailForm />;
    } else {
      router.push("/");
    }
  }
}

export default FormEmailsPage;
