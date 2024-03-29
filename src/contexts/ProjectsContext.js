'use client';
import React, { useState, createContext, useContext } from 'react';

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projectsCategory, setProjectsCategory] = useState('Anywires');

  return (
    <ProjectsContext.Provider value={{ projectsCategory, setProjectsCategory }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectsContext);
