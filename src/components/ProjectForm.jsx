"use client";

import { Formik, Form, Field } from "formik";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Copy, CopyCheck } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

function ProjectForm({ projectData, editable = true }) {
  const [categories, setCategories] = useState([]);
  const [registrars, setRegistrars] = useState([]);
  const [hostings, setHostings] = useState([]);
  const [isNewRegistrar, setIsNewRegistrar] = useState(false);
  const [isNewHosting, setIsNewHosting] = useState(false);
  const router = useRouter();
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

    const fetchRegistrars = async () => {
      const response = await axios.get("/api/registrars");
      const adaptedRegistrars = response.data.map((registrar) => ({
        value: registrar._id,
        label: `${registrar.name} - ${registrar.login}`,
      }));
      setRegistrars(adaptedRegistrars);
    };

    const fetchHostings = async () => {
      const response = await axios.get("/api/hostings");
      const adaptedHostings = response.data.map((hosting) => ({
        value: hosting._id,
        label: `${hosting.name} - ${hosting.login}`,
      }));
      setHostings(adaptedHostings);
    };

    fetchRegistrars();
    fetchHostings();
    fetchCategories();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let registrarId = values.domainRegistrar;
      let hostingId = values.hosting;

      // Якщо додається новий domainRegistrar
      if (isNewRegistrar && values.newDomainRegistrar) {
        const registrarResponse = await axios.post("/api/registrars", {
          name: values.newDomainRegistrar,
          login: values.registrarLogin,
          password: values.registrarPassword,
        });
        registrarId = registrarResponse.data._id;
      }

      // Якщо додається новий hosting
      if (isNewHosting && values.newHosting) {
        const hostingResponse = await axios.post("/api/hostings", {
          name: values.newHosting,
          login: values.hostingLogin,
          password: values.hostingPassword,
        });
        hostingId = hostingResponse.data._id;
      }

      if (!projectData) {
        await axios.post("/api/projects", {
          domain: values.domain,
          domainRegistrar: registrarId,
          hosting: hostingId,
          dns: {
            name: values.dnsName,
            login: values.dnsLogin,
            password: values.dnsPassword,
          },
          ftpSsh: {
            protocol: values.ftpSshProtocol,
            host: values.ftpSshHost,
            login: values.ftpSshLogin,
            password: values.ftpSshPassword,
            port: values.ftpSshPort,
          },
          github: {
            login: values.githubLogin,
            password: values.githubPassword,
          },
          wpAdmin: {
            login: values.wpAdminLogin,
            password: values.wpAdminPassword,
          },
          testAccess: {
            login: values.testAccessLogin,
            password: values.testAccessPassword,
          },
          registerDate: values.registerDate,
          expiredDate: values.expiredDate,
          projectsCategory: values.projectsCategory,
        });
      } else {
        await axios.patch("/api/projects", {
          projectId: projectData._id,
          domain: values.domain,
          domainRegistrar: registrarId,
          hosting: hostingId,
          dns: {
            name: values.dnsName,
            login: values.dnsLogin,
            password: values.dnsPassword,
          },
          ftpSsh: {
            protocol: values.ftpSshProtocol,
            host: values.ftpSshHost,
            login: values.ftpSshLogin,
            password: values.ftpSshPassword,
            port: values.ftpSshPort,
          },
          github: {
            login: values.githubLogin,
            password: values.githubPassword,
          },
          wpAdmin: {
            login: values.wpAdminLogin,
            password: values.wpAdminPassword,
          },
          testAccess: {
            login: values.testAccessLogin,
            password: values.testAccessPassword,
          },
          registerDate: values.registerDate,
          expiredDate: values.expiredDate,
          projectsCategory: values.projectsCategory,
        });
      }

      setSubmitting(false);
      resetForm();
      router.push("/");
    } catch (error) {
      console.error("Failed to submit the form", error);
      setSubmitting(false);
    }
  };

  const CopyButton = ({ copyValue }) => (
    <CopyToClipboard text={copyValue} onCopy={() => setCopied(copyValue)}>
      {copied === copyValue ? (
        <CopyCheck className="cursor-pointer opacity-40 absolute top-2.5 right-3 w-5" />
      ) : (
        <Copy className="cursor-pointer opacity-40 absolute top-2.5 right-3 w-5" />
      )}
    </CopyToClipboard>
  );

  const findOptionById = (options, id) =>
    options.find((option) => option.value === id);

  return (
    <Formik
      initialValues={{
        domain: projectData ? projectData.domain : "",
        domainRegistrar: projectData ? projectData.domainRegistrar._id : "",
        newDomainRegistrar: "",
        registrarLogin: "", // Для логіна нового domainRegistrar
        registrarPassword: "", // Для пароля нового domainRegistrar
        hosting: projectData ? projectData.hosting._id : "",
        newHosting: "",
        hostingLogin: "",
        hostingPassword: "",
        wpAdminLogin:
          projectData && projectData.wpAdmin ? projectData.wpAdmin.login : "",
        wpAdminPassword:
          projectData && projectData.wpAdmin
            ? projectData.wpAdmin.password
            : "",
        testAccessLogin:
          projectData && projectData.testAccess
            ? projectData.testAccess.login
            : "",
        testAccessPassword:
          projectData && projectData.testAccess
            ? projectData.testAccess.password
            : "",
        dnsLogin: projectData && projectData.dns ? projectData.dns.login : "",
        dnsPassword:
          projectData && projectData.dns ? projectData.dns.password : "",
        dnsName: projectData && projectData.dns ? projectData.dns.name : "",
        githubLogin:
          projectData && projectData.github ? projectData.github.login : "",
        githubPassword:
          projectData && projectData.github ? projectData.github.password : "",
        registerDate:
          projectData && projectData.registerDate
            ? projectData.registerDate
            : "",
        expiredDate:
          projectData && projectData.expiredDate ? projectData.expiredDate : "",
        projectsCategory: projectData ? projectData.projectsCategory._id : "",
        ftpSshProtocol:
          projectData && projectData.ftpSsh ? projectData.ftpSsh.protocol : "",
        ftpSshHost:
          projectData && projectData.ftpSsh ? projectData.ftpSsh.host : "",
        ftpSshLogin:
          projectData && projectData.ftpSsh ? projectData.ftpSsh.login : "",
        ftpSshPassword:
          projectData && projectData.ftpSsh ? projectData.ftpSsh.password : "",
        ftpSshPort:
          projectData && projectData.ftpSsh ? projectData.ftpSsh.port : "",
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className={`mt-6 mb-6 ${!editable && "disabled"}`}>
          <div className="domain-info flex gap-4">
            <div className="w-full space-y-2">
              <h2>Project domain</h2>
              <div className="relative">
                <Field
                  type="text"
                  name="domain"
                  placeholder="Domain"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  disabled={!editable}
                />
                {!editable && <CopyButton copyValue={values.domain} />}
              </div>
            </div>
            <div className="w-full space-y-2">
              <h2>Register Date</h2>
              <div className="relative">
                <Field
                  type="date"
                  name="registerDate"
                  placeholder="Register Date"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  disabled={!editable}
                />
                {!editable && <CopyButton copyValue={values.registerDate} />}
              </div>
            </div>
            <div className="w-full space-y-2">
              <h2>Expired Date</h2>
              <div className="relative">
                <Field
                  type="date"
                  name="expiredDate"
                  placeholder="Expired Date"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  disabled={!editable}
                />
                {!editable && <CopyButton copyValue={values.expiredDate} />}
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-6 pt-4 border-t-2 border-gray-200">
            <h2>Domain register Account</h2>
            {isNewRegistrar ? (
              <>
                <div className="flex gap-4">
                  <Field
                    name="newDomainRegistrar"
                    placeholder="New Domain Registrar Name"
                    as="input"
                    className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  />
                  <Field
                    name="registrarLogin"
                    placeholder="Registrar Login"
                    as="input"
                    className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  />
                  <Field
                    name="registrarPassword"
                    placeholder="Registrar Password"
                    as="input"
                    className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  />
                </div>
              </>
            ) : (
              <>
                {editable ? (
                  <Select
                    value={findOptionById(registrars, values.domainRegistrar)}
                    options={registrars}
                    onChange={(option) =>
                      setFieldValue("domainRegistrar", option.value)
                    }
                  />
                ) : (
                  <div className="flex gap-4">
                    <div className="relative w-full">
                      <Field
                        value={
                          projectData
                            ? `${projectData.domainRegistrar.name} `
                            : ""
                        }
                        disabled={!editable}
                        type="text"
                        name="domainRegistrarNamePlaceholder"
                        placeholder="hosting"
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      />
                      {!editable && (
                        <CopyButton
                          copyValue={
                            projectData
                              ? `${projectData.domainRegistrar.name} `
                              : ""
                          }
                        />
                      )}
                    </div>
                    <div className="relative w-full">
                      <Field
                        value={
                          projectData
                            ? `${projectData.domainRegistrar.login}`
                            : ""
                        }
                        disabled={!editable}
                        type="text"
                        name="domainRegistrarLoginPlaceholder"
                        placeholder="hosting"
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      />
                      {!editable && (
                        <CopyButton
                          copyValue={
                            projectData
                              ? `${projectData.domainRegistrar.login}`
                              : ""
                          }
                        />
                      )}
                    </div>
                    <div className="relative w-full">
                      <Field
                        value={
                          projectData
                            ? `${projectData.domainRegistrar.password}`
                            : ""
                        }
                        disabled={!editable}
                        type="text"
                        name="domainRegistrarPasswordPlaceholder"
                        placeholder="hosting"
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      />
                      {!editable && (
                        <CopyButton
                          copyValue={
                            projectData
                              ? `${projectData.domainRegistrar.password}`
                              : ""
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {editable && (
              <div className="flex gap-3 items-center mt-1">
                <label
                  htmlFor="RegistrarAcceptConditions"
                  className="relative h-4 w-8 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500"
                >
                  <input
                    type="checkbox"
                    id="RegistrarAcceptConditions"
                    className="peer sr-only"
                    checked={isNewRegistrar}
                    onChange={() => setIsNewRegistrar(!isNewRegistrar)}
                  />
                  <span className="absolute inset-y-0 start-0 m-1 size-2 rounded-full bg-white transition-all peer-checked:start-4"></span>
                </label>
                Add New Domain Registrar
              </div>
            )}
          </div>

          <div className="space-y-2 mt-6 pt-4 border-t-2 border-gray-200">
            <h2>Hosting Account</h2>
            {isNewHosting ? (
              <>
                <div className="flex gap-4">
                  <Field
                    name="newHosting"
                    placeholder="New Hosting Name"
                    as="input"
                    className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  />
                  <Field
                    name="hostingLogin"
                    placeholder="Hosting Login"
                    as="input"
                    className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  />
                  <Field
                    name="hostingPassword"
                    placeholder="Hosting Password"
                    as="input"
                    className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                  />
                </div>
              </>
            ) : (
              <>
                {editable ? (
                  <Select
                    value={findOptionById(hostings, values.hosting)}
                    options={hostings}
                    onChange={(option) =>
                      setFieldValue("hosting", option.value)
                    }
                  />
                ) : (
                  <div className="flex gap-4">
                    <div className="relative w-full">
                      <Field
                        value={
                          projectData ? `${projectData.hosting.name} ` : ""
                        }
                        disabled={!editable}
                        type="text"
                        name="hostingNamePlaceholder"
                        placeholder="hosting"
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      />
                      {!editable && (
                        <CopyButton copyValue={
                          projectData ? `${projectData.hosting.name} ` : ""
                        } />
                      )}
                    </div>
                    <div className="relative w-full">
                      <Field
                        value={
                          projectData ? `${projectData.hosting.login}` : ""
                        }
                        disabled={!editable}
                        type="text"
                        name="hostingLoginPlaceholder"
                        placeholder="hosting"
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      />
                      {!editable && (
                        <CopyButton
                          copyValue={
                            projectData ? `${projectData.hosting.login}` : ""
                          }
                        />
                      )}
                    </div>
                    <div className="relative w-full">
                      <Field
                        value={
                          projectData ? `${projectData.hosting.password}` : ""
                        }
                        disabled={!editable}
                        type="text"
                        name="hostingPasswordPlaceholder"
                        placeholder="hosting"
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      />
                      {!editable && (
                        <CopyButton
                          copyValue={
                            projectData ? `${projectData.hosting.password}` : ""
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {editable && (
              <div className="flex gap-3 items-center mt-1">
                <label
                  htmlFor="HostingAcceptConditions"
                  className="relative h-4 w-8 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500"
                >
                  <input
                    type="checkbox"
                    id="HostingAcceptConditions"
                    className="peer sr-only"
                    checked={isNewHosting}
                    onChange={() => setIsNewHosting(!isNewHosting)}
                  />
                  <span className="absolute inset-y-0 start-0 m-1 size-2 rounded-full bg-white transition-all peer-checked:start-4"></span>
                </label>
                Add New Hosting
              </div>
            )}
          </div>

          <div
            className={`space-y-2 mt-6 pt-4 border-t-2 border-gray-200 ${
              projectData && !editable
                ? projectData.wpAdmin.login
                  ? ""
                  : "hidden"
                : ""
            }`}
          >
            <h2>Wordpress Account</h2>
            <div className="flex gap-4">
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="wpAdminLogin"
                  placeholder="wpAdminLogin"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.wpAdminLogin} />}
              </div>
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="wpAdminPassword"
                  placeholder="wpAdminPassword"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.wpAdminPassword} />}
              </div>
            </div>
          </div>

          <div
            className={`space-y-2 mt-6 pt-4 border-t-2 border-gray-200 ${
              projectData && !editable
                ? projectData.testAccess
                  ? ""
                  : "hidden"
                : ""
            }`}
          >
            <h2>Test Wordpress Account</h2>
            <div className="flex gap-4">
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="testAccessLogin"
                  placeholder="wtestAccessLogin"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.testAccessLogin} />}
              </div>
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="testAccessPassword"
                  placeholder="testAccessPassword"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && (
                  <CopyButton copyValue={values.testAccessPassword} />
                )}
              </div>
            </div>
          </div>

          <div
            className={`space-y-2 mt-6 pt-4 border-t-2 border-gray-200 ${
              projectData && !editable ? (projectData.dns ? "" : "hidden") : ""
            }`}
          >
            <h2>DNS Account</h2>
            <div className="flex gap-4">
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="dnsName"
                  placeholder="dnsName"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.dnsName} />}
              </div>
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="dnsLogin"
                  placeholder="dnsLogin"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.dnsLogin} />}
              </div>
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="dnsPassword"
                  placeholder="dnsPassword"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.dnsPassword} />}
              </div>
            </div>
          </div>

          <div
            className={`space-y-2 mt-6 pt-4 border-t-2 border-gray-200 ${
              projectData && !editable
                ? projectData.ftpSsh
                  ? ""
                  : "hidden"
                : ""
            }`}
          >
            <h2>FTP/SSH Account</h2>
            <div className="flex gap-4">
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="ftpSshProtocol"
                  placeholder="ftpSshProtocol"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.ftpSshProtocol} />}
              </div>
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="ftpSshHost"
                  placeholder="ftpSshHost"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.ftpSshHost} />}
              </div>
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="ftpSshLogin"
                  placeholder="ftpSshLogin"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.ftpSshLogin} />}
              </div>
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="ftpSshPassword"
                  placeholder="ftpSshPassword"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.ftpSshPassword} />}
              </div>
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="ftpSshPort"
                  placeholder="ftpSshPort"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.ftpSshPort} />}
              </div>
            </div>
          </div>

          <div
            className={`space-y-2 mt-6 pt-4 border-t-2 border-gray-200 ${
              projectData ? (projectData.github.login ? "" : "hidden") : ""
            }`}
          >
            <h2>GitHub Account</h2>
            <div className="flex gap-4">
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="githubLogin"
                  placeholder="githubLogin"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.githubLogin} />}
              </div>
              <div className="relative w-full">
                <Field
                  disabled={!editable}
                  type="text"
                  name="githubPassword"
                  placeholder="githubPassword"
                  className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                />
                {!editable && <CopyButton copyValue={values.githubPassword} />}
              </div>
            </div>
          </div>

          <div
            className={`space-y-2 mt-6 pt-4 border-t-2 border-gray-200 ${
              projectData ? (projectData.github.login ? "" : "hidden") : ""
            }`}
          >
            <h2>Project category</h2>
            <>
              {editable ? (
                <Select
                  value={findOptionById(categories, values.projectsCategory)}
                  options={categories}
                  onChange={(option) =>
                    setFieldValue("projectsCategory", option.value)
                  }
                />
              ) : (
                <Field
                  value={
                    projectData ? `${projectData.projectsCategory.name}` : ""
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
              className="inline-block w-full rounded-lg bg-black mt-8 px-5 py-3 font-medium text-white sm:w-auto"
            >
              Submit
            </button>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default ProjectForm;
