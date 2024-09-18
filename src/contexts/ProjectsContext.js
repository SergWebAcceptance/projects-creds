"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useSession } from "next-auth/react";
import Preloader from "@/components/Preloader";
import LoginForm from "@/components/LoginForm";

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [projectsCategory, setProjectsCategory] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const defaultCategory =
        session.user.role !== "manager" ? "Development" : "TradeProof";
      setProjectsCategory(defaultCategory);
    } else if (status === "unauthenticated") {
      // Встановіть значення за замовчуванням або обробіть відсутність аутентифікації
      setProjectsCategory("DefaultCategory");
    }
  }, [session?.user?.role, status]); // Тепер залежить безпосередньо від role та status

  if (status === "loading") {
    return <Preloader />;
  }

  if (status === "authenticated") {
    return (
      <ProjectsContext.Provider
        value={{ projectsCategory, setProjectsCategory }}
      >
        {children}
      </ProjectsContext.Provider>
    );
  }

  return <LoginForm/>

};

export const useProjects = () => useContext(ProjectsContext);
