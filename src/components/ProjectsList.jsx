"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

function ProjectsList({category}) {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/api/projects?category=${category}`);
        setProjects(response.data.projects);
        console.log(response.data);
      } catch (error) {
        console.error("Could not fetch projects", error);
        // Тут можна додати обробку помилок
      }
    };

    fetchProjects();
  }, []);

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
      {projects.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="projects">
            {projects.map((project) => (
              <div
                key={project._id}
                className="projectRow flex items-center px-4 py-2 rounded my-4 bg-slate-100 justify-between shadow-md"
              >
                <span>{project.domain}</span>
                <div className="flex gap-2">
                  <Link
                    className="block rounded-md bg-teal-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                    href={`/projects/${project._id}`}
                  >
                    View
                  </Link>
                  <button
                    className="block rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    onClick={() => handleRemove(project._id)}
                  >
                    Remove
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
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProjectsList;
