"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";

import axios from "axios";
import { API_URL } from "../libs/global";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Raleway, Inter, Poppins, Outfit } from "next/font/google";
import { Bars3Icon } from "@heroicons/react/24/outline";

import MainBg from "@/app/Assets/mainbg.png";
import MainsubBg from "@/app/Assets/mainsubbg.png";
import Logo from "@/app/Assets/logo.png";
import Headset from "@/app/Assets/headset.png";
import Patdocacc from "@/app/Assets/patdocacc.png";
import Manavatar from "@/app/Assets/man.png";
import Womanavatar from "@/app/Assets/woman.png";
import Reportimg from "@/app/Assets/report.png";
import Notify from "@/app/Assets/notify.png";
import Call from "@/app/Assets/call.png";
import Error from "@/app/Assets/error.png";
import CloseIcon from "@/app/Assets/closeiconwindow.png";
import ExpandIcon from "@/app/Assets/expand.png";
import ShrinkIcon from "@/app/Assets/shrink.png";
import Doctorassign from "@/app/Assets/doctorassign.png";

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
  StarIcon,
} from "@heroicons/react/16/solid";
import Patientregistration from "./Patientregistration";
import Doctorregistration from "./Doctorregistration";

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

const Doctorlist = ({
  isOpenaccpat,
  setIsOpenaccpat,
  isOpenaccdoc,
  setIsOpenaccdoc,
}) => {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [completionstatus, setcompletionstatus] = useState("COMPLETED");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${API_URL}get_doctor_page`);

        const doctors = res.data.total_doctors || [];
        const doctorPatients = doctors.map((doc, i) => ({
          name: doc.name.replace(/^Dr\.?\s*/i, ""),
          age: doc.birth_date
            ? new Date().getFullYear() - new Date(doc.birth_date).getFullYear()
            : "NA",
          gender: doc.gender === "male" ? "Male" : "Female",
          uhid: doc.uhid,
          compliance: doc.overall_compliance,
          count: doc.total_patients,
          avatar:
            doc?.photo && doc?.photo !== "NA"
              ? doc?.photo
              : doc.gender === "male"
              ? Doctorassign
              : Doctorassign,
        }));
        // console.log(doctorPatients);
        setPatients(doctorPatients);
      } catch (err) {
        // console.error("❌ Error fetching patients:", err);
        if (err.response) {
          setError(err.response.data.detail || "Failed to fetch patients");
        } else {
          setError("Network error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // State for dropdown radios
  const [side, setSide] = useState("left");
  const [operativePeriod, setOperativePeriod] = useState("all");
  const [subOperativePeriod, setSubOperativePeriod] = useState("all");
  const [completionStatus, setCompletionStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format: yyyy-mm-dd
  });
  const [sortOrder, setSortOrder] = useState("low_to_high");
  const [selectedGender, setSelectedGender] = useState("All");
  const [ageRange, setAgeRange] = useState({ min: 23, max: 80 });

  // Handlers
  const handleClearAll = () => {
    setSelectedGender("All");
    setSortOrder("low_to_high");
    setAgeRange({ min: 23, max: 80 });
    setSearchTerm("");
  };

  const handleApply = () => {
    // You can do any filtering/apply logic here if needed

    setDropdownOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const filteredAndSortedPatients = useMemo(() => {
    return (
      [...patients]
        // 1️⃣ Filter by gender
        .filter((p) => {
          if (selectedGender === "All") return true;
          if (!selectedGender) return true; // no filter
          return p.gender === selectedGender;
        })
        // 2️⃣ Filter by age
        .filter((p) => {
          const age = Number(p.age);
          if (ageRange.min && age < ageRange.min) return false;
          if (ageRange.max && age > ageRange.max) return false;
          return true;
        })
        // 3️⃣ Sort by compliance
        .sort((a, b) => {
          const aComp = a.compliance === "NA" ? -1 : Number(a.compliance);
          const bComp = b.compliance === "NA" ? -1 : Number(b.compliance);

          if (sortOrder === "low_to_high") return aComp - bComp;
          return bComp - aComp;
        })
    );
  }, [patients, sortOrder, selectedGender, ageRange]);

  const displayedPatients = searchTerm
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.uhid.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredAndSortedPatients;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filteredAndSortedPatients.length]);

  // Optional: adjust rowsPerPage if it exceeds array length
  useEffect(() => {
    if (rowsPerPage > displayedPatients.length) {
      setRowsPerPage(Math.max(50, displayedPatients.length));
    }
  }, [displayedPatients.length]);

  const totalPages = Math.ceil(displayedPatients.length / rowsPerPage);
  // Slice the data
  const paginatedPatients = displayedPatients.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const generatePageOptions = (total) => {
    const options = [];
    const commonSteps = [5, 10, 25, 50];

    for (let step of commonSteps) {
      if (step < total) {
        options.push(step);
      }
    }

    if (!options.includes(total)) {
      options.push(total); // Add total as last option
    }

    return options;
  };

  const [selectedRole, setSelectedRole] = useState("");

  const data = [
    { name: "Patients", count: 51 },
    { name: "Doctors", count: 3 },
  ];

  const [shownotassigned, setshownotassigned] = useState(false);

  function getComplianceColor(value) {
    // value: 0–100
    const green = Math.min(255, Math.floor((value / 100) * 255));
    const red = 255 - green;
    return `rgb(${red}, ${green}, 0)`; // 0–green, red decreases as value increases
  }

  const dropdownRef = useRef(null);
  const [reloadreq, setReloadreq] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showimgupload, setimgupload] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && e.target.files) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));

      setimgupload(true);
    }
  };

  const resetImage = () => {
    setProfileImage(null);
    setPreviewUrl(null);

    // Optionally clear the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setimgupload(false);
  };

  const handleUpload = async ({ uhid1, type1 }) => {
    if (!profileImage) {
      setError("Please select or capture an image.");
      return;
    }

    const formData = new FormData();
    formData.append("uhid", uhid1);
    formData.append("usertype", type1); // <-- Make sure userType is defined
    formData.append("profile_image", profileImage);

    try {
      const res = await axios.post(`${API_URL}upload-profile-photo`, formData);

      // console.log("Profile upload success:", res.data);
      showWarning("Image Upload Successfull");
      setReloadreq(true);
      setimgupload(false);
    } catch (err) {
      console.error("Profile upload failed:", err);
      showWarning("Image Upload failed");
      setimgupload(true);
    }
  };

  const isBlobUrl = previewUrl && previewUrl.startsWith("blob:");

  const fileInputRef = useRef(null); // To programmatically trigger the file input

  const [showprof, setshowprof] = useState(false);
  const [profpat, setshowprofpat] = useState([]);
  const [expand, setexpand] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showWarning = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const messages = [
    "Fetching doctors from the database...",
    "Almost there, compiling progress...",
    "Optimizing profiles...",
    "Hang tight! Just a moment...",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isDefaultFilter =
    sortOrder === "low_to_high" &&
    selectedGender === "All" &&
    ageRange.min === 23 &&
    ageRange.max === 80;

  const [doctor, setdoctor] = useState({});

  const fetchdoctor = async ({ uhid }) => {
    try {
      const res = await axios.get(`${API_URL}getdoctor/${uhid}`);
      showWarning("Doctor fetched");

      const apiPatients = res.data || {};
      setdoctor(apiPatients);
    } catch (error) {
      showWarning("Failed to fetch doctor");
    }
  };

  return (
    <>
      <div
        className={`w-full h-[90%] flex rounded-4xl ${
          width >= 1000 ? "flex-row" : "flex-col pb-4"
        }`}
      >
        <div
          className={`flex flex-col ${
            width >= 1000 ? "w-1/5 pt-8 pb-4 " : "w-full pt-8"
          } ${width < 400 ? "min-h-screen" : "h-full"}`}
        >
          <div
            className={`  ${
              width >= 700
                ? "w-full justify-center items-center"
                : "w-full items-center justify-center"
            } flex flex-row gap-6 `}
          >
            <div className="w-fit flex flex-row items-center justify-center gap-3">
              <p
                className={`${raleway.className} font-bold text-2xl text-[#2B2B2B]`}
              >
                DOCTORS
              </p>
              <p
                className={`${inter.className} font-bold text-4xl text-white py-1.5 px-4 bg-[#2A343D] rounded-[10px]`}
              >
                {patients.length ?? "NA"}
              </p>
            </div>
          </div>

          <div
            className={`w-full h-full  flex  ${
              width >= 1000
                ? "border-gray-300 border-r-2 flex-col justify-end"
                : width >= 400 && width < 1000
                ? "flex-row gap-2"
                : "flex-col justify-center"
            }`}
          >
            <div
              className={`w-full flex justify-center items-end relative ${
                width >= 1000
                  ? "h-4/9"
                  : width >= 400 && width < 1000
                  ? "h-full"
                  : "h-1/2"
              }`}
            >
              <Image
                src={Patdocacc}
                className={`h-full object-fit ${
                  width >= 1500
                    ? "w-3/5"
                    : width < 1500 && width >= 400
                    ? "w-full px-2"
                    : "w-3/5"
                }`}
                alt="Account creation"
              />

              <div className="absolute flex flex-col items-center justify-between h-3/5 px-1 py-2.5 gap-8">
                <p
                  onClick={() => {
                    setSelectedRole("patient");
                    setIsOpenaccdoc(false);
                    setIsOpenaccpat(true);
                  }}
                  className={`
                                ${inter.className}
                                px-3 py-3 text-[15px] font-semibold rounded-xl cursor-pointer transition
                                ${
                                  selectedRole === "patient"
                                    ? "bg-[#3867D8] text-white"
                                    : "bg-white text-black"
                                }
                              `}
                  title="Click for new patient registration"
                >
                  ADD NEW PATIENT
                </p>
                <p
                  onClick={() => {
                    setSelectedRole("doctor");
                    setIsOpenaccdoc(true);
                    setIsOpenaccpat(false);
                  }}
                  className={`
                                ${inter.className}
                                px-3 py-3 text-[15px] font-semibold rounded-xl cursor-pointer transition
                                ${
                                  selectedRole === "doctor"
                                    ? "bg-[#3867D8] text-white"
                                    : "bg-white text-black"
                                }
                              `}
                  title="Click for new doctor registration"
                >
                  ADD NEW DOCTOR
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={` h-full flex rounded-4xl ${
            width >= 1000 ? "flex-row w-4/5" : "flex-col w-full pt-4"
          }`}
        >
          <div
            className={`flex flex-col h-full px-2 pt-12 pb-12 gap-5  ${
              width >= 1000 ? "w-full" : "w-full"
            }`}
          >
            <p
              className={`${raleway.className} h-[5%] text-[#30263B] font-extrabold text-2xl`}
            >
              DASHBOARD
            </p>

            <div
              className={`w-full flex h-[6%] py-4 ${
                width >= 1265 ? "flex-row" : "flex-col gap-4"
              }`}
            >
              <div
                className={` flex flex-row items-center gap-4 pl-4 ${
                  width >= 1265 ? "w-[70%]" : "w-full"
                }`}
              >
                <p
                  className={`
                    ${raleway.className}
                    text-teal-600
                    font-semibold
                    text-sm
                    w-1/7
                    cursor-pointer
                    underline
                    hover:scale-110
                    transition
                  `}
                  onClick={handleClearAll}
                  title="Click to clear the filter and search"
                >
                  Clear All
                </p>

                <div className="relative w-6/7">
                  <input
                    type="text"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      // allow only letters, numbers, and spaces
                      const filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
                      setSearchTerm(filteredValue);
                    }}
                    className="text-black w-full pl-10 pr-4 py-1 border-2 border-gray-300 rounded-lg"
                  />
                  <svg
                    className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                    />
                  </svg>
                </div>

                {/* Dropdown SVG Button */}
                <div
                  ref={dropdownRef}
                  className={` ${raleway.className} relative`}
                >
                  <div
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-300 ${
                      isDefaultFilter
                        ? "bg-white border border-gray-200"
                        : "bg-teal-100 border-2 border-teal-500 shadow-md"
                    }`}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    title="Click to sort"
                  >
                    <svg
                      width="12"
                      height="14"
                      viewBox="0 0 12 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.79 1.61564C12.3029 0.959102 11.8351 0 11.002 0H1.00186C0.168707 0 -0.299092 0.959101 0.213831 1.61564L5.03983 7.72867C5.1772 7.90449 5.25181 8.1212 5.25181 8.34432V13.7961C5.25181 13.9743 5.46724 14.0635 5.59323 13.9375L6.60536 12.9254C6.69913 12.8316 6.75181 12.7044 6.75181 12.5718V8.34432C6.75181 8.1212 6.82643 7.90449 6.96379 7.72867L11.79 1.61564Z"
                        fill="#464F60"
                      />
                    </svg>
                  </div>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 max-h-[500px] overflow-y-auto mt-2 w-56 bg-white border rounded shadow-md z-10 p-4 text-base text-gray-700"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#888 transparent", // Firefox
                      }}
                    >
                      {/* Gender Filter */}
                      <div className="mb-4">
                        <p className="font-semibold mb-1">Gender</p>
                        {["All", "Male", "Female", "Other"].map((gender) => (
                          <label
                            key={gender}
                            className={`inline-flex items-center mr-4 cursor-pointer ${
                              selectedGender === gender
                                ? "font-bold text-lg"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              className="form-radio"
                              name="gender"
                              value={gender}
                              checked={selectedGender === gender}
                              onChange={() => setSelectedGender(gender)}
                            />
                            <span className="ml-2">{gender}</span>
                          </label>
                        ))}
                      </div>

                      {/* Age Filter */}
                      <div className="mb-4">
                        <p className="font-semibold mb-1">Age</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            className={`w-16 border px-2 py-1 rounded text-sm ${
                              ageRange.min > 23 ? "font-bold" : ""
                            }`}
                            value={ageRange.min}
                            onChange={(e) => {
                              // Remove decimals by parsing integer
                              const intValue = e.target.value
                                ? parseInt(e.target.value, 10)
                                : "";
                              setAgeRange({ ...ageRange, min: intValue });
                            }}
                            min={23}
                            max={80}
                          />
                          <span>-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            className={`w-16 border px-2 py-1 rounded text-sm ${
                              ageRange.max < 80 ? "font-bold" : ""
                            }`}
                            value={ageRange.max}
                            onChange={(e) => {
                              // Remove decimals by parsing integer
                              const intValue = e.target.value
                                ? parseInt(e.target.value, 10)
                                : "";
                              setAgeRange({ ...ageRange, max: intValue });
                            }}
                            min={23}
                            max={80}
                          />
                        </div>
                      </div>

                      {/* Sort */}
                      <div>
                        <p className="font-semibold mb-1">Sort</p>
                        {[
                          { label: "Low to High", value: "low_to_high" },
                          { label: "High to Low", value: "high_to_low" },
                        ].map(({ label, value }) => (
                          <label
                            key={value}
                            className={`inline-flex items-center mr-4 cursor-pointer ${
                              sortOrder === value ? "font-bold text-lg" : ""
                            }`}
                            title="Sort based on overall patients compliance rate"
                          >
                            <input
                              type="radio"
                              className="form-radio"
                              name="sortOrder"
                              value={value}
                              checked={sortOrder === value}
                              onChange={() => setSortOrder(value)}
                            />
                            <span className="ml-2">{label}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex justify-center mt-4 pt-2 border-t border-gray-300">
                        <button
                          onClick={handleClearAll}
                          className="text-sm font-semibold text-red-600 cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`w-full flex flex-col gap-2 ${
                width >= 1000 ? "h-[89%]" : "h-[98%] pb-4"
              }`}
            >
              <div
                className={`${
                  poppins.className
                } h-[5%] flex flex-row items-center justify-end gap-4 ${
                  width > 1000 ? "py-4" : "py-10"
                } px-4 text-[13px] font-medium text-gray-600`}
              >
                {/* Rows per page */}
                <span>Records per page:</span>
                <select
                  className="bg-transparent outline-none text-gray-700 font-semibold cursor-pointer"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page
                  }}
                  title="Click to select no of records to be displayed"
                >
                  {generatePageOptions(displayedPatients.length).map(
                    (count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    )
                  )}
                </select>

                {/* Pagination controls */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  {/* Previous */}
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow border cursor-pointer"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    title="Move to previous page"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* Page Info */}
                  <span className="text-gray-700 text-[13px]">
                    <span className="text-black">{currentPage}</span>/
                    <span>{totalPages}</span>
                  </span>

                  {/* Next */}
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow border cursor-pointer"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    title="Move to next page"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                className={`w-full h-[95%] flex-1 px-4 pt-2 inline-scroll ${
                  width >= 1000 ? "overflow-y-auto" : "overflow-y-auto"
                }`}
                style={{
                  display: "grid",
                  gridTemplateColumns: loading
                    ? "repeat(auto-fit, minmax(220px, 1fr))"
                    : "repeat(auto-fit, 290px)",
                  justifyContent: width > 620 ? "start" : "center", // align cards to left if fewer
                  gap: "1.5rem",
                }}
              >
                {loading ? (
                  <div className="flex  space-x-2 w-full justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span
                      className={`${poppins.className} text-black font-semibold`}
                    >
                      {messages[index]}
                    </span>
                  </div>
                ) : (
                  paginatedPatients.map((patient, index) => (
                    <div
                      key={index}
                      className="w-full h-[230px]  bg-white p-2 flex flex-col justify-between gap-2 rounded-xl"
                      style={{ minWidth: 0 }} // prevent overflow
                    >
                      {/* LEFT - Avatar + Name + Age */}
                      <div className="flex flex-col items-center gap-2 w-full h-full ">
                        <div className={`w-full h-3/5 relative`}>
                          <Image
                          src={patient.avatar}
                          alt="Avatar"
                          className=" cursor-pointer w-full h-full rounded-xl"
                          width={40}
                          height={20}
                          onClick={() => {
                            if (!patient?.uhid) {
                              showWarning("UHID not found");
                              return;
                            }
                            setshowprof(true);
                            fetchdoctor({ uhid: patient.uhid });
                          }}
                          title="Doctor profile"
                        />
                                              {/* RIGHT - UHID + Period + Status + Icons */}
                      <div
                        className={`flex flex-col justify-center items-center absolute top-2 right-3 rounded-sm px-2 py-1 ${patient.compliance === "NA"?"bg-blue-500":""}`}
                        style={{backgroundColor: getComplianceColor(
                                        patient.compliance || 0
                                      )}}
                      >
                        <p
                          className={`${poppins.className} text-xs font-medium text-white`}
                        >
                          {patient.uhid}
                        </p>
                      </div>

                        </div>
                        
                        <div className="w-full flex flex-row justify-between h-2/5 gap-2">
                          <div className="flex flex-col gap-2 w-5/9">
                            <p
                              className={`${raleway.className} text-blue-500 font-semibold text-base`}
                            >
                              Dr. {patient.name}
                            </p>
                            <p
                              className={`${poppins.className} font-normal text-sm space-x-2 text-white`}
                            >
                              <span className="bg-blue-500 px-2 py-1 rounded-full">
                                Age: {patient.age}
                              </span>
                              <span className="bg-blue-500 rounded-full px-2 py-1">
                                {" "}
                                {patient.gender}
                              </span>
                            </p>
                          </div>
                          <div
                            className={`flex flex-col w-3/9 h-2/3 items-end justify-between gap-2`}
                          >
                            <div
                              className={`${inter.className} space-x-2 font-semibold text-[#373737] text-xs w-full flex items-center flex-row justify-between`}
                            >
                              {patient.compliance === "NA" ? (
                                <Image
                                  src={Error}
                                  alt="Not assigned"
                                  className="w-5 h-5"
                                  title="No Patient's assigned"
                                />
                              ) : (
                                <StarIcon className="w-5 h-5" style={{ color: getComplianceColor(
                                        patient.compliance || 0
                                      )}} />
                              )}
                              <span>{patient.count} Patients</span>
                            </div>

                            {/* Progress Bar with Hover */}
                            {patient.compliance === "NA" ? (
                              <div
                                className="w-full flex flex-col items-end relative group"
                                title="Overall patient's compliance"
                              >

                                <div className="relative w-full h-1.5 overflow-hidden bg-white ">
                                  {/* Filled Progress */}
                                  <div
                                    className="h-3/4 bg-[#E5E5E5]"
                                    style={{
                                      width: "100%",
                                      backgroundImage: "url('/stripes.svg')",
                                      backgroundRepeat: "repeat",
                                      backgroundSize: "20px 20px",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="w-full flex flex-col items-center relative group "
                                title="Overall patient's compliance"
                              >
                                {/* Hover Percentage Text */}
                                <div className="absolute -top-6 left-0 transform  opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out text-xs font-semibold text-black border-2 border-black px-3 rounded-lg">
                                  {patient.compliance || 0}%
                                </div>

                                {/* Progress Bar Container */}
                                <div className="relative w-full h-1.5 overflow-hidden bg-[#E5E5E5] cursor-pointer">
                                  {/* Filled Progress */}
                                  <div
                                    className="h-full bg-[#EEDF11]"
                                    style={{
                                      width: `${patient.compliance || 0}%`,
                                      backgroundColor: getComplianceColor(
                                        patient.compliance || 0
                                      ),
                                      backgroundImage: "url('/stripes.svg')",
                                      backgroundRepeat: "repeat",
                                      backgroundSize: "20px 20px",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {width >= 1000 && <div className="w-[2%]"></div>}
      </div>

      {showprof &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-40 "
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)", // white with 50% opacity
            }}
          >
            <div
              className={`
                    h-screen  flex flex-col items-center justify-center mx-auto my-auto
                    ${width < 950 ? "gap-4 w-full" : "w-5/6"}
                    ${expand ? "w-full" : "p-4"}
                  `}
            >
              <div
                className={`w-full bg-[#FCFCFC]  p-4  overflow-y-auto overflow-x-hidden inline-scroll ${
                  width < 1095 ? "flex flex-col gap-4" : ""
                } ${expand ? "h-full" : "max-h-[92vh] rounded-2xl"}`}
              >
                <div
                  className={`w-full bg-[#FCFCFC]  ${
                    width < 760 ? "h-fit" : "h-full"
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
                        Doctor Profile
                      </p>
                      <div
                        className={`flex flex-row gap-4 items-center justify-center`}
                      >
                        {/* {expand ? (
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
                        )} */}

                        <XCircleIcon
                          className="w-fit h-7 text-red-600  cursor-pointer"
                          onClick={() => {
                            setshowprof(false);
                            setdoctor({});
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
                            NAME
                          </p>
                          <p
                            className={`w-full text-black
                                  font-medium
                                  text-lg
                                  ${inter.className}`}
                          >
                            {doctor?.name}
                          </p>
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
                          UEID
                        </p>
                        <p
                          className={`w-full text-black
                                  font-medium
                                  text-lg
                                  ${inter.className}`}
                        >
                          {doctor?.uhid}
                        </p>
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
                          {/* Gender Dropdown */}
                          <div
                            className={`flex flex-col gap-2 ${
                              width < 700 ? "w-full" : "w-1/3"
                            }`}
                          >
                            <p
                              className={`${outfit.className} font-normal text-base text-black/80`}
                            >
                              GENDER
                            </p>
                            <p
                              className={`w-full text-black
                                  font-medium
                                  text-lg
                                  capitalize
                                  ${inter.className}`}
                            >
                              {doctor?.gender}
                            </p>
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
                              DATE OF BIRTH
                            </p>
                            <p
                              className={`w-full text-black
                                  font-medium
                                  text-lg
                                  ${inter.className}`}
                            >
                              {doctor?.birth_date}
                            </p>
                          </div>

                          <div
                            className={`flex flex-col gap-2.5 ${
                              width < 700 ? "w-full" : "w-1/3"
                            }`}
                          >
                            <p
                              className={`${outfit.className} font-normal text-base text-black/80`}
                            >
                              BLOOD GROUP
                            </p>
                            <p
                              className={`w-full text-black
                                  font-medium
                                  text-lg
                                  ${inter.className}`}
                            >
                              {doctor?.blood_group}
                            </p>
                          </div>
                        </div>

                        <div className={`w-full flex flex-col gap-2`}>
                          <p
                            className={`${outfit.className} font-normal text-base text-black/80`}
                          >
                            EMAIL
                          </p>

                          <span className="text-black/90">
                            {doctor?.email || "NA"}
                          </span>
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
                            className={`flex flex-col justify-between gap-2  ${
                              width < 700 ? "w-full" : "w-4/7"
                            }`}
                          >
                            <div className={`flex flex-col gap-2 w-full`}>
                              <p
                                className={`${outfit.className} font-normal text-base text-black/80`}
                              >
                                Council Number
                              </p>

                              <span className="text-black/90">
                                {doctor?.council_number || "Not provided"}
                              </span>
                            </div>

                            <div className={`w-full flex flex-col gap-2`}>
                              <p
                                className={`${outfit.className} font-normal text-base text-black/80`}
                              >
                                PHONE NUMBER
                              </p>

                              <span className="text-black/90">
                                {doctor?.phone || "NA"}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`flex flex-col items-center gap-2 ${
                              width < 700 ? "w-full" : "w-4/7"
                            }`}
                          >
                            <div
                              className="w-40 h-40 cursor-pointer"
                              onClick={() => fileInputRef.current.click()}
                              style={{ position: "relative" }}
                              title="Edit Profile Picture"
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
                                  src={
                                    doctor?.photo_url &&
                                    doctor?.photo_url !== "NA"
                                      ? doctor?.photo_url
                                      : doctor?.gender === "male"
                                      ? Manavatar
                                      : Womanavatar
                                  }
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
                            <div>
                              {showimgupload && (
                                <div
                                  className={` ${raleway.className} w-full flex flex-row justify-center items-center gap-8`}
                                >
                                  <div className="w-1/2 flex flex-row justify-start items-center">
                                    <p
                                      className="font-semibold italic text-black text-md cursor-pointer"
                                      onClick={resetImage}
                                    >
                                      RESET
                                    </p>
                                  </div>
                                  <div className="w-1/2 flex flex-row justify-end items-center">
                                    <p
                                      className=" cursor-pointer text-center text-black text-md font-semibold "
                                      onClick={() => {
                                        handleUpload({
                                          uhid1: profpat.uhid,
                                          type1: "doctor",
                                        });
                                      }}
                                    >
                                      UPLOAD
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex gap-12 ${
                        width >= 1200 ? "flex-row" : "flex-col"
                      }`}
                    >
                      <div className={`w-full flex flex-col gap-2`}>
                        <p
                          className={`${outfit.className} font-normal text-base text-black/80`}
                        >
                          SPECIALIZATION
                        </p>

                        <span className="text-black/90">
                          {doctor?.specialization || "NA"}
                        </span>
                      </div>
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
          document.body // portal target
        )}

      <Patientregistration
        isOpenacc={isOpenaccpat}
        onCloseacc={() => {
          setIsOpenaccpat(false);
          setSelectedRole("");
        }}
      />

      <Doctorregistration
        isOpenacc={isOpenaccdoc}
        onCloseacc={() => {
          setIsOpenaccdoc(false);
          setSelectedRole("");
        }}
      />
    </>
  );
};

export default Doctorlist;
