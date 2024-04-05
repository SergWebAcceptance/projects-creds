"use client";

import { Formik, Form, Field, Text } from "formik";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Copy, CopyCheck } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ftpProtocolOptions = [
  { value: "ftp", label: "ftp" },
  { value: "sftp", label: "sftp" },
];

const selectStyles = {
  valueContainer: (base) => ({
    ...base,
    height: 43,
  }),
};

function AddFtpAccountForm({ projectData, editable = true }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [copied, setCopied] = useState(null);
  const [hostings, setHostings] = useState([]);

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

    const fetchHostings = async () => {
      const response = await axios.get("/api/hostings");
      const adaptedHostings = response.data.hostings.map((hosting) => ({
        value: hosting._id,
        label: `${hosting.name} - ${hosting.login}`,
      }));
      setHostings(adaptedHostings);
    };

    fetchHostings();
    fetchCategories();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!projectData) {
        await axios.post("/api/ftp", {
          protocol: values.protocol,
          host: values.host,
          login: values.login,
          password: values.password,
          port: values.port,
          hostingAccount: values.hostingAccount,
          hostingAccountName: hostings.find(
            (hosting) => hosting.value === values.hostingAccount
          ).label,
          projectCategory: values.projectCategory,
        });
      } else {
        await axios.patch("/api/ftp", {
          ftpAccountId: projectData._id,
          protocol: values.protocol,
          host: values.host,
          login: values.login,
          password: values.password,
          port: values.port,
          hostingAccount: values.hostingAccount,
          projectCategory: values.projectCategory,
          hostingAccountName: hostings.find(
            (hosting) => hosting.value === values.hostingAccount
          ).label,
        });
      }

      setSubmitting(false);
      resetForm();
      if (!projectData) {
        router.push("/ftp-accounts");
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
        protocol: projectData ? projectData.protocol : "",
        host: projectData ? projectData.host : "",
        login: projectData ? projectData.login : "",
        password: projectData ? projectData.password : "",
        port: projectData ? projectData.port : "",
        hostingAccount: projectData ? projectData.hostingAccount._id : "",
        projectCategory: projectData ? projectData.projectCategory._id : "",
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className={`mt-6 mb-6 space-y-4 ${!editable && "disabled"}`}>
          <div className="domain-info flex flex-col sm:flex-row gap-4">
            <div className="w-full space-y-2 relative">
              <h2>Host</h2>
              <div className="relative">
                <Field
                  type="text"
                  name="host"
                  placeholder="host"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  disabled={!editable}
                />
                {!editable && <CopyButton copyValue={values.host} />}
              </div>
            </div>
            <div className="w-full space-y-2 relative">
              <h2>Protocol</h2>
              <div className="relative">
                <Select
                  value={findOptionById(ftpProtocolOptions, values.protocol)}
                  styles={selectStyles}
                  options={ftpProtocolOptions}
                  onChange={(option) => setFieldValue("protocol", option.value)}
                  className="w-full"
                />
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
            <div className="w-full space-y-2 relative">
              <h2>Port</h2>
              <div className="relative">
                <Field
                  type="text"
                  name="port"
                  placeholder="port"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  disabled={!editable}
                />
                {!editable && <CopyButton copyValue={values.port} />}
              </div>
            </div>
          </div>

          <div className={`space-y-2`}>
            {editable ? (
              <>
                <h2>Hosting account</h2>
                <Select
                  styles={selectStyles}
                  value={findOptionById(hostings, values.hostingAccount)}
                  options={hostings}
                  onChange={(option) =>
                    setFieldValue("hostingAccount", option.value)
                  }
                />
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full">
                  <h2>Hosting Account</h2>
                  <div className="relative">
                    <Field
                      value={
                        projectData
                          ? projectData.hostingAccount
                            ? `${projectData.hostingAccount.name} `
                            : ""
                          : ""
                      }
                      disabled={!editable}
                      type="text"
                      name="hostingAccountNamePlaceholder"
                      placeholder="hostingAccount"
                      className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                    />
                    {!editable && (
                      <CopyButton
                        copyValue={
                          projectData
                            ? projectData.hostingAccount
                              ? `${projectData.hostingAccount.name} `
                              : ""
                            : ""
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="relative w-full">
                  <h2>Hosting Account Login</h2>
                  <div className="relative">
                    <Field
                      value={
                        projectData
                          ? projectData.hostingAccount
                            ? `${projectData.hostingAccount.login} `
                            : ""
                          : ""
                      }
                      disabled={!editable}
                      type="text"
                      name="hostingAccountLoginPlaceholder"
                      placeholder="hostingAccount"
                      className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                    />
                    {!editable && (
                      <CopyButton
                        copyValue={
                          projectData
                            ? projectData.hostingAccount
                              ? `${projectData.hostingAccount.login} `
                              : ""
                            : ""
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="relative w-full">
                  <h2>Hosting Account Password</h2>
                  <div className="relative">
                    <Field
                      value={
                        projectData
                          ? projectData.hostingAccount
                            ? `${projectData.hostingAccount.password} `
                            : ""
                          : ""
                      }
                      disabled={!editable}
                      type="text"
                      name="hostingAccountPasswordPlaceholder"
                      placeholder="hostingAccount"
                      className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                    />
                    {!editable && (
                      <CopyButton
                        copyValue={
                          projectData
                            ? projectData.hostingAccount
                              ? `${projectData.hostingAccount.password} `
                              : ""
                            : ""
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
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

export default AddFtpAccountForm;
