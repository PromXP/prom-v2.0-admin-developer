"use client";
import Image from "next/image";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import { API_URL } from "../libs/global";

import { Poppins, Raleway, Inter, Outfit } from "next/font/google";

import CloseIcon from "@/app/Assets/closeiconwindow.png";
import UploadProfile from "@/app/Assets/profilepicupload.png";
import ExpandIcon from "@/app/Assets/expand.png";
import ShrinkIcon from "@/app/Assets/shrink.png";

import {
  ChevronRightIcon,
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ClipboardDocumentCheckIcon,
  XMarkIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

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
  const [selectedGender, setSelectedGender] = useState(""); // "female" | "male" | "other"
  const [selectedOptiondrop, setSelectedOptiondrop] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [surgerydate, setsurgeryDate] = useState("");
  const [surgeryname, setsurgeryname] = useState("");

  const refs = {
    firstName: useRef(null),
    lastName: useRef(null),
    uhid: useRef(null),
    selectedOptiondrop: useRef(null),
    selectedGender: useRef(null),
    selectedDate: useRef(null),
    address: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    heightbmi: useRef(null),
    weight: useRef(null),
    selectedIDs: useRef(null),
    surgerydate: useRef(null),
    leftKnee: useRef(null),
    rightKnee: useRef(null),
    selectedFunding: useRef(null),
  };
  const [errorField, setErrorField] = useState(null);


  const dateInputRef = useRef(null);

  const openDatePicker = () => {
    dateInputRef.current?.showPicker();
  };

  const calendarRef = useRef(null);

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

      // ✅ Keep final format yyyy-mm-dd
      setSelectedDate(`${yearStr}-${monthStr}-${dayStr}`);
      // 🔄 Sync hidden calendar too
      if (calendarRef.current) {
        calendarRef.current.value = `${yearStr}-${monthStr}-${dayStr}`;
      }
    }
  };

  // 📅 When user picks from calendar
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

    // Also update the hidden input for next open
    if (calendarRef.current) calendarRef.current.value = formatted;
  };

  const calendarRefsurg = useRef();

  // 📝 Manual input handler
  const handleManualSurgeryDateChange = (e) => {
    let value = e.target.value;

    // Allow only digits and dashes
    value = value.replace(/[^0-9-]/g, "");

    // Auto-insert dashes while typing
    // Auto-insert dashes only when needed (optional)
    if (/^\d{4}$/.test(value)) value += "-";
    else if (/^\d{4}-\d{2}$/.test(value)) value += "-";

    setsurgeryDate(value);

    // Validate only when full length reached
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [yearStr, monthStr, dayStr] = value.split("-");
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const manualDate = new Date(`${year}-${month}-${day}`);

      // Check if valid calendar date
      if (
        manualDate.getFullYear() !== year ||
        manualDate.getMonth() + 1 !== month ||
        manualDate.getDate() !== day
      ) {
        showWarning("Invalid date combination. Please enter a correct date.");
        setsurgeryDate("");
        return;
      }

      // // Block future dates (optional)
      if (manualDate < today) {
        showWarning("Past date is selected");

      }

      // ✅ Keep final format yyyy-mm-dd
      const isoDate = `${year.toString().padStart(4, "0")}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      setsurgeryDate(isoDate);

      // 🔄 Sync hidden calendar
      if (calendarRefsurg.current)
        calendarRefsurg.current.value = `${yearStr}-${monthStr}-${dayStr}`;
    }
  };

  // 📅 Calendar picker handler
  const handleCalendarChangesurg = (e) => {
    const value = e.target.value; // yyyy-mm-dd
    if (!value) return;

    const today = new Date().toISOString().split("T")[0];
    if (value < today) {
      showWarning("Past date is selected");

    }

    setsurgeryDate(value); // sync manual input
  };

  const idOptions = ["PASSPORT", "PAN", "AADHAAR", "ABHA"];
  const [selectedIDs, setSelectedIDs] = useState(
    idOptions.reduce((acc, id) => ({ ...acc, [id]: "NA" }), {})
  );

  const idConfig = {
    PASSPORT: { maxLength: 8, pattern: /^[A-Z][0-9]{7}$/i },
    AADHAAR: { maxLength: 12, pattern: /^\d{12}$/ },
    PAN: { maxLength: 10, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/i },
    ABHA: { maxLength: 14, pattern: /^\d{14}$/ },
  };

  const [idErrors, setIdErrors] = useState(
    idOptions.reduce((acc, id) => ({ ...acc, [id]: "" }), {})
  );

  const handleBlur = (id) => {
    const value = selectedIDs[id].trim();

    if (!value) {
      // Empty → treat as NA, no error
      setIdErrors((prev) => ({ ...prev, [id]: "NA" }));
      return;
    }

    if (!idConfig[id].pattern.test(value)) {
      // Invalid → show error and reset the input
      setIdErrors((prev) => ({
        ...prev,
        [id]: `${id} format is invalid`,
      }));
      setSelectedIDs((prev) => ({ ...prev, [id]: "NA" }));
    } else {
      // Valid → clear error
      setIdErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // Handle text change
  const handleInputChange = (id, value) => {
    setSelectedIDs((prev) => ({
      ...prev,
      [id]: value.trim() === "" ? "NA" : value, // store "NA" if empty
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
    setSelectedOptiondrop("");
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
    setSelectedIDs(idOptions.reduce((acc, id) => ({ ...acc, [id]: "NA" }), {}));
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
      { value: firstName, message: "First Name is required" },
      { value: lastName, message: "Last Name is required" },
      { value: uhid, message: "Patient UHID is required" },
      { value: selectedOptiondrop, message: "Blood Group is required" },
      { value: selectedGender, message: "Gender is required" },
      { value: selectedDate, message: "Date of Birth is required" },
      { value: address, message: "Address is required" },
      { value: phone, message: "Phone number is required" },
      { value: email, message: "Email is required" },
      { value: heightbmi, message: "Height is required" },
      { value: weight, message: "Weight is required" },
      { value: selectedIDs, message: "ID Proof is required" },
      { value: surgerydate, message: "Surgery date is required" },
      { value: selectedKnees, message: "Patient side is required" },
      { value: selectedFunding, message: "Operation funding is required" },
    ];

    // ✅ Check one by one
    for (let field of requiredFields) {
      if (
        !field.value ||
        (Array.isArray(field.value) && field.value.length === 0)
      ) {
        showWarning(field.message);
        // 🔽 Scroll to the corresponding field smoothly
    const fieldKey = field.message
      .toLowerCase()
      .replace(/[^a-z]/g, ""); // crude mapping, we’ll fix below

    // Find the actual ref key by mapping message → ref name
    const messageToRef = {
      "first name is required": refs.firstName,
      "last name is required": refs.lastName,
      "patient uhid is required": refs.uhid,
      "blood group is required": refs.selectedOptiondrop,
      "gender is required": refs.selectedGender,
      "date of birth is required": refs.selectedDate,
      "address is required": refs.address,
      "phone number is required": refs.phone,
      "email is required": refs.email,
      "height is required": refs.heightbmi,
      "weight is required": refs.weight,
      "id proof is required": refs.selectedIDs,
      "surgery date is required": refs.surgerydate,
      "operation funding is required": refs.selectedFunding,
    };

    let targetRef = messageToRef[field.message.toLowerCase()];
    // ✅ Special case for patient side (Left/Right Knee)
      if (field.message.toLowerCase().includes("patient side")) {
        // Try to scroll to left knee checkbox
        targetRef = refs.leftKnee || refs.rightKnee;
      }
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      targetRef.current.focus?.();
      // Highlight error visually
      setErrorField(targetRef.current);
      targetRef.current.classList.add("ring-2", "ring-red-500");

      // Remove highlight after 2s
      setTimeout(() => {
        targetRef.current.classList.remove("ring-2", "ring-red-500");
        setErrorField(null);
      }, 2000);
    }
        return;
      }
    }

    // ✅ Special checks
   if (phone.length !== 10) {
    showWarning("Phone number must be 10 digits");
    refs.phone?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    refs.phone?.current?.classList.add("ring-2", "ring-red-500");
    setTimeout(() => refs.phone?.current?.classList.remove("ring-2", "ring-red-500"), 2000);
    return;
  }

    if (alterphone && alterphone.length !== 10) {
      showWarning("Alternate phone number must be 10 digits");
      return;
    }

    if (alterphone && alterphone === phone) {
      showWarning("Phone and Alternate phone should not be same");
      return;
    }

    const anyFilled = Object.values(selectedIDs).some((val) => val !== "NA");
  if (!anyFilled) {
    showWarning("Please fill at least one ID Proof");
    refs.selectedIDs?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    refs.selectedIDs?.current?.classList.add("ring-2", "ring-red-500");
    setTimeout(() => refs.selectedIDs?.current?.classList.remove("ring-2", "ring-red-500"), 2000);
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
        alternatenumber: alterphone || "NA",
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
      window.location.reload();
    } catch (error) {
      // console.error("❌ Error creating patient:", error.response.data);
      showWarning(error.response.data.detail.replace(" in MongoDB", ""));
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
                  <XCircleIcon
                    className="w-fit h-7 text-red-600  cursor-pointer"
                    onClick={() => {
                      clearAllFields();
                      setexpand(false);
                      onCloseacc();
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

                <div
                  className={`flex flex-col gap-2 ${
                    width >= 1200 ? "w-1/2" : "w-full"
                  }`}
                >
                  <p
                    className={` ${outfit.className} font-normal text-base text-black/80`}
                  >
                    UHID <span className="text-red-500">*</span>
                  </p>
                  <input
                    ref={refs.uhid}
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
                    value={uhid}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only letters, numbers, and hyphens
                      const filtered = value.replace(/[^a-zA-Z0-9-]/g, "");
                      setUhid(filtered);
                    }}
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
                        Blood Group <span className="text-red-500">*</span>
                      </p>
                      <select
                        ref={refs.selectedOptiondrop}
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

                    {/* Gender Dropdown */}
                    <div
                      className={`flex flex-col gap-2 ${
                        width < 700 ? "w-full" : "w-1/3"
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

                    {/* Date of Birth Input */}
                    <div
                      className={`flex flex-col gap-2.5 ${
                        width < 700 ? "w-full" : "w-1/3"
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
                          max={`${new Date().getFullYear() - 1}-12-31`} // 🔒 blocks current and future years
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
                  </div>

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

                  <div className={`w-full flex flex-col gap-2`}>
                    <p
                      className={`${outfit.className} font-normal text-base text-black/80`}
                    >
                      Alternate Phone Number
                    </p>
                    <input
                      ref={refs.alterphone}
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
                      onBlur={() => {
                        if (alterphone && alterphone.length !== 10) {
                          showWarning(
                            "Alternate phone number must be 10 digits"
                          );
                          return;
                        }

                        if (alterphone && alterphone === phone) {
                          showWarning(
                            "Phone and Alternate phone should not be same"
                          );
                          return;
                        }
                      }}
                    />
                  </div>

                  <div className={`w-full flex flex-col gap-2`}>
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
                        Address <span className="text-red-500">*</span>
                      </p>
                      <textarea
                        ref={refs.address}
                        className={`
                          w-full
                          bg-[#D9D9D9]/20
                          outline-none
                          text-black
                          py-2 px-2
                          font-medium
                          text-base
                          resize-none
                          border-black border-2 rounded-md
                          ${inter.className}
                        `}
                        rows={8}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div
                      className={`flex flex-col items-center  ${
                        width < 700 ? "w-full" : "w-3/7"
                      } ${isBlobUrl ? "justify-between" : "justify-center"}`}
                    >
                      {isBlobUrl && (
                        <div className="w-full flex justify-end">
                          <TrashIcon
                            className={`w-5 h-5 text-red-600 text-right cursor-pointer`}
                            onClick={() => {
                              setPreviewUrl(null);
                              setProfileImage(null);
                            }}
                            title="Remove Profile Picture"
                          />
                        </div>
                      )}

                      <div
                        className="w-[200px] h-[200px] cursor-pointer"
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
                            title="Upload Profile Picture"
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
                          Height (cm) <span className="text-red-500">*</span>
                        </p>
                        <input
                          ref={refs.heightbmi}
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
                          onChange={(e) => {
                            let value = e.target.value;

                            // Allow typing freely (even temporarily out of range)
                            setHeightbmi(value);

                            // Optionally, enforce range after user finishes typing (blur event)
                          }}
                          onBlur={(e) => {
                            let value = Number(e.target.value);
                            if (value < 50) {
                              setHeightbmi("");
                              showWarning("Enter valid height");
                            } else if (value > 300) {
                              showWarning("Enter valid height");
                              setHeightbmi("");
                            }
                          }}
                          min={50}
                          max={300}
                        />
                      </div>
                      <div className="w-1/3 flex flex-col gap-2.5 justify-between">
                        <p
                          className={`${outfit.className} font-normal text-base text-black/80`}
                        >
                          Weight (kg) <span className="text-red-500">*</span>
                        </p>
                        <input
                          ref={refs.weight}
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
                          onBlur={(e) => {
                            const value = Number(e.target.value);
                            if (isNaN(value) || value < 2) {
                              setWeight(""); // reset if negative or blank
                              showWarning("Enter valid weight");
                            } else if (value > 635) {
                              setWeight(""); // cap at world's max human weight
                              showWarning("Enter valid weight");
                            }
                          }}
                          min={2}
                          max={635}
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
                  ID PROOF (atleast 1 id proof){" "}
                  <span className="text-red-500">*</span>
                </p>
                {idOptions.map((id) => {
                  const config = idConfig[id] || {};
                  return (
                    <div key={id} className="flex flex-col gap-1">
                      <label
                        className={`${outfit.className} text-base text-black/80`}
                      >
                        {id} Number
                      </label>
                      <input
                        ref={refs.selectedIDs}
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
                        onChange={(e) => {
                          let value = e.target.value.toUpperCase();

                          // Allow only characters that could lead to a valid final ID
                          if (id === "PASSPORT")
                            value = value.replace(/[^A-Z0-9]/gi, "");
                          else if (id === "PAN")
                            value = value.replace(/[^A-Z0-9]/gi, "");
                          else if (id === "AADHAAR" || id === "ABHA")
                            value = value.replace(/[^0-9]/g, "");

                          // Limit to max length
                          value = value.slice(0, config.maxLength);

                          handleInputChange(id, value);
                        }}
                        onBlur={() => handleBlur(id)}
                        maxLength={config.maxLength || undefined}
                      />
                      {idErrors[id] && (
                        <span className="text-red-500 text-sm">
                          {idErrors[id]}
                        </span>
                      )}
                    </div>
                  );
                })}
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
                      Surgery Name
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
                      Surgery Date <span className="text-red-500">*</span>
                    </p>
                    {/* <input
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
                    /> */}

                    <div className="relative w-full">
                      {/* ✏️ Manual text input */}
                      <input
                        ref={refs.surgerydate}
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
                        value={surgerydate}
                        onChange={handleManualSurgeryDateChange}
                        maxLength={10}
                      />

                      {/* 📅 Hidden date picker (covers icon only) */}
                      <input
                        ref={calendarRefsurg}
                        type="date"
                        className="absolute top-0 right-0 opacity-0 cursor-pointer w-8 h-8"
                        onChange={handleCalendarChangesurg}
                        min="1900-01-01"
                      />

                      {/* 📅 Visible calendar icon */}
                      <button
                        type="button"
                        onClick={() => calendarRefsurg.current?.showPicker?.()}
                        className="absolute right-2 top-1.5 text-gray-600 hover:text-black cursor-pointer"
                        title="Pick from calendar"
                      >
                        📅
                      </button>
                    </div>
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
                      Side <span className="text-red-500">*</span>
                    </p>
                    <div className="w-full flex flex-row gap-4 mt-2">
                      <label
                        className={` ${outfit.className} flex items-center gap-2 text-black/80 text-lg cursor-pointer`}
                      >
                        <input
                         ref={refs.leftKnee}
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
                         ref={refs.rightKnee}
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
                      Operation Funding <span className="text-red-500">*</span>
                    </p>
                    <select
                      ref={refs.selectedFunding}
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
