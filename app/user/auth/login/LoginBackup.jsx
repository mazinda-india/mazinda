"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import OvalLoader from "@/components/Loading-Spinners/OvalLoader";
import MazindaLogoFull from "@/public/logo_mazinda.png";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import ThreeDotsLoader from "@/components/Loading-Spinners/ThreeDotsLoader";
import { useSearchParams } from 'next/navigation'

const LoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  

  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleContinueWithGoogle = async () => {
    try {
      const response = await axios.post("/api/auth/continue-with-google", {
        name: session.user.name,
        email: session.user.email,
      });

      const { success, token: userToken, message } = response.data;

      if (success) {
        Cookies.set("user_token", userToken, { expires: 1000 });
        router.push("/");
      } else {
        toast.warn(message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("An error occurred during Continue with Google:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const token = Cookies.get("user_token");
      if (token) {
        router.push("/");
      } else if (session && !token) {
        await handleContinueWithGoogle();
      }
      setLoading(false);
    };

    loadData();
  }, [session]);

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

    try {
      const response = await axios.post("/api/auth/login", {
        credentials,
      });

      if (response.data.success) {
        const { user_token } = response.data;
        const  userToken  = user_token;
        Cookies.set("user_token", user_token, { expires: 1000 });
        if(redirect=="buynow"){
          const product =  JSON.parse(localStorage.getItem('buynow-product'));
           
          localStorage.setItem('buynow-product',"");
          try {
            await axios.post("/api/user/cart/buy-item", {
              itemInfo: product,
              userToken
            });
            router.push("/user/my-cart/checkout");
          } catch (err) {
            console.log(err);
          }
        }else if(redirect=="cart"){
          const product =  JSON.parse(localStorage.getItem('cart-product'));
          localStorage.setItem('cart-product',"");

          try {
            const { data } = await axios.post(
              `/api/user/cart/add-update-item?filter=add`,
              {
                itemInfo: {
                  _id: product._id,
                  productName: product.productName,
                  imagePaths: product.imagePaths,
                  storeID: product.storeId,
                  costPrice: product.pricing.costPrice,
                  salesPrice: product.pricing.salesPrice,
                  mrp: product.pricing.mrp,
                },
                userToken,
              }
            );
            if (data.success) {
              router.push("/user/my-cart");
            }
          } catch (err) {
            console.log("An error occurred", err);
          }

           
        }else{
          router.push("/");
        }
      } else {
        toast.warn(response.data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }

    setSubmitting(false);
  };

  return (
    <div className="lg:flex">
      {loading && (
        <div className="absolute w-full h-full z-50 bg-gray-700 bg-opacity-50 flex items-center justify-center">
          <ThreeDotsLoader />
        </div>
      )}
      <div
        className={`scale-90 flex flex-col items-center pt-2 min-h-screen  lg:w-full ${
          loading ? "pointer-events-none" : null
        }`}
      >
        <Link href="/">
          <Image src={MazindaLogoFull} alt="Mazinda Logo" width={150} />
        </Link>

        <div className="max-w-md w-full px-10 lg:py-6 bg-white rounded-md mt-5 lg:border my-3">
          <h1 className="mb-1 text-center font-extrabold text-4xl">Log In</h1>
          <div className="flex items-center justify-center">
            {/* <p className="inline text-center text-gray-600">
              or{" "}
              <Link
                href="/user/auth/register"
                className="text-gray-600 underline"
              >
                create account
              </Link>
            </p> */}
          </div>
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="mb-4">
              <label
                htmlFor="identifier"
                className="block text-gray-700 font-bold mb-1"
              >
                Phone/Email
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
                className="block text-gray-700 font-bold mb-1"
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

            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-full hover:opacity-70"
              >
                {submitting ? <OvalLoader /> : "Log In"}
              </button>
              <div className="text-center mt-1">
                <a href="#" className="underline font-semibold text-sm">
                  Forgot Password?
                </a>
              </div>
            </div>
          </form>

          <div className="text-center">
            <span className="font-extrabold text-gray-800">or</span>

            <div>
              <button
                className={`mt-2 w-full justify-center px-4 py-2 border flex gap-2 border-slate-200 rounded-full text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 ${
                  googleLoading ? "filter grayscale" : null
                }`}
                onClick={() => {
                  setGoogleLoading(true);
                  signIn("google");
                }}
              >
                <img
                  className="w-6 h-6"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  loading="lazy"
                  alt="google logo"
                />
                <span>
                  {googleLoading
                    ? "Redirecting Securely ..."
                    : "Continue with Google"}
                </span>
              </button>

              <Link
                href="/user/auth/register"
                className="mt-2 w-full bg-[#fe6321] text-white justify-center px-4 py-2 flex gap-2 border-slate-200 rounded-full hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
              >
                <svg
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="text-white">Create an account</span>
              </Link>
            </div>
          </div>
        </div>
        <footer className="text-center text-gray-500">
          &copy; 2023 All Rights Reserved
          <br />
          Mazinda Commerce Private Limited
          <div>
            <Link
              className="font-bold text-black underline"
              href="/privacy-policy"
            >
              privacy
            </Link>{" "}
            and{" "}
            <Link
              className="font-bold text-black underline"
              href="/terms-and-conditions"
            >
              terms
            </Link>
          </div>
        </footer>
      </div>

      {/* <div className="w-full hidden lg:block">
        <Image src={AuthScreenPNG} className="h-screen w-full" alt="mazinda" />
      </div> */}
    </div>
  );
};

export default LoginPage;
