"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddHostingForm from "@/components/AddHostingForm";

function FormHostingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    if (session?.user?.role === "admin") {
      return <AddHostingForm/>
    } else {
      router.push("/");
    }
  }
}

export default FormHostingsPage;
