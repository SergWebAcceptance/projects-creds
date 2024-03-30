"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submitting');
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
    <section className="bg-gray-100 max-w-screen-sm m-auto p-8 flex flex-col align-center justify-center rounded-md">
      <h1 className="mb-4 w-full text-4xl font-light text-center text-gray-800 uppercase sm:text-5xl">
        Login
      </h1>
      <div className="flex flex-col w-full px-4 py-8 bg-white rounded-md shadow sm:px-6 md:px-8 lg:px-10">
        <div className="self-center text-xl font-light text-gray-600 sm:text-2xl">
          Welcome Back!
        </div>
        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="flex">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <div className="flex">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="sign-in-email"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your password"
                />
              </div>
            </div>
            <div className="flex w-full">
            <button
              type="submit"
              className="inline-block w-fullrounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
            >
              Submit
            </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
