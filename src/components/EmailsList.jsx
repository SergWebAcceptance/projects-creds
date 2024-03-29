"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useProjects } from "@/contexts/ProjectsContext";
import { Eye, Trash2 } from "lucide-react";

function EmailsList() {
  const { projectsCategory, setProjectsCategory } = useProjects();
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`/api/emails?category=${projectsCategory}`);
        setEmails(response.data.emails);
        console.log(response.data);
      } catch (error) {
        console.error("Could not fetch projects", error);
      }
    };

    fetchEmails();
  }, [projectsCategory]);

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
                    <Eye/>
                  </Link>
                  <button
                    className="block rounded-md bg-red-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    onClick={() => handleRemove(email._id)}
                  >
                    <Trash2/>
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
