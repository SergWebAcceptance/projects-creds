"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectForm from "@/components/ProjectForm";
import { useSession } from "next-auth/react";

function SingleProject({ params: { slug } }) {
  const [project, setProject] = useState();
  const [editableForm, setEditableForm] = useState(false);
  const { data: session, status } = useSession();
  const userRole = session ? session.user.role : "";

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/projects?id=${slug}`);
        setProject(response.data.project);
      } catch (error) {
        console.error("Could not fetch projects", error);
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
          {userRole !== "manager" &&
            (!editableForm ? (
              <button
                onClick={() => handleEditable()}
                className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={() => handleEditable()}
                className="inline-block w-full rounded-lg bg-red-600 px-5 py-3 font-medium text-white sm:w-auto"
              >
                Cancel edit
              </button>
            ))}
        </>
      ) : (
        "Loading"
      )}
    </>
  );
}

export default SingleProject;
