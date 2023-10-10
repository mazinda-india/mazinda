"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import OvalLoader from "@/components/admin/utility/OvalLoader";
import MazindaLogoFull from '@/public/logo_mazinda.png';
import Image from 'next/image';

const LoginPage = () => {
  const router = useRouter();

  const store_token = Cookies.get("store_token");
  if (store_token) {
    router.push('/store')
  }

  const [submitting, setSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // You can access the identifier and password values from the `credentials` object
    console.log("Email/Phone:", credentials.identifier);
    console.log("Password:", credentials.password);
    // Perform login logic or API call here

    const response = await axios.post("/api/store/auth/login-store", {
      credentials,
    });

    console.log(response.data);
    if (response.data.success) {
      const { store_token } = response.data;
      Cookies.set("store_token", store_token, { expires: 1000 });
      router.push(`/store`);
    } else {
      toast.error(response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image className="my-4" src={MazindaLogoFull} alt="Mazinda Logo"/>
      <div className="max-w-md w-full p-6 bg-white rounded-lg">
        <h1 className="mb-1 text-center font-bold text-4xl">Store Login</h1>
        <div className="flex items-center justify-center">
          <p className="inline text-center text-gray-600">
            Or{" "}
            <Link
              href="/store/register"
              className="text-gray-600 hover:underline"
            >
              Register Store
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="my-12">
          <div className="mb-4">
            <label
              htmlFor="identifier"
              className="block text-gray-700 font-bold mb-2"
            >
              Email or Phone
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              className="w-full px-5 py-2 border rounded-full"
              placeholder="Enter your email or phone"
              value={credentials.identifier}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-5 py-2 border rounded-full"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 text-right">
            <a href="#" className="text-gray-700 hover:underline">
              Forgot Password?
            </a>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-2 px-4 rounded-full hover:opacity-70"
            >
              {submitting ? <OvalLoader /> : "Login"}
            </button>
          </div>
        </form>
      </div>
      <footer className="mt-8 text-center text-gray-500">
        &copy; 20xx-20xx All Rights Reserved | Privacy Policy | Terms of Service
      </footer>
    </div>
  );
};

export default LoginPage;
