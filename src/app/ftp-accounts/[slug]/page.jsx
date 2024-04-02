"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import AddFtpAccountForm from "@/components/AddFtpAccountForm";

function SingleProject({ params: { slug } }) {
  const [ftpAccount, setFtpAccount] = useState();
  const [editableForm, setEditableForm] = useState(false);
  const { data: session, status } = useSession();
  const userRole = session ? session.user.role : "";
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`/api/ftp?id=${slug}`);
        console.log(response.data);
        setFtpAccount(response.data.ftpAccount);
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
      {ftpAccount ? (
        <>
          <AddFtpAccountForm projectData={ftpAccount} editable={editableForm} />
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
