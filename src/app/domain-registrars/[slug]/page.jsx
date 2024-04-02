"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import AddEmailForm from "@/components/AddEmailForm";
import AddHostingForm from "@/components/AddHostingForm";
import AddDomainRegisterForm from "@/components/AddDomainRegisterForm";

function SingleProject({ params: { slug } }) {
  const [registrar, setRegistrar] = useState();
  const [editableForm, setEditableForm] = useState(false);
  const { data: session, status } = useSession();
  const userRole = session ? session.user.role : "";
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`/api/registrars?id=${slug}`);
        console.log(response.data);
        setRegistrar(response.data.registrar);
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
      {registrar ? (
        <>
          <AddDomainRegisterForm projectData={registrar} editable={editableForm} />
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
                className="mt-4 inline-block w-full rounded-lg bg-red-600 px-5 py-3 font-medium text-white sm:w-auto"
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
