"use client";

import Cookies from "js-cookie";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OvalLoader from "@/components/Loading-Spinners/OvalLoader";
import { signOut } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import OrdersTabs from "@/components/utility/OrderTabs";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MyAccount = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState({});

  const fetchData = async (userToken) => {
    try {
      const { data } = await axios.post("/api/user/fetch-user", { userToken });
      if (data.success) {
        setUser(data.user);
        setUserLoading(false);
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (err) {
      console.log("An error occurred ", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      Cookies.remove("user_token");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const userToken = Cookies.get("user_token");
    if (!userToken) {
      router.push("/user/auth/login");
      return;
    }
    fetchData(userToken);
  }, []);

  return (
    <>
      <div className="md:w-1/2 lg:w-1/3 md:mx-auto">
        <h1 className="text-center text-2xl md:mb-7">My Account</h1>

        <Accordion type="single" className="mx-7" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline">
              {userLoading ? (
                <div className="w-full flex items-center justify-center">
                  <OvalLoader />
                </div>
              ) : (
                <div className="flex w-full flex-col">
                  <span className="font-semibold text-lg text-left">
                    {user.name}
                  </span>
                  {user.phoneNumber && (
                    <span className="text-gray-500 text-sm flex">
                      <svg
                        className="mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        height="18"
                        viewBox="0 -960 960 960"
                        width="18"
                      >
                        <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
                      </svg>
                      {user.phoneNumber}
                    </span>
                  )}
                  <span className="text-gray-500 text-sm flex">
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      height="18"
                      viewBox="0 -960 960 960"
                      width="18"
                    >
                      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                    </svg>
                    {user.email}
                  </span>
                </div>
              )}
            </AccordionTrigger>
            <AccordionContent className="flex justify-center">
              <Link
                href="/"
                className="text-gray-600 ml-5 flex items-center border w-fit px-2 py-1 rounded-md my-3"
                onClick={() => {
                  handleLogout();
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-white mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
                </svg>
                Logout
              </Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col">
                <span className="text-lg text-left">Get Help</span>
                <span className="text-gray-500 text-sm">
                  Queries, Feedback and Bug Reports
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <span>
                Feel free to contact us{" "}
                <Link href="/support" className="text-blue-500 underline">
                  here
                </Link>
              </span>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col">
                <span className="text-lg text-left">Current Orders</span>
                <span className="text-gray-500 text-sm">
                  View Your Current Orders
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <OrdersTabs filter="active" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col">
                <span className="text-lg text-left">Order History</span>
                <span className="text-gray-500 text-sm">
                  Browse Your Order History
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {/* <OrdersList filter="delivered" /> */}
              <OrdersTabs filter="delivered" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default MyAccount;
