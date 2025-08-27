"use client";
import Image from "next/image";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { Poppins, Raleway, Inter, Outfit } from "next/font/google";

import CloseIcon from "@/app/Assets/closeiconwindow.png";
import UploadProfile from "@/app/assets/uploadprofilepic.png";
import ExpandIcon from "@/app/assets/expand.png";
import ShrinkIcon from "@/app/assets/shrink.png";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // add the weights you need
  variable: "--font-raleway", // optional CSS variable
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // add weights as needed
  variable: "--font-inter", // optional CSS variable name
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // add weights as needed
  variable: "--font-inter", // optional CSS variable name
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // add weights as needed
  variable: "--font-outfit", // optional CSS variable name
});

const Doctorregistration = ({ isOpenacc, onCloseacc }) => {
  const useWindowSize = () => {
    const [size, setSize] = useState({
      width: 0,
      height: 0,
    });

    useEffect(() => {
      const updateSize = () => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateSize(); // set initial size
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
  };

  const { width, height } = useWindowSize();

  const [showAlert, setShowAlert] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ueid, setueid] = useState("");
  const [designation, setdesignation] = useState("");
  const [medicalcouncilnumber, setmedicalcouncilnumber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGender, setSelectedGender] = useState(""); // "female" | "male" | "other"
  const [age, setAge] = useState(0);
  const [selectedOptiondrop, setSelectedOptiondrop] = useState("NN");

  const handleManualDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove all non-digits

    if (value.length >= 3 && value.length <= 4) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    } else if (value.length > 4 && value.length <= 8) {
      value =
        value.slice(0, 2) + "-" + value.slice(2, 4) + "-" + value.slice(4);
    } else if (value.length > 8) {
      value = value.slice(0, 8);
      value =
        value.slice(0, 2) + "-" + value.slice(2, 4) + "-" + value.slice(4);
    }

    // Until full date entered, show raw value
    setSelectedDate(value);

    if (value.length === 10) {
      const [dayStr, monthStr, yearStr] = value.split("-");
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      const today = new Date();
      const currentYear = today.getFullYear();

      // Basic validations
      if (
        day < 1 ||
        day > 31 ||
        month < 1 ||
        month > 12 ||
        year >= currentYear
      ) {
        showWarning("Please enter a valid date of birth.");
        setSelectedDate("");
        return;
      }

      // Check valid real date
      const manualDate = new Date(`${year}-${month}-${day}`);
      if (
        manualDate.getDate() !== day ||
        manualDate.getMonth() + 1 !== month ||
        manualDate.getFullYear() !== year
      ) {
        showWarning("Invalid date combination. Please enter a correct date.");
        setSelectedDate("");
        return;
      }

      // Check if future or today
      today.setHours(0, 0, 0, 0);
      manualDate.setHours(0, 0, 0, 0);

      if (manualDate >= today) {
        showWarning("Birth date cannot be today or a future date.");
        setSelectedDate("");
        return;
      }

      // If all valid, format as "dd Mmm yyyy"
      const formattedDate = manualDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      setSelectedDate(formattedDate);
    }
  };

  const [opendrop, setOpendrop] = useState(false);

  const optionsdrop = [
    "A+",
    "A−",
    "B+",
    "B−",
    "AB+",
    "AB−",
    "O+",
    "O−",
    "A1+",
    "A1−",
    "A2+",
    "A2−",
    "Bombay (hh)",
    "Rh-null",
    "A3",
    "B3",
    "cisAB",
    "In(Lu)",
    "i (little i)",
    "Vel−",
    "Kell+",
    "Kell−",
    "Duffy (Fy a/b)",
    "Kidd (Jk a/b)",
    "MNS (M, N, S, s, U)",
    "Lutheran (Lu a/b)",
    "Lewis (Le a/b)",
    "P1",
    "Diego",
    "Colton",
    "Yt",
    "Xg",
  ];

  const handleSelectdrop = (option) => {
    setSelectedOptiondrop(option);
    setOpendrop(false);
  };

  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && e.target.files) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSuccess("");
      setError("");
    }
  };

  const isBlobUrl = previewUrl && previewUrl.startsWith("blob:");

  const fileInputRef = useRef(null); // To programmatically trigger the file input

  const clearAllFields = () => {
    setFirstName("");
    setLastName("");
    setueid("");
    setSelectedGender("");
    setSelectedOptiondrop("NN");
    setPhone("");
    setEmail("");
    setdesignation("");
    setmedicalcouncilnumber("");

  };

  const [alertMessage, setAlertMessage] = useState("");

  const showWarning = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const [expand, setexpand] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpenacc || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 "
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // white with 50% opacity
      }}
    >
      <div
        className={`
            min-h-[100vh]  flex flex-col items-center justify-center mx-auto my-auto
            ${width < 950 ? "gap-4 w-full" : "w-1/2"}
            ${expand ? "w-full" : "p-4"}
          `}
      >
        <div
          className={`w-full bg-[#FCFCFC]  p-4  overflow-y-auto overflow-x-hidden inline-scroll ${
            width < 1095 ? "flex flex-col gap-4" : ""
          } ${expand ? "max-h-[100vh]" : "max-h-[92vh] rounded-2xl"}`}
        >
          <div
            className={`w-full bg-[#FCFCFC]  ${
              width < 760 ? "h-fit" : "h-[80%]"
            } `}
          >
            <div
              className={`w-full h-full rounded-lg flex flex-col gap-12 ${
                width < 760 ? "py-0" : "py-4 px-8"
              }`}
            >
              <div className="flex flex-row justify-between items-center w-full">
                <p
                  className={`${inter.className} text-2xl font-semibold text-black`}
                >
                  New Doctor
                </p>
                <div
                  className={`flex flex-row gap-4 items-center justify-center`}
                >
                  {expand ? (
                    <Image
                      src={ShrinkIcon}
                      onClick={() => {
                        setexpand(false);
                      }}
                      alt="Expand"
                      className={`w-6 h-6 cursor-pointer`}
                    />
                  ) : (
                    <Image
                      src={ExpandIcon}
                      onClick={() => {
                        setexpand(true);
                      }}
                      alt="Expand"
                      className={`w-12 h-6 cursor-pointer`}
                    />
                  )}
                  <Image
                    src={CloseIcon}
                    alt="Close"
                    className={`w-fit h-6 cursor-pointer`}
                    onClick={() => onCloseacc()}
                  />
                </div>
              </div>

              <div
                className={`w-full flex gap-12 ${
                  width >= 1200 ? "flex-row" : "flex-col"
                }`}
              >
                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-row"}`}
                >
                  <div
                    className={`flex flex-col gap-2 ${
                      width < 700 ? "w-full" : "w-1/2"
                    }`}
                  >
                    <p
                      className={` ${outfit.className} font-normal text-base text-black/80`}
                    >
                      First Name *
                    </p>
                    <input
                      type="text"
                      className={`
                          w-full
                          bg-transparent
                          border-b-2
                          border-black
                          outline-none
                          text-black
                          font-medium
                          text-lg
                          ${inter.className}
                        `}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div
                    className={`flex flex-col gap-2 ${
                      width < 700 ? "w-full" : "w-1/2"
                    }`}
                  >
                    <p
                      className={` ${outfit.className} font-normal text-base text-black/80`}
                    >
                      Last Name *
                    </p>
                    <input
                      type="text"
                      className={`
                          w-full
                          bg-transparent
                          border-b-2
                          border-black
                          outline-none
                          text-black
                          font-medium
                          text-lg
                          ${inter.className}
                        `}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`w-full flex gap-12 ${
                  width >= 1200 ? "flex-row" : "flex-col"
                }`}
              >
                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-row"}`}
                >
                  <div
                    className={`flex flex-col gap-2 ${
                      width >= 1200 ? "w-1/2" : "w-full"
                    }`}
                  >
                    <p
                      className={` ${outfit.className} font-normal text-base text-black/80`}
                    >
                      UEID *
                    </p>
                    <input
                      type="text"
                      className={`
                        w-full
                        bg-transparent
                        border-b-2
                        border-black
                        outline-none
                        text-black
                        font-medium
                        text-lg
                        ${inter.className}
                      `}
                      value={ueid}
                      onChange={(e) => setueid(e.target.value)}
                    />
                  </div>
                  <div
                    className={`flex flex-col gap-2 ${
                      width < 700 ? "w-full" : "w-1/2"
                    }`}
                  >
                    <p
                      className={` ${outfit.className} font-normal text-base text-black/80`}
                    >
                      Designation *
                    </p>
                    <input
                      type="text"
                      className={`
                          w-full
                          bg-transparent
                          border-b-2
                          border-black
                          outline-none
                          text-black
                          font-medium
                          text-lg
                          ${inter.className}
                        `}
                      value={designation}
                      onChange={(e) => setdesignation(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`w-full flex gap-12 ${
                  width >= 1200 ? "flex-row" : "flex-col"
                }`}
              >
                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-row"}`}
                >
                  <div
                    className={`flex flex-col gap-2 ${
                      width >= 1200 ? "w-full" : "w-full"
                    }`}
                  >
                    <p
                      className={` ${outfit.className} font-normal text-base text-black/80`}
                    >
                      Medical Council Number *
                    </p>
                    <input
                      type="text"
                      className={`
                        w-full
                        bg-transparent
                        border-b-2
                        border-black
                        outline-none
                        text-black
                        font-medium
                        text-lg
                        ${inter.className}
                      `}
                      value={medicalcouncilnumber}
                      onChange={(e) => setmedicalcouncilnumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`w-full flex gap-12 ${
                  width >= 1200 ? "flex-row" : "flex-col"
                }`}
              >
                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-row"}`}
                >
                  <div
                    className={`flex flex-col gap-2 ${
                      width < 700 ? "w-full" : "w-1/2"
                    }`}
                  >
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Date of Birth *
                    </p>
                    <input
                      type="text"
                      className={`
                        w-full
                        bg-transparent
                        border-b-2
                        border-black
                        outline-none
                        text-black
                        font-medium
                        text-lg
                        ${inter.className}
                      `}
                      placeholder="DD-MM-YYYY"
                      value={selectedDate}
                      onChange={handleManualDateChange}
                      maxLength={10}
                    />
                  </div>

                  <div
                    className={`flex flex-col gap-2 ${
                      width >= 1200 ? "w-1/2" : "w-full"
                    }`}
                  >
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Email
                    </p>
                    <input
                      type="email"
                      className={`
                        w-full
                        bg-transparent
                        border-b-2
                        border-black
                        outline-none
                        text-black
                        font-medium
                        text-lg
                        ${inter.className}
                      `}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`w-full flex gap-12 ${
                  width >= 1200 ? "flex-row" : "flex-col"
                }`}
              >
                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-row"}`}
                >
                  <div
                    className={`flex flex-col gap-2 ${
                      width < 700 ? "w-full" : "w-1/2"
                    }`}
                  >
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Blood Group
                    </p>
                    <select
                      className={`
                        w-full
                        bg-transparent
                        border-b-2
                        border-black
                        outline-none
                        text-black/80
                        font-medium
                        text-base
                        py-2
                        ${inter.className}
                      `}
                      value={selectedOptiondrop}
                      onChange={(e) => setSelectedOptiondrop(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Blood Group
                      </option>
                      {optionsdrop.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    className={`flex flex-col gap-2 ${
                      width < 700 ? "w-full" : "w-1/2"
                    }`}
                  >
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Gender *
                    </p>
                    <select
                      className={`
                        w-full
                        bg-transparent
                        border-b-2
                        border-black
                        outline-none
                        text-black/80
                        py-2
                        font-medium
                        text-base
                        ${inter.className}
                      `}
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div
                className={`flex gap-12 ${
                  width >= 1200 ? "flex-row" : "flex-col"
                }`}
              >
                <div
                  className={`flex flex-col gap-8 ${
                    width >= 1200 ? "w-full" : "w-full"
                  }`}
                >


                  <div className={`w-full flex flex-col gap-2`}>
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Phone Number *
                    </p>
                    <input
                      type="text"
                      className={`
                        w-full
                        bg-transparent
                        border-b-2
                        border-black
                        outline-none
                        text-black
                        font-medium
                        text-lg
                        ${inter.className}
                      `}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                </div>
              </div>

              <div
                className={`w-full flex flex-row gap-6 items-center ${
                  width < 700 ? "justify-between" : "justify-end"
                }`}
              >
                <button
                  className={`text-black/80 font-normal ${outfit.className} cursor-pointer ${
                    width < 700 ? "w-1/2" : "w-1/7"
                  }`}
                  onClick={clearAllFields}
                >
                  Clear All
                </button>
                <button
                  className={`bg-[#161C10] text-white py-2 rounded-sm font-normal cursor-pointer ${
                    outfit.className
                  } ${width < 700 ? "w-1/2" : "w-1/7"}`}
                  onClick={() => {
                    // Handle form submission logic here
                    setSuccess("Patient registered successfully!");
                    setError("");
                  }}
                >
                  CREATE
                </button>
              </div>
            </div>
            {showAlert && (
              <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                  {alertMessage}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
      .inline-scroll::-webkit-scrollbar {
        width: 12px;
      }
      .inline-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .inline-scroll::-webkit-scrollbar-thumb {
        background-color: #076C40;
        border-radius: 8px;
      }

      .inline-scroll {
        scrollbar-color: #076C40 transparent;
      }
    `}
      </style>
    </div>,
    document.body // Render to body, outside constrained parent.
  );
};

export default Doctorregistration;
