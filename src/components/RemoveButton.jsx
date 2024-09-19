"use client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";

const RemoveButton = ({ id }) => {
  const [projects, setProjects] = useState([]);
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
    <button
      className="flex gap-2 items-center rounded-md bg-red-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      onClick={() => handleRemove(id)}
    >
      <Trash2 />
    </button>
  );
};

export default RemoveButton;
