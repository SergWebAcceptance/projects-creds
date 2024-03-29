"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import AddEmailForm from "@/components/AddEmailForm";

function SingleProject({ params: { slug } }) {
  const [email, setEmail] = useState();
  const [editableForm, setEditableForm] = useState(false);
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`/api/emails?id=${slug}`);
        console.log(response.data);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Could not fetch projects", error);
        // Тут можна додати обробку помилок
      }
    };

    fetchEmail();
  }, []);

  const handleEditable = () => {
    setEditableForm(!editableForm);
  };

  return (
    <>
      {email ? (
        <>
          <AddEmailForm projectData={email} editable={editableForm} />
          {!editableForm ? (
            <button
              onClick={() => handleEditable()}
              className="mt-4 inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
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
