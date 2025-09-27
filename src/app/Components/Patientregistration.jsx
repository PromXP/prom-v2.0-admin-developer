"use client";
import Image from "next/image";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import { API_URL } from "../libs/global";

import { Poppins, Raleway, Inter, Outfit } from "next/font/google";

import CloseIcon from "@/app/Assets/closeiconwindow.png";
import UploadProfile from "@/app/Assets/uploadprofilepic.png";
import ExpandIcon from "@/app/Assets/expand.png";
import ShrinkIcon from "@/app/Assets/shrink.png";

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

const Patientregistration = ({ isOpenacc, onCloseacc }) => {
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
  const [address, setAddress] = useState("");
  const [uhid, setUhid] = useState("");
  const [phone, setPhone] = useState("");
  const [alterphone, setalterPhone] = useState("");
  const [email, setEmail] = useState("");
  const [heightbmi, setHeightbmi] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [selectedGender, setSelectedGender] = useState("Male"); // "female" | "male" | "other"
  const [selectedOptiondrop, setSelectedOptiondrop] = useState("A+");
  const [selectedDate, setSelectedDate] = useState("");
  const [surgerydate, setsurgeryDate] = useState("");
  const [surgeryname, setsurgeryname] = useState("");

  const dateInputRef = useRef(null);

  const openDatePicker = () => {
    dateInputRef.current?.showPicker();
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    // console.log("Raw input value:", dateValue);

    if (dateValue) {
      const selected = new Date(dateValue);
      const today = new Date();

      // Remove time component from today's date
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);

      // console.log("Selected Date:", selected.toDateString());
      // console.log("Today's Date:", today.toDateString());

      if (selected >= today) {
        console.warn("Invalid birth date selected.");
        showWarning("Birth date cannot be today or a future date.");
        setSelectedDate(null);
        return;
      }

      const formattedDate = selected.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      // console.log("Formatted Date:", formattedDate);
      setSelectedDate(formattedDate);
    }
  };

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

    // Show raw value until full date entered
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

      // ✅ Final format as yyyy-mm-dd
      const formattedDate = `${manualDate.getFullYear()}-${String(
        manualDate.getMonth() + 1
      ).padStart(2, "0")}-${String(manualDate.getDate()).padStart(2, "0")}`;

      setSelectedDate(formattedDate);
    }
  };

  const handleManualsurgeryDateChange = (e) => {
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
    setsurgeryDate(value);

    if (value.length === 10) {
      const [dayStr, monthStr, yearStr] = value.split("-");
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      const today = new Date();
      const currentYear = today.getFullYear();

      // Basic validations
      if (day < 1 || day > 31 || month < 1 || month > 12) {
        showWarning("Please enter a valid surgery date");
        setS("");
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
        setsurgeryDate("");
        return;
      }

      // 🚨 Past date check
      // if (manualDate < today) {
      //   showWarning("Past dates are not allowed");
      //   setsurgeryDate("");
      //   return;
      // }

      // Check if future or today
      today.setHours(0, 0, 0, 0);
      manualDate.setHours(0, 0, 0, 0);

      // If all valid, format as "dd Mmm yyyy"
      const formattedDate = manualDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      });

      // Final validated date components
      const isoDate = `${year.toString().padStart(4, "0")}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      setsurgeryDate(isoDate); // This avoids time zone issues
    }
  };

  const idOptions = ["PASSPORT", "PAN", "AADHAAR", "ABHA"];
  const [selectedIDs, setSelectedIDs] = useState(
    idOptions.reduce((acc, id) => ({ ...acc, [id]: "NA" }), {})
  );

  const handleCheckboxChange = (id) => {
    setSelectedIDs((prev) => {
      const updated = { ...prev };
      // toggle: NA <-> ""
      updated[id] = prev[id] === "NA" ? "" : "NA";
      return updated;
    });
  };

  const handleInputChange = (id, value) => {
    setSelectedIDs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const [selectedFunding, setSelectedFunding] = useState("");
  const [otherFunding, setOtherFunding] = useState("");

  const fundingOptions = [
    "SELF",
    "CGHS",
    "INSURANCE",
    "INSURANCE+CASH",
    "OTHER",
  ];

  const handleFundingChange = (value) => {
    setSelectedFunding(value);
    if (value !== "OTHER") setOtherFunding(""); // Clear other input if not selected
  };

  const [selectedKnees, setSelectedKnees] = useState([]); // e.g., ["left", "right"]

  const toggleKnee = (knee) => {
    setSelectedKnees((prev) =>
      prev.includes(knee) ? prev.filter((k) => k !== knee) : [...prev, knee]
    );
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
    setUhid("");
    setSelectedDate("");
    setSelectedGender("");
    setSelectedOptiondrop("NN");
    setPhone("");
    setEmail("");
    setHeightbmi("");
    setWeight("");
    setBmi("");
    setsurgeryDate("");
    setAddress("");
    setsurgeryname("");
    setSelectedKnees([]);
    setalterPhone("");
    setSelectedIDs({});
    setSelectedFunding("");
    setOtherFunding("");
  };

  const [alertMessage, setAlertMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [leftChecked, setLeftChecked] = useState(false);
  const [rightChecked, setRightChecked] = useState(false);

  // Auto calculate BMI whenever height or weight changes
  useEffect(() => {
    const h = parseFloat(heightbmi);
    const w = parseFloat(weight);

    if (h > 0 && w > 0) {
      const bmiVal = w / ((h / 100) * (h / 100));
      setBmi(bmiVal.toFixed(2));
    } else {
      setBmi("");
    }
  }, [heightbmi, weight]);

  const showWarning = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const [expand, setexpand] = useState(false);

  const [mounted, setMounted] = useState(false);

  const handleCreatePatient = async () => {
    let adminUhid = "";
    // ✅ List of fields to validate
    if (typeof window !== "undefined") {
      adminUhid = sessionStorage.getItem("admin"); // 👈 safe access
    }
    const requiredFields = [
      { value: adminUhid, message: "Admin UHID is missing" },
      { value: uhid, message: "Patient UHID is required" },
      { value: firstName, message: "First Name is required" },
      { value: lastName, message: "Last Name is required" },
      { value: email, message: "Email is required" },
      { value: phone, message: "Phone number is required" },
      { value: selectedDate, message: "Date of Birth is required" },
      { value: selectedGender, message: "Gender is required" },
      { value: address, message: "Address is required" },
      { value: heightbmi, message: "Height is required" },
      { value: weight, message: "Weight is required" },
      { value: selectedFunding, message: "Operation funding is required" },
      { value: selectedIDs, message: "ID Proof is required" },
      { value: selectedKnees, message: "Patient current status is required" },
      { value: surgerydate, message: "Surgery date is required" },
    ];

    // ✅ Check one by one
    for (let field of requiredFields) {
      if (
        !field.value ||
        (Array.isArray(field.value) && field.value.length === 0)
      ) {
        showWarning(field.message);
        return;
      }
    }

    // ✅ Special checks
    if (phone.length !== 10) {
      showWarning("Phone number must be 10 digits");
      return;
    }

    if (alterphone.length !== 10) {
      showWarning("Alternate phone number must be 10 digits");
      return;
    }

    // ✅ Build payload after validation
    const payload = {
      base: {
        uhid: uhid,
        first_name: firstName,
        last_name: lastName,
        password: "patient@123", // adjust as needed
        vip: 0,
        dob: selectedDate,
        gender: selectedGender.toLowerCase(),
      },
      contact: {
        uhid: uhid,
        email: email,
        phone_number: phone,
        alternatenumber: alterphone || "",
        address: address,
        doctor_uhid_left: "NA",
        doctor_uhid_right: "NA",
        admin_uhid: adminUhid,
        opd_appointment_date: "",
        profile_picture_url: "NA",
      },
      medical: {
        uhid: uhid,
        blood_grp: selectedOptiondrop || "",
        height: Number(heightbmi),
        weight: Number(weight),
        activation_status: true,
        activation_comment: [],
        patient_followup_comment: [],
        operation_funding:
          selectedFunding === "OTHER" ? otherFunding : selectedFunding,
        idproof: selectedIDs,
        patient_current_status:
          selectedKnees.length > 0 ? selectedKnees.join(", ") : "NONE",
        surgery_date_left: selectedKnees.includes("LEFT")
          ? surgerydate
          : "0001-01-01",
        surgery_date_right: selectedKnees.includes("RIGHT")
          ? surgerydate
          : "0001-01-01",
      },
    };

    // console.log("Submitting payload:", payload);
    // return

    try {
      const res = await axios.post(`${API_URL}patients/full`, payload);
      // console.log("✅ Patient created:", res.data);
      showWarning("Patient created successfully!");
      if (profileImage) {
        handleUpload();
      }
    } catch (error) {
      // console.error("❌ Error creating patient:", error);
      showWarning("Failed to create patient" + error);
    } finally {
      window.location.reload();
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleUpload = async () => {
    if (!profileImage) {
      setError("Please select or capture an image.");
      return;
    }

    const formData = new FormData();
    formData.append("uhid", uhid);
    formData.append("usertype", "patient"); // <-- Make sure userType is defined
    formData.append("profile_image", profileImage);

    try {
      const res = await axios.post(`${API_URL}upload-profile-photo`, formData);

      // console.log("Profile upload success:", res.data);
      showWarning("Image uploaded successfully.");
    } catch (err) {
      // console.error("Profile upload failed:", err);
      showWarning("Upload failed.");
    }
  };

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
          ${width < 950 ? "gap-4 w-full" : "w-5/6"}
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
                  New Patient
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
                    width >= 1200 ? "w-1/2" : "w-full"
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

                <div
                  className={`flex flex-col gap-2 ${
                    width >= 1200 ? "w-1/2" : "w-full"
                  }`}
                >
                  <p
                    className={` ${outfit.className} font-normal text-base text-black/80`}
                  >
                    UHID *
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
                    value={uhid}
                    onChange={(e) => setUhid(e.target.value)}
                  />
                </div>
              </div>

              <div
                className={`flex gap-12 ${
                  width >= 1200 ? "flex-row" : "flex-col"
                }`}
              >
                <div
                  className={`flex flex-col gap-8 ${
                    width >= 1200 ? "w-1/2" : "w-full"
                  }`}
                >
                  <div
                    className={`w-full flex  gap-8 ${
                      width < 700 ? "flex-col" : "flex-row"
                    }`}
                  >
                    {/* Blood Group Dropdown */}
                    <div
                      className={`flex flex-col gap-2 ${
                        width < 700 ? "w-full" : "w-1/3"
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

                    {/* Gender Dropdown */}
                    <div
                      className={`flex flex-col gap-2 ${
                        width < 700 ? "w-full" : "w-1/3"
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

                    {/* Date of Birth Input */}
                    <div
                      className={`flex flex-col gap-2.5 ${
                        width < 700 ? "w-full" : "w-1/3"
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
                      text-black/80
                      py-1.5
                      font-medium
                      text-base
                      ${inter.className}
                    `}
                        placeholder="DD-MM-YYYY"
                        value={selectedDate}
                        onChange={handleManualDateChange}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className={`w-full flex flex-col gap-2`}>
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Phone Number *
                    </p>
                    <input
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
                    />
                  </div>

                  <div className={`w-full flex flex-col gap-2`}>
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Alternate Phone Number
                    </p>
                    <input
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
                      value={alterphone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // keep only digits
                        setalterPhone(value);
                      }}
                    />
                  </div>

                  <div className={`w-full flex flex-col gap-2`}>
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Email *
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

                <div
                  className={`flex flex-col gap-2 justify-between ${
                    width >= 1200 ? "w-1/2" : "w-full"
                  }`}
                >
                  <div
                    className={`w-full flex  gap-2 ${
                      width < 700 ? "flex-col" : "flex-row"
                    }`}
                  >
                    <div
                      className={` flex flex-col gap-2 ${
                        width < 700 ? "w-full" : "w-4/7"
                      }`}
                    >
                      <p
                        className={`${outfit.className} font-normal text-base text-black/80`}
                      >
                        Address *
                      </p>
                      <textarea
                        className={`
                          w-full
                          bg-[#D9D9D9]/20
                          outline-none
                          text-black
                          py-2 px-2
                          font-medium
                          text-base
                          resize-none
                          ${inter.className}
                        `}
                        rows={8}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div
                      className={`flex items-center justify-center ${
                        width < 700 ? "w-full" : "w-3/7"
                      }`}
                    >
                      <div
                        className="w-[256px] h-[256px] cursor-pointer"
                        onClick={() => fileInputRef.current.click()}
                        style={{ position: "relative" }}
                      >
                        {isBlobUrl ? (
                          // Plain <img> for blob URLs
                          <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "fill",
                              borderRadius: 8,
                            }}
                            className="border"
                          />
                        ) : (
                          // Next.js Image for static or remote URLs
                          <Image
                            src={previewUrl || UploadProfile}
                            alt="Upload or Capture"
                            layout="fill"
                            objectFit="cover"
                            className="rounded border w-full h-full"
                          />
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`w-full flex flex-row gap-12 justify-end`}>
                    <div className="w-full flex flex-row gap-8 mt-4">
                      <div className="w-1/3 flex flex-col gap-2.5 justify-between">
                        <p
                          className={`${outfit.className} font-normal text-base text-black/80`}
                        >
                          Height (cm) *
                        </p>
                        <input
                          type="number"
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
                          value={heightbmi}
                          onChange={(e) => setHeightbmi(e.target.value)}
                          min={0}
                        />
                      </div>
                      <div className="w-1/3 flex flex-col gap-2.5 justify-between">
                        <p
                          className={`${outfit.className} font-normal text-base text-black/80`}
                        >
                          Weight (kg) *
                        </p>
                        <input
                          type="number"
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
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          min={0}
                        />
                      </div>
                      <div className="w-1/3 flex flex-col gap-2 justify-between">
                        <p
                          className={`${outfit.className} font-normal text-base text-black/80`}
                        >
                          BMI
                        </p>
                        <div
                          className={`
                          w-full
                          bg-transparent
                          text-black
                          font-medium
                          text-lg
                          flex
                          items-end
                          ${inter.className}
                        `}
                          style={{ minHeight: "2.5rem" }}
                        >
                          {bmi ? bmi : "00.00"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-6 ">
                <p
                  className={`${outfit.className} font-normal text-base text-black/80`}
                >
                  ID PROOF *
                </p>
                <div className="flex flex-wrap gap-8">
                  {idOptions.map((id) => (
                    <label
                      key={id}
                      className="flex items-center gap-2 text-black/80 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIDs[id] !== "NA"}
                        onChange={() => handleCheckboxChange(id)}
                        className="accent-[#319B8F]"
                      />
                      {id}
                    </label>
                  ))}
                </div>
                {/* Optional: Show input for selected IDs */}
                {Object.keys(selectedIDs).map((id) => (
                  <div key={id} className="mt-2 flex flex-col gap-1">
                    <label
                      className={`${outfit.className} text-base text-black/80`}
                    >
                      {id} Number
                    </label>
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
                      value={selectedIDs[id] === "NA" ? "" : selectedIDs[id]}
                      disabled={selectedIDs[id] === "NA"}
                      onChange={(e) => handleInputChange(id, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className={`w-full flex flex-col gap-12`}>
                <p
                  className={`${inter.className} font-bold text-lg text-black`}
                >
                  Surgery Details
                </p>
                <div
                  className={`w-full flex gap-8 ${
                    width >= 1200 ? "flex-row" : "flex-col"
                  }`}
                >
                  <div
                    className={`flex flex-col gap-2 ${
                      width >= 1200 ? "w-1/2" : "w-full"
                    }`}
                  >
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Surgery Name *
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
                      value={surgeryname}
                      onChange={(e) => setsurgeryname(e.target.value)}
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
                      Surgery Date *
                    </p>
                    <input
                      type="text"
                      className={`
                        w-full
                        bg-transparent
                        border-b-2
                        border-black
                        outline-none
                        text-black/80
                        font-medium
                        text-lg
                        ${inter.className}
                      `}
                      placeholder="DD-MM-YYYY"
                      value={surgerydate}
                      onChange={handleManualsurgeryDateChange}
                      maxLength={10}
                    />
                  </div>
                </div>
                <div
                  className={`w-full flex gap-8 ${
                    width >= 1200 ? "flex-row" : "flex-col"
                  }`}
                >
                  <div
                    className={`flex flex-col gap-2 ${
                      width >= 1200 ? "w-1/2" : "w-full"
                    }`}
                  >
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Side *
                    </p>
                    <div className="w-full flex flex-row gap-4 mt-2">
                      <label
                        className={` ${outfit.className} flex items-center gap-2 text-black/80 text-lg cursor-pointer`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedKnees.includes("LEFT")}
                          onChange={() => toggleKnee("LEFT")}
                          className="accent-[#319B8F]"
                        />
                        Left Knee
                      </label>
                      <label
                        className={` ${outfit.className} flex items-center gap-2 text-black/80 text-lg cursor-pointer`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedKnees.includes("RIGHT")}
                          onChange={() => toggleKnee("RIGHT")}
                          className="accent-[#319B8F]"
                        />
                        Right Knee
                      </label>
                    </div>
                  </div>
                  <div
                    className={`flex flex-col gap-2 ${
                      width >= 1200 ? "w-1/2" : "w-full"
                    }`}
                  >
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Operation Funding *
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
                      value={selectedFunding}
                      onChange={(e) => handleFundingChange(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Funding
                      </option>
                      {fundingOptions.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {selectedFunding === "OTHER" && (
                      <input
                        type="text"
                        className={`
                              w-full
                              bg-transparent
                              border-b-2
                              border-black
                              outline-none
                              text-black
                              py-2
                              font-medium
                              text-sm
                              mt-2
                              ${inter.className}
                            `}
                        value={otherFunding}
                        onChange={(e) => setOtherFunding(e.target.value)}
                        placeholder="Please specify other funding"
                      />
                    )}
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
                    // Handle form submission logic here
                    handleCreatePatient();
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

export default Patientregistration;
