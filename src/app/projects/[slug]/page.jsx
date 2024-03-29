"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ProjectForm from "@/components/ProjectForm";

function SingleProject({ params: { slug } }) {
  const [project, setProject] = useState();
  const [editableForm, setEditableForm] = useState(false);
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/projects?id=${slug}`);
        setProject(response.data.project);
      } catch (error) {
        console.error("Could not fetch projects", error);
        // Тут можна додати обробку помилок
      }
    };

    fetchProject();
  }, []);

  const handleEditable = () => {
    setEditableForm(!editableForm);
  };

  return (
    <>
      {project ? (
        <>
          <ProjectForm projectData={project} editable={editableForm} />
          {!editableForm ? (
            <button
              onClick={() => handleEditable()}
              className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={() => handleEditable()}
              className="mt-4 inline-block w-full rounded-lg bg-red-600 px-5 py-3 font-medium text-white sm:w-auto"
            >
              Cancel edit
            </button>
          )}
        </>
      ) : (
        "Loading"
      )}
    </>
  );
}

export default SingleProject;
