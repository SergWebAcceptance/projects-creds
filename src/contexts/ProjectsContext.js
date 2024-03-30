'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useSession } from "next-auth/react";

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const { data: session } = useSession();
  const [projectsCategory, setProjectsCategory] = useState('');
  const userRole = session ? session.user.role : '';

  useEffect(() => {
    const defaultCategory =  userRole !== "manager" ? 'Anywires' : 'TradeProof';
    setProjectsCategory(defaultCategory);
  }, [session]);

  

  return (
    <ProjectsContext.Provider value={{ projectsCategory, setProjectsCategory }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectsContext);
