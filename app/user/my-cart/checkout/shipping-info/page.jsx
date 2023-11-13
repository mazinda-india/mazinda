"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

const ShippingInfo = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState({});
  const [userToken, setUserToken] = useState("");
  const [savedAddresses, setSavedAddresses] = useState({});

  const [pincodes, setPincodes] = useState([]);
  const [pincodeError, setPincodeError] = useState(false);

  let selectedLocation = Cookies.get("selectedLocation");
  let selectedCity;
  try {
    selectedLocation = JSON.parse(Cookies.get("selectedLocation"));
    selectedCity = selectedLocation.city;
  } catch (e) {
    console.log(e);
  }

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    email: "",
    subaddress: "",
    city: selectedCity,
    state: "",
  });

  const [expandedNewAddress, setExpandedNewAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleOnChange = async (e) => {
    // if the input is pincode, then handle it differently
    if (e.target.name === "pincode" && e.target.value.length === 6) {
      if (!pincodes.includes(e.target.value)) {
        setPincodeError(true);
      } else {
        setPincodeError(false);
      }
    }

    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = async () => {
    // Validate if all required fields are filled
    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.email ||
      !newAddress.subaddress ||
      !newAddress.pincode ||
      !newAddress.state ||
      pincodeError
    ) {
      toast.warn("Please provide all the required information.");
      return;
    }

    const response = await axios.post(
      "/api/user/shipping-addresses/add-new-address",
      {
        newAddress,
        userToken,
      }
    );

    if (response.data.success) {
      const newSavedAddresses = response.data.newSavedAddresses;
      setSavedAddresses(newSavedAddresses);
      setNewAddress({
        name: "",
        phone: "",
        email: "",
        subaddress: "",
        city: "",
        pincode: "",
        state: "",
      });
      setExpandedNewAddress(false);
    }
  };

  const handleAddressClick = async (address) => {
    setSelectedAddress(selectedAddress === address ? null : address);

    await axios.post("/api/user/shipping-addresses/set-current-address", {
      userToken,
      currentAddress: selectedAddress === address ? null : address,
    });
  };

  const fetchData = async (userToken) => {
    const response = await axios.post("/api/user/fetch-user", { userToken });

    const user = response.data.user;
    const currentAddress = user.currentAddress;
    const savedAddresses = user.savedAddresses;

    const pincodeResponse = await axios.post("/api/location/fetch-pincodes", {
      id: selectedLocation._id,
    });

    setUser(user);
    setSelectedAddress(currentAddress);
    setSavedAddresses(savedAddresses);
    setPincodes(pincodeResponse.data.pincodes);
  };

  useEffect(() => {
    const userToken = Cookies.get("user_token");
    setUserToken(userToken);
    if (!userToken) {
      router.push("/user/auth/login");
      return;
    }
    fetchData(userToken);
    setPageLoading(false);
  }, []);

  return (
    <div className="md:w-1/2 lg:w-1/3 mx-auto">
      <h1 className="text-center text-2xl">Shipping Info</h1>
      <div>
        {!pageLoading ? (
          <div className="p-3">
            <div>
              <div className="border rounded-3xl">
                <div
                  className="px-5 py-2 text-gray-600 flex justify-between items-center"
                  onClick={() => setExpandedNewAddress(true)}
                >
                  <span className="cursor-pointer">Add New Address</span>
                  {!expandedNewAddress && (
                    <svg
                      className="w-4 h-4 text-gray-600 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  )}
                </div>

                {expandedNewAddress && (
                  <div className="px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-600 mt-2 mb-1">
                        Full Name
                      </span>
                      <input
                        onChange={handleOnChange}
                        value={newAddress.name}
                        name="name"
                        className="p-1 rounded-full text-sm px-4 border border-gray-200"
                        type="text"
                        placeholder="Your Full Name"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-600 mt-2 mb-1">
                        Phone/Contact
                      </span>
                      <input
                        onChange={handleOnChange}
                        value={newAddress.phone}
                        name="phone"
                        className="p-1 rounded-full text-sm px-4 border border-gray-200"
                        type="text"
                        placeholder="10-Digit Phone Number"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-600 mt-2 mb-1">
                        Email
                      </span>
                      <input
                        onChange={handleOnChange}
                        value={newAddress.email}
                        name="email"
                        className="p-1 rounded-full text-sm px-4 border border-gray-200"
                        type="email"
                        placeholder="for eg. youremail@xyz.com"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-600 mt-2 mb-1">
                        Address
                      </span>
                      <input
                        onChange={handleOnChange}
                        value={newAddress.subaddress}
                        name="subaddress"
                        className="p-1 rounded-full text-sm px-4 border border-gray-200"
                        type="text"
                        placeholder="eg. House No, Street Name, etc"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-600 mt-2 mb-1">
                        Pincode
                      </span>
                      <input
                        onChange={handleOnChange}
                        value={newAddress.pincode}
                        name="pincode"
                        className={`p-1 rounded-full text-sm px-4 border border-gray-200 ${
                          pincodeError ? "border-red-500" : ""
                        }`}
                        type="text"
                      />
                      {pincodeError && (
                        <span className="text-sm text-yellow-400 mx-2 mt-1">
                          Sorry, this location is currently unavailable
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-600 mt-2 mb-1">
                        City (Based on the selected location)
                      </span>
                      <input
                        disabled
                        onChange={handleOnChange}
                        value={newAddress.city}
                        name="city"
                        className="p-1 rounded-full text-sm px-4 border border-gray-200 text-gray-400"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-600 mt-2 mb-1">
                        State
                      </span>
                      <input
                        onChange={handleOnChange}
                        value={newAddress.state}
                        name="state"
                        className="p-1 rounded-full text-sm px-4 border border-gray-200"
                        type="text"
                      />
                    </div>

                    <div className="w-full flex justify-center my-3">
                      <button
                        disabled={pincodeError}
                        onClick={handleAddAddress}
                        className="border border-[#FE6321] bg-[#FE6321] px-5 py-1 rounded-full text-white font-bold text-sm mx-1"
                      >
                        Add Address
                      </button>

                      <button
                        onClick={() => {
                          setExpandedNewAddress((prev) => !prev);
                        }}
                        className="border border-gray-300 text-gray-500 bg-white px-5 py-1 rounded-full font-bold text-sm mx-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <h1 className="mt-4 mb-2 px-2 text-lg">
                Select Shipping Address
              </h1>

              <div>
                {savedAddresses && savedAddresses.length ? (
                  <div>
                    {savedAddresses.map((address) => {
                      const isSelected =
                        selectedAddress && selectedAddress.id === address.id; // Perform null check

                      return (
                        <div
                          className={`border my-2 rounded-2xl p-4 ${
                            isSelected
                              ? "border-[#FE6321] bg-[#FE6321] bg-opacity-10"
                              : ""
                          }`}
                          key={address.id}
                          onClick={() => handleAddressClick(address)}
                        >
                          <h1 className="text-xl">{address.name}</h1>
                          <div className="text-sm text-gray-600">
                            <p>
                              {address.subaddress}
                              <br />
                              {address.city}, {address.state}, {address.pincode}
                              , IN
                            </p>
                            <div>
                              <div>+91 {address.phone}</div>
                              <div>{address.email}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {!expandedNewAddress && (
                      <div className="w-full flex items-center justify-center">
                        <Link
                          href="/user/my-cart/checkout"
                          className="absolute bottom-20 bg-[#FE6321] px-10 py-2 rounded-3xl text-white font-bold hover:opacity-75"
                        >
                          Continue to Checkout
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center my-3">
                    <span className="text-gray-500">No saved addresses</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};

export default ShippingInfo;
