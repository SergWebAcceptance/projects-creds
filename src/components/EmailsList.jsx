"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useProjects } from "@/contexts/ProjectsContext";
import { Eye, Trash2 } from "lucide-react";

function EmailsList() {
  const { projectsCategory, setProjectsCategory } = useProjects();
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          `/api/emails?category=${projectsCategory}&search=${searchQuery}`
        );
        setEmails(response.data.emails);
        console.log(response.data);
      } catch (error) {
        console.error("Could not fetch projects", error);
      }
    };

    fetchEmails();
  }, [projectsCategory, searchQuery]);

  const handleRemove = async (id) => {
    try {
      // Використання axios.delete з конфігурацією для включення тіла запиту
      await axios.delete(`/api/emails`, { data: { id } });
      // Оновлення стану для відображення змін без перезавантаження
      setEmails(emails.filter((email) => email._id !== id));
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
      {emails.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="emails">
            {emails.map((email) => (
              <div
                key={email._id}
                className="projectRow flex items-center px-4 py-2 rounded mb-4 bg-slate-100 justify-between shadow-md"
              >
                <span>{email.email}</span>
                <div className="flex gap-2">
                  <Link
                    className="block rounded-md bg-teal-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                    href={`/emails/${email._id}`}
                  >
                    <Eye />
                  </Link>
                  <button
                    className="block rounded-md bg-red-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    onClick={() => handleRemove(email._id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>...</p>
      )}
    </div>
  );
}

export default EmailsList;
