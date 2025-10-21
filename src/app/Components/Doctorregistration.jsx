"use client";
import Image from "next/image";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import { API_URL } from "../libs/global";

import { Poppins, Raleway, Inter, Outfit } from "next/font/google";

import CloseIcon from "@/app/Assets/closeiconwindow.png";
import ExpandIcon from "@/app/Assets/expand.png";
import ShrinkIcon from "@/app/Assets/shrink.png";
import { XCircleIcon } from "@heroicons/react/16/solid";

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
  const [adminemail, setAdminEmail] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      let adminUhid = null;

      if (typeof window !== "undefined") {
        adminUhid = sessionStorage.getItem("admin"); // 👈 safe access
      }
      try {
        const res = await axios.get(`${API_URL}getadminname/${adminUhid}`);
        setAdminEmail(res.data.admin_email);
      } catch (err) {
        // console.error("❌ Error fetching patients:", err);
        if (err.response) {
          setError(err.response.data.detail || "Failed to fetch patients");
        } else {
          setError("Network error");
        }
      }
    };

    fetchPatients();
  }, []);

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
  const [selectedOptiondrop, setSelectedOptiondrop] = useState("");

  const calendarRef = useRef(null);

  const refs = {
  firstName: useRef(null),
  lastName: useRef(null),
  ueid: useRef(null),
  designation: useRef(null),
  medicalcouncilnumber: useRef(null),
  selectedDate: useRef(null),
  email: useRef(null),
  selectedGender: useRef(null),
  phone: useRef(null),
};


  const handleManualDateChange = (e) => {
    let value = e.target.value;

    // Allow only digits and dashes
    value = value.replace(/[^0-9-]/g, "");

    // Auto-insert dashes only when needed (optional)
    if (/^\d{4}$/.test(value)) value += "-";
    else if (/^\d{4}-\d{2}$/.test(value)) value += "-";

    setSelectedDate(value);

    // Validate only when full length reached
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [yearStr, monthStr, dayStr] = value.split("-");
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);
      const day = parseInt(dayStr);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const manualDate = new Date(`${year}-${month}-${day}`);

      if (
        manualDate.getFullYear() !== year ||
        manualDate.getMonth() + 1 !== month ||
        manualDate.getDate() !== day
      ) {
        showWarning("Invalid date combination. Please enter a correct date.");
        setSelectedDate("");
        return;
      }

      if (manualDate >= today) {
        showWarning("Birth date cannot be today or a future date.");
        setSelectedDate("");
        return;
      }

       let age = today.getFullYear() - manualDate.getFullYear();


    if (age < 23) {
      showWarning("Age must be valid.");
      setSelectedDate("");
      return;
    }

      // ✅ Keep final format yyyy-mm-dd
      setSelectedDate(`${yearStr}-${monthStr}-${dayStr}`);
      // 🔄 Sync hidden calendar too
      if (calendarRef.current) {
        calendarRef.current.value = `${yearStr}-${monthStr}-${dayStr}`;
      }
    }
  };

  const handleCalendarChange = (e) => {
    const value = e.target.value; // yyyy-mm-dd
    if (!value) return;

    const [year, month, day] = value.split("-");
    const selectedDateObj = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    // 🚫 Prevent today or future
    if (selectedDateObj >= today) {
      showWarning("Pleae select a valid birth date");
      setSelectedDate("");
      e.target.value = ""; // clear calendar value
      return;
    }

    // ✅ Keep internal format as yyyy-mm-dd
    const formatted = `${year}-${month}-${day}`;
    setSelectedDate(formatted);

    // 🔄 Optional: if you want to display DD-MM-YYYY in the text box
    // while storing YYYY-MM-DD internally
    const display = `${day}-${month}-${year}`;
    // setVisibleDate(display);

    const manualDate = new Date(`${year}-${month}-${day}`);

    const age = today.getFullYear() - manualDate.getFullYear();
  
    if (age < 23) {
      showWarning("Age must be valid.");
      setSelectedDate("");
      return;
    }

    // Also update the hidden input for next open
    if (calendarRef.current) calendarRef.current.value = formatted;
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
    setSelectedOptiondrop("");
    setPhone("");
    setEmail("");
    setdesignation("");
    setmedicalcouncilnumber("");
    setSelectedDate("");
  };

  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async () => {
    let adminUhid = "";
    // ✅ List of fields to validate
    if (typeof window !== "undefined") {
      adminUhid = sessionStorage.getItem("admin"); // 👈 safe access
    }
    const requiredFields = [
      { value: firstName, message: "First Name is required" },
      { value: lastName, message: "Last Name is required" },
      { value: ueid, message: "Doctor UEID is required" },
      { value: designation, message: "Designation is required" },
      {
        value: medicalcouncilnumber,
        message: "Medical Council Number is required",
      },
      { value: selectedDate, message: "Date of Birth is required" },
      { value: email, message: "Doctor Email is required" },
      { value: selectedGender, message: "Gender is required" },
      { value: phone, message: "Phone number is required" },
    ];

   for (let field of requiredFields) {
    if (!field.value || (Array.isArray(field.value) && field.value.length === 0)) {
      showWarning(field.message);

      // Map messages to refs
      const messageToRef = {
        "first name is required": refs.firstName,
        "last name is required": refs.lastName,
        "doctor ueid is required": refs.ueid,
        "designation is required": refs.designation,
        "medical council number is required": refs.medicalcouncilnumber,
        "date of birth is required": refs.selectedDate,
        "doctor email is required": refs.email,
        "gender is required": refs.selectedGender,
        "phone number is required": refs.phone,
      };

      const lowerMsg = field.message.toLowerCase();
      const targetRef = messageToRef[lowerMsg];

      if (targetRef?.current) {
        targetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        targetRef.current.focus?.();
        targetRef.current.classList.add("ring-2", "ring-red-500");

        setTimeout(() => {
          targetRef.current.classList.remove("ring-2", "ring-red-500");
        }, 2000);
      }

      return; // stop validation after first missing field
    }
  }

  // ✅ Optional phone length check
  if (phone.length !== 10) {
    showWarning("Phone number must be 10 digits");
    refs.phone?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    refs.phone?.current?.classList.add("ring-2", "ring-red-500");
    setTimeout(() => refs.phone?.current?.classList.remove("ring-2", "ring-red-500"), 2000);
    return;
  }

    const payload = {
      doctor_name: `${firstName} ${lastName}`,
      gender: selectedGender.toLowerCase(),
      dob: selectedDate,
      email: email || "sample@gmail.com",
      designation: designation,
      uhid: ueid,
      phone_number: phone || "NA",
      blood_group: selectedOptiondrop || "NA",
      password: "doctor@123", // set or generate
      admin_created: adminemail, // pass logged-in admin email
      profile_picture_url: "NA",
      doctor_council_number: medicalcouncilnumber,
    };
    // console.log("Submitting payload:", payload);
    try {
      const res = await axios.post(`${API_URL}doctor/fhir`, payload);

      // console.log("✅ Doctor created:", res.data);
      if (res.data.status === "failed") {
        showWarning("Doctor already found!");
      } else {
        showWarning("Doctor created successfully!");
        window.location.reload();
      }
    } catch (err) {
      console.error("❌ Error creating doctor:", err);
      showWarning("Failed to create doctor.");
    }
  };

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

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        clearAllFields();
        setexpand(false);
        onCloseacc();
      }
    };

    window.addEventListener("keydown", handleEsc);

    // cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
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
                  className={`w-1/2 ${inter.className} text-2xl font-semibold text-black`}
                >
                  New Doctor
                </p>
                <div
                  className={`w-1/2 flex flex-row gap-4 items-center justify-end`}
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
                  <XCircleIcon
                    className="w-fit h-6 text-red-600  cursor-pointer"
                    onClick={() => {
                      onCloseacc();
                      setexpand(false);
                      clearAllFields();
                    }}
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
                      First Name <span className="text-red-500">*</span>
                    </p>
                    <input
                    ref={refs.firstName}
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
                      onChange={(e) => {
                        // Remove non-alphabetic characters
                        let value = e.target.value.replace(/[^a-zA-Z]/g, "");

                        // Capitalize the first letter, lowercase the rest
                        if (value.length > 0) {
                          value =
                            value.charAt(0).toUpperCase() +
                            value.slice(1).toLowerCase();
                        }

                        setFirstName(value);
                      }}
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
                      Last Name <span className="text-red-500">*</span>
                    </p>
                    <input
                      ref={refs.lastName}
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
                      onChange={(e) => {
                        // Allow only letters and spaces
                        let value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

                        setLastName(value);
                      }}
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
                      UEID <span className="text-red-500">*</span>
                    </p>
                    <input
                      ref={refs.ueid}
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
                      maxLength={20}
                      value={ueid}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters, numbers, and hyphens
                        const filtered = value.replace(/[^a-zA-Z0-9-]/g, "");
                        setueid(filtered);
                      }}
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
                      Designation <span className="text-red-500">*</span>
                    </p>
                    <input
                    ref={refs.designation}
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
                      onChange={(e) => {
                        // Allow only letters and spaces
                        let value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                        if (value.length > 0) {
                          value =
                            value.charAt(0).toUpperCase() +
                            value.slice(1).toLowerCase();
                        }
                        setdesignation(value);
                      }}
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
                      Medical Council Number{" "}
                      <span className="text-red-500">*</span>
                    </p>
                    <input
                    ref={refs.medicalcouncilnumber}
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
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters, numbers, and hyphens
                        const filtered = value.replace(/[^a-zA-Z0-9-]/g, "");
                        setmedicalcouncilnumber(filtered.toUpperCase());
                      }}
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
                      Date of Birth <span className="text-red-500">*</span>
                    </p>
                   <div className="relative w-full">
                        {/* ✏️ Manual text input */}
                        <input
                        ref={refs.selectedDate}
                          type="text"
                          className={`
                            w-full
                            bg-transparent
                            border-b-2
                            border-black
                            outline-none
                            text-black/80
                            py-1.5
                            font-medium
                            text-base
                            pr-10
                          `}
                          placeholder="YYYY-MM-DD"
                          value={selectedDate}
                          onChange={handleManualDateChange}
                          maxLength={10}
                        />

                        {/* 📅 Hidden date picker (covers icon only) */}
                        <input
                          ref={calendarRef}
                          type="date"
                          className="absolute top-0 right-0 opacity-0 cursor-pointer w-8 h-8"
                          onChange={handleCalendarChange}
                          min="1900-01-01"
                          max={`${new Date().getFullYear() - 23}-12-31`} // 🔒 blocks current and future years
                        />

                        {/* 📅 Visible calendar icon */}
                        <button
                          type="button"
                          onClick={() => calendarRef.current?.showPicker?.()}
                          className="absolute right-2 top-1.5 text-gray-600 hover:text-black cursor-pointer"
                          title="Pick from calendar"
                        >
                          📅
                        </button>
                      </div>
                  </div>

                  <div
                    className={`flex flex-col justify-between ${
                      width >= 1200 ? "w-1/2" : "w-full"
                    }`}
                  >
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Email <span className="text-red-500">*</span>
                    </p>
                    <input
                    ref={refs.email}
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
                      onBlur={() => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (email && !emailRegex.test(email)) {
                          showWarning("Please enter a valid email address.");
                          setEmail("");
                        }
                      }}
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
                        Select
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
                      Gender <span className="text-red-500">*</span>
                    </p>
                    <select
                    ref={refs.selectedGender}
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
                      <option value="" disabled>
                        Select
                      </option>
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
                      Phone Number <span className="text-red-500">*</span>
                    </p>
                    <input
                    ref={refs.phone}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
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
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // keep only digits
                        setPhone(value);
                      }}
                      onBlur={() => {
                        if (phone && phone.length !== 10) {
                          showWarning("Phone number must be 10 digits");
                          return;
                        }
                      }}
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
                  className={`text-black/80 font-normal ${
                    outfit.className
                  } cursor-pointer ${width < 700 ? "w-1/2" : "w-1/7"}`}
                  onClick={clearAllFields}
                >
                  Clear All
                </button>
                <button
                  className={`bg-[#161C10] text-white py-2 rounded-sm font-normal cursor-pointer ${
                    outfit.className
                  } ${width < 700 ? "w-1/2" : "w-1/7"}`}
                  onClick={() => {
                    handleSubmit();
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
