"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useProjects } from "@/contexts/ProjectsContext";
import { Eye, Trash2 } from "lucide-react";
import { countPerPage } from "@/lib/constants";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function DomainRegistrarsList() {
  const { projectsCategory, setProjectsCategory } = useProjects();
  const [registrars, setRegistrars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // State for the selected item

  useEffect(() => {
    console.log("projectsCategory", projectsCategory);
    if (
      projectsCategory !== "DefaultCategory" &&
      projectsCategory.trim() !== ""
    ) {
      const fetchEmails = async () => {
        try {
          const response = await axios.get(
            `/api/registrars?category=${projectsCategory}&search=${searchQuery}&page=${currentPage}&limit=${countPerPage}`
          );
          setRegistrars(response.data.registrars);
          console.log(response.data);
          setTotalPages(Math.ceil(response.data.total / countPerPage));
        } catch (error) {
          console.error("Could not fetch projects", error);
        }
      };

      fetchEmails();
    }
  }, [projectsCategory, searchQuery, currentPage]);

  const handleRemove = async (id) => {
    try {
      // Використання axios.delete з конфігурацією для включення тіла запиту
      await axios.delete(`/api/registrars`, { data: { id } });
      // Оновлення стану для відображення змін без перезавантаження
      setRegistrars(registrars.filter((registrar) => registrar._id !== id));
    } catch (error) {
      console.error(
        "Could not delete project",
        error.response?.data?.message || error.message
      );
      // Тут можна додати обробку помилок, наприклад, показати повідомлення користувачу
    }
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      handleRemove(selectedItem._id);
    }
    closeModal();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginationItems = [];
  for (let p = 1; p <= totalPages; p++) {
    paginationItems.push(
      <li
        key={p}
        className={`block size-8 rounded ${
          currentPage === p
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-gray-100 bg-white text-gray-900"
        } text-center leading-8`}
      >
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(p);
          }}
        >
          {p}
        </Link>
      </li>
    );
  }

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
      {registrars.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="registrars">
            {registrars.map((registrar) => (
              <div
                key={registrar._id}
                className="projectRow flex items-center px-4 py-2 rounded mb-4 bg-slate-100 justify-between shadow-md"
              >
                <div className="w-4/5 flex flex-col sm:flex-row">
                  <span className="w-full sm:w-1/2">{registrar.name}</span>
                  <span className="w-full sm:w-1/2">{registrar.login}</span>
                </div>
                <div className="flex gap-2 w-1/5 justify-end">
                  <Link
                    className="block rounded-md bg-teal-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                    href={`/domain-registrars/${registrar._id}`}
                  >
                    <Eye />
                  </Link>
                  <button
                    className="block rounded-md bg-red-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    onClick={() => openDeleteModal(registrar)}
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

      {totalPages > 1 && (
        <ol
          className="flex justify-center gap-1 text-xs font-medium"
          data-page={currentPage}
          data-total={totalPages}
        >
          {currentPage > 1 && (
            <li>
              <a
                href="#"
                className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          )}

          {paginationItems}

          {currentPage < totalPages && (
            <li>
              <a
                href="#"
                className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          )}
        </ol>
      )}

      {/* Modal for delete confirmation */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        itemName={selectedItem ? selectedItem.name : ""}
      />
    </div>
  );
}

export default DomainRegistrarsList;
