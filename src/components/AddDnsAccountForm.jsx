"use client";

import { Formik, Form, Field, Text } from "formik";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Copy, CopyCheck } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

function AddDnsAccountForm({ projectData, editable = true }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    console.log(projectData);

    const fetchCategories = async () => {
      const response = await axios.get("/api/categories");
      console.log(response.data);
      const adaptedCategories = response.data.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setCategories(adaptedCategories);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!projectData) {
        await axios.post("/api/dns", {
          name: values.name,
          login: values.login,
          password: values.password,
          projectCategory: values.projectCategory,
        });
      } else {
        await axios.patch("/api/dns", {
          dnsAccountId: projectData._id,
          name: values.name,
          login: values.login,
          password: values.password,
          projectCategory: values.projectCategory,
        });
      }

      setSubmitting(false);
      resetForm();
      if (!projectData) {
        router.push("/dns-accounts");
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to submit the form", error);
      setSubmitting(false);
    }
  };

  const CopyButton = ({ copyValue }) => (
    <CopyToClipboard text={copyValue} onCopy={() => setCopied(copyValue)}>
      {copied === copyValue ? (
        <CopyCheck className="cursor-pointer opacity-40 absolute top-2.5 right-4 w-5" />
      ) : (
        <Copy className="cursor-pointer opacity-40 absolute top-2.5 right-4 w-5" />
      )}
    </CopyToClipboard>
  );

  const findOptionById = (options, id) =>
    options.find((option) => option.value === id);

  return (
    <Formik
      initialValues={{
        name: projectData ? projectData.name : "",
        login: projectData ? projectData.login : "",
        password: projectData ? projectData.password : "",
        projectCategory: projectData ? projectData.projectCategory._id : "",
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className={`mt-6 mb-6 space-y-4 ${!editable && "disabled"}`}>
          <div className="domain-info flex flex-col sm:flex-row gap-4">
            <div className="w-full space-y-2 relative">
              <h2>Account</h2>
              <div className="relative">
                <Field
                  type="text"
                  name="name"
                  placeholder="name"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  disabled={!editable}
                />
                {!editable && <CopyButton copyValue={values.name} />}
              </div>
            </div>
            <div className="w-full space-y-2 relative">
              <h2>Login</h2>
              <div className="relative">
                <Field
                  type="text"
                  name="login"
                  placeholder="login"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  disabled={!editable}
                />
                {!editable && <CopyButton copyValue={values.login} />}
              </div>
            </div>
            <div className="w-full space-y-2 relative">
              <h2>Password</h2>
              <div className="relative">
                <Field
                  type="text"
                  name="password"
                  placeholder="password"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  disabled={!editable}
                />
                {!editable && <CopyButton copyValue={values.password} />}
              </div>
            </div>
          </div>

          <div className={`space-y-2`}>
            <h2>Project category</h2>
            <>
              {editable ? (
                <Select
                  value={findOptionById(categories, values.projectCategory)}
                  options={categories}
                  onChange={(option) =>
                    setFieldValue("projectCategory", option.value)
                  }
                />
              ) : (
                <Field
                  value={
                    projectData ? `${projectData.projectCategory.name}` : ""
                  }
                  disabled={!editable}
                  type="text"
                  name="hostingPlaceholder"
                  placeholder="hosting"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
              )}
            </>
          </div>

          {editable && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
            >
              Submit
            </button>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default AddDnsAccountForm;
