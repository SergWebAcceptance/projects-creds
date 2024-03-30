"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useProjects } from "@/contexts/ProjectsContext";
import { Eye, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

function ProjectsList() {
  const { data: session, status } = useSession();
  const { projectsCategory, setProjectsCategory } = useProjects();
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log("projectsCategory", projectsCategory);
    if (
      projectsCategory !== "DefaultCategory" &&
      projectsCategory.trim() !== ""
    ) {
      const fetchProjects = async () => {
        try {
          const response = await axios.get(
            `/api/projects?category=${projectsCategory}&search=${searchQuery}`
          );
          setProjects(response.data.projects);
        } catch (error) {
          console.error("Could not fetch projects", error);
        }
      };
      fetchProjects();
    }
  }, [projectsCategory, searchQuery]);

  const handleRemove = async (id) => {
    try {
      // Використання axios.delete з конфігурацією для включення тіла запиту
      await axios.delete(`/api/projects`, { data: { id } });
      // Оновлення стану для відображення змін без перезавантаження
      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      console.error(
        "Could not delete project",
        error.response?.data?.message || error.message
      );
      // Тут можна додати обробку помилок, наприклад, показати повідомлення користувачу
    }
  };

  return (
    <div>
      <div className="search-bar mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Optionally trigger a search directly when the form is submitted
            // fetchProjects(searchQuery);
          }}
        >
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              id="Search"
              placeholder="Search for..."
              className="w-full border rounded-md border-gray-200 py-2.5 px-4 pe-10 shadow-sm sm:text-sm"
            />

            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-700"
              >
                <span className="sr-only">Search</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </span>
          </div>
        </form>
      </div>

      {projects.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="projects">
            {projects.map((project) => (
              <div
                key={project._id}
                className="projectRow flex items-center px-4 py-2 rounded mb-4 bg-slate-100 justify-between shadow-md"
              >
                <span>{project.domain}</span>
                <div className="flex gap-2">
                  <Link
                    className="flex gap-2 items-center rounded-md bg-teal-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                    href={`/projects/${project._id}`}
                  >
                    <Eye />
                  </Link>
                  <button
                    className="flex gap-2 items-center rounded-md bg-red-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    onClick={() => handleRemove(project._id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Domain Registrar
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Hosting
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Wordpress
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  DNS account
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  GitHub Account
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project._id}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">
                    {project.domain}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                    <p>
                      {project.domainRegistrar.name} <br />
                      Login: {project.domainRegistrar.login}
                      <br />
                      Password: {project.domainRegistrar.password}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                    <p>
                      {project.hosting.name} <br />
                      Login: {project.hosting.login}
                      <br />
                      Password: {project.hosting.password}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                    {project.wpAdmin.login && (
                      <p>
                        Login: {project.wpAdmin.login}
                        <br /> Password: {project.wpAdmin.password}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                    {project.dns && (
                      <p>
                        Login: {project.dns.login}
                        <br />
                        Password: {project.dns.password}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                    {project.github.login && (
                      <p>
                        Login: {project.github.login}
                        <br />
                        Password: {project.github.password}
                      </p>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleRemove(project._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>...</p>
      )}
    </div>
  );
}

export default ProjectsList;
