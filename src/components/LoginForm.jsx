"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting");
    if (password === "" || email === "") {
      toast.error("Fill all fields!");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error == null) {
        router.push("/");
      } else {
        toast.error("Error occured while logging");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="my-20 max-w-lg mx-auto flex flex-col align-center justify-center rounded-md">
      <div className="flex flex-col w-full px-4 py-8 bg-slate-100 shadow-md rounded-md shadow sm:px-6 md:px-8 lg:px-10">
        <h1 className="w-full text-4xl text-center text-gray-800 sm:text-5xl">
          Login
        </h1>
        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base "
                placeholder="Your email"
              />
            </div>
            <div className="mb-6">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base"
                placeholder="Your password"
              />
            </div>
            <div className="flex w-full">
              <button
                type="submit"
                className="py-3 px-5 w-full bg-black text-white font-medium rounded-lg sm:w-full"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" />{" "}
    </section>
  );
};

export default LoginForm;
