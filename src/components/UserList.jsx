"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useProjects } from "@/contexts/ProjectsContext";
import { Eye, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function UserList() {
  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // State for the selected item

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/api/addUser`);
        setUsers(response.data.users);
        console.log(response.data);
      } catch (error) {
        console.error("Could not fetch projects", error);
      }
    };

    fetchUsers();
  }, []);

  const handleRemove = async (id) => {
    try {
      // Використання axios.delete з конфігурацією для включення тіла запиту
      await axios.delete(`/api/addUser`, { data: { id } });
      // Оновлення стану для відображення змін без перезавантаження
      setUsers(users.filter((user) => user._id !== id));
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

  return (
    <div className=" overflow-x-auto">
      {users.length > 0 ? (
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">
                Email
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">
                Role
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-left">
                  {user.role}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-right">
                  <button
                    className="rounded-md bg-red-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    onClick={() => openDeleteModal(user)}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>...</p>
      )}

      {/* Modal for delete confirmation */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        itemName={selectedItem ? selectedItem.email : ""}
      />
    </div>
  );
}

export default UserList;
