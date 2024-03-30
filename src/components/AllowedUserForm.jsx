"use client";

import { Formik, Form, Field, Text } from "formik";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Select from "react-select";

function AllowedUserForm() {
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post("/api/addUser", {
        email: values.email,
        password: values.password,
        role: values.role,
      });

      setSubmitting(false);
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error("Failed to submit the form", error);
      setSubmitting(false);
    }
  };

  const options = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
  ];

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        role: "",
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className={`mt-6 mb-6 space-y-4 `}>
          <div className="domain-info flex flex-col gap-4">
            <Field
              type="text"
              name="email"
              placeholder="email"
              className="w-full rounded-lg border-gray-200 p-3 text-sm border"
            />
            <Field
              type="text"
              name="password"
              placeholder="password"
              className="w-full rounded-lg border-gray-200 p-3 text-sm border"
            />
            <Select
              className="w-full"
              options={options}
              onChange={(option) => setFieldValue("role", option.value)}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-block w-fullrounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AllowedUserForm;
