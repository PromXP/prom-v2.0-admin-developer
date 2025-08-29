"use client";

import { useState, useEffect } from "react";
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

import { Raleway, Inter, Poppins } from "next/font/google";
import { Bars3Icon } from "@heroicons/react/24/outline";

import Patdocacc from "@/app/Assets/patdocacc.png";
import Manavatar from "@/app/Assets/man.png";
import Womanavatar from "@/app/Assets/woman.png";
import Reportimg from "@/app/Assets/report.png";
import Notify from "@/app/Assets/notify.png";
import Block from "@/app/Assets/block.png";
import Error from "@/app/Assets/error.png";

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
} from "@heroicons/react/16/solid";
import Patientregistration from "./Patientregistration";
import Doctorregistration from "./Doctorregistration";
import Sendreminder from "./Sendreminder";
import Patientcompliance from "./Patientcompliance";
import Activationstatus from "./Activationstatus";

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

const Patientlist = ({
  isOpenaccpat,
  setIsOpenaccpat,
  isOpenaccdoc,
  setIsOpenaccdoc,
  isOpenreminder,
  setisOpenreminder,
  isOpencompliance,
  setisOpencompliance,
  isActivationstatus,
  setisActivationstatus,
  handlenavigatereport,
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

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedpatuhid, setselectedpatuhid] = useState(null);
  const [selectedpatuhidactivation, setselectedpatuhidactivation] =
    useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        let adminUhid = null;

        if (typeof window !== "undefined") {
          adminUhid = sessionStorage.getItem("admin"); // 👈 safe access
        }

        if (!adminUhid) {
          setError("No admin UHID found in session");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${API_URL}patients-all-by-admin-uhid/${adminUhid}`
        );
        // console.log("✅ API Response:", res.data);

        // setPatients1(res.data.patients || []);

        const apiPatients = res.data.patients || [];

        // 🔄 Map API data → static UI format
        const mapped = apiPatients.map((p, i) => ({
          name: p.Patient?.name || "Unknown",
          age: p.Patient?.birthDate
            ? new Date().getFullYear() -
              new Date(p.Patient.birthDate).getFullYear()
            : "NA",
          gender:
            p.Patient?.gender?.toLowerCase() === "male" ? "Male" : "Female",
          uhid: p.uhid,
          period: p.Patient_Status_Left || "NA", // you can decide logic here
          period_right: p.Patient_Status_Right || "NA",
          status: i % 3 === 0 ? "COMPLETED" : "PENDING", // or derive from API if you want
          left_compliance: p.Medical_Left_Completion ?? 0,
          right_compliance: p.Medical_Right_Completion ?? 0,
          activation_status: p.Activation_Status ?? "True",

          avatar:
            p.Patient?.gender?.toLowerCase() === "male"
              ? Manavatar
              : Womanavatar,
        }));

        console.log("🔄 Mapped Patients:", mapped);
        setPatients(mapped);
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

  const [activeTab, setActiveTab] = useState("Patients");

  const tabs = ["Patients", "Doctors", "Profile"];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullyHidden, setIsFullyHidden] = useState(true); // for hidden toggle

  const handleOpen = () => {
    setIsFullyHidden(false); // show it
    requestAnimationFrame(() => {
      setIsSidebarOpen(true); // trigger transition
    });
  };

  const handleClose = () => {
    setIsSidebarOpen(false); // start slide-out
  };

  const [selectedStatus, setSelectedStatus] = useState("All Patients");

  const [searchTerm, setSearchTerm] = useState("");
  const [completionstatus, setcompletionstatus] = useState("COMPLETED");

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

  // Handlers
  const handleClearAll = () => {
    setSide("left");
    setOperativePeriod("all");
    setSubOperativePeriod("all");
    setCompletionStatus("all");
    setSortOrder("low_to_high");
    setSelectedDate(" ");
  };

  const handleApply = () => {
    // You can do any filtering/apply logic here if needed

    setDropdownOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(patients.length / rowsPerPage);

  // Slice the data
  const paginatedPatients = patients.slice(
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
  const [selectedRole, setSelectedRole] = useState("patient");

  const data = [
    { name: "Patients", count: 51 },
    { name: "Doctors", count: 3 },
  ];

  // const [isOpenacc, setIsOpenacc] = useState(false);

  useEffect(() => {
    if (isOpenaccpat && isOpenaccdoc) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenaccpat, isOpenaccdoc]);

  const [shownotassigned, setshownotassigned] = useState(false);
  const [selecteduhidcompliance, setselecteduhidcompliance] = useState(null);

  function getComplianceColor(value) {
    // value: 0–100
    const green = Math.min(255, Math.floor((value / 100) * 255));
    const red = 255 - green;
    return `rgb(${red}, ${green}, 0)`; // 0–green, red decreases as value increases
  }

  return (
    <>
      <div
        className={`w-full h-[90%] flex rounded-4xl ${
          width >= 1000 ? "flex-row" : "flex-col pb-4"
        }`}
      >
        <div
          className={` ${width >= 1000 ? "w-1/5 pt-8 pb-2 " : "w-full"} ${
            width < 400 ? "min-h-screen" : "h-full"
          }`}
        >
          <div
            className={`w-full h-full  flex  ${
              width >= 1000
                ? "border-gray-300 border-r-2 flex-col justify-end"
                : width >= 400 && width < 1000
                ? "flex-row gap-2"
                : "flex-col justify-center"
            }`}
          >
            {/* <div
              className={`w-full flex flex-col items-center justify-between gap-2 ${
                width >= 1000
                  ? "h-3/5 py-12"
                  : width >= 400 && width < 1000
                  ? "h-full py-2"
                  : "h-1/2 py-4"
              }`}
            >

              <p
                className={`${poppins.className} font-semibold text-2xl text-[#29272A]`}
              >
                Stats
              </p>
              <ResponsiveContainer
                width="90%"
                height="100%"
                className={`${poppins.className} bg-[#319B8F] rounded-3xl p-2`}
                style={{
                  boxShadow: "0 20px 60px rgba(49, 155, 143, 0.4)", // soft teal glow
                }}
              >
                <BarChart
                  data={data}
                  barCategoryGap={40}
                  margin={{ top: 20, right: 0, left: -15, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#fff", fontWeight: 400, fontSize: 12 }}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#fff", fontWeight: 400, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb", // subtle gray border
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // soft shadow
                      padding: "8px 12px",
                      fontSize: "14px",
                      color: "#333",
                    }}
                    itemStyle={{
                      color: "#333",
                      fontWeight: 500,
                      marginBottom: "4px",
                    }}
                    labelStyle={{
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "#1f2937",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#ffffff"
                    radius={[8, 8, 0, 0]}
                    barSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div> */}

            <div
              className={`w-full flex justify-center items-end relative ${
                width >= 1000
                  ? "h-2/5"
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
                >
                  ADD NEW PATIENT
                </p>
                <p
                  onClick={() => {
                    setSelectedRole("doctor");
                    setIsOpenaccpat(false);
                    setIsOpenaccdoc(true);
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
            className={`flex flex-col h-full px-2 pt-4 gap-5 ${
              width >= 1000 ? "w-full" : "w-full"
            }`}
          >
            <p
              className={`${raleway.className} h-[5%] text-[#30263B] font-extrabold text-2xl`}
            >
              DASHBOARD
            </p>

            <div
              className={`w-full flex h-[6%] ${
                width >= 1265 ? "flex-row" : "flex-col gap-4"
              }`}
            >
              <div
                className={` flex flex-row items-center gap-4 pl-4 ${
                  width >= 1265 ? "w-[70%]" : "w-full"
                }`}
              >
                <p
                  className={`${raleway.className} text-[#2B2B2B] font-semibold text-sm w-1/7`}
                >
                  Clear All
                </p>

                <div className="relative w-6/7">
                  <input
                    type="text"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                <div className={`${raleway.className} relative`}>
                  <div
                    className="bg-white rounded-lg p-3 cursor-pointer"
                    onClick={() => setDropdownOpen((prev) => !prev)}
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
                      {/* Side */}
                      <div className="mb-4">
                        <p className="font-semibold mb-1">Side</p>
                        <label className="inline-flex items-center mr-4 cursor-pointer">
                          <input
                            type="radio"
                            className="form-radio"
                            name="side"
                            value="left"
                            checked={side === "left"}
                            onChange={() => setSide("left")}
                          />
                          <span className="ml-2">Left</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            className="form-radio"
                            name="side"
                            value="right"
                            checked={side === "right"}
                            onChange={() => setSide("right")}
                          />
                          <span className="ml-2">Right</span>
                        </label>
                      </div>

                      {/* Operative Period */}
                      <div className="mb-4">
                        <p className="font-semibold mb-1">Operative Period</p>
                        {["all", "pre-op", "post-op"].map((period) => (
                          <div key={period}>
                            <label className="inline-flex items-center mr-4 cursor-pointer">
                              <input
                                type="radio"
                                className="form-radio"
                                name="operativePeriod"
                                value={period}
                                checked={operativePeriod === period}
                                onChange={() => {
                                  setOperativePeriod(period);
                                  if (period !== "post-op") {
                                    setSubOperativePeriod(""); // reset sub-period if switching away
                                  }
                                }}
                              />
                              <span className="ml-2 capitalize">{period}</span>
                            </label>

                            {/* Show sub-options if post-op selected */}
                            {period === "post-op" &&
                              operativePeriod === "post-op" && (
                                <div className="ml-6 mt-2 flex flex-wrap gap-4">
                                  {[
                                    "all",
                                    "6 w",
                                    "3 m",
                                    "6 m",
                                    "1 y",
                                    "2 y",
                                  ].map((sub) => (
                                    <label
                                      key={sub}
                                      className="inline-flex items-center cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        className="form-radio"
                                        name="subOperativePeriod"
                                        value={sub}
                                        checked={subOperativePeriod === sub}
                                        onChange={() =>
                                          setSubOperativePeriod(sub)
                                        }
                                      />
                                      <span className="ml-2 capitalize">
                                        {sub}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>

                      {/* Completion Status */}
                      <div className="mb-4">
                        <p className="font-semibold mb-1">Completion Status</p>
                        {["all", "not_assigned", "pending", "completed"].map(
                          (status) => (
                            <label
                              key={status}
                              className="inline-flex items-center mr-4 cursor-pointer"
                            >
                              <input
                                type="radio"
                                className="form-radio"
                                name="completionStatus"
                                value={status}
                                checked={completionStatus === status}
                                onChange={() => setCompletionStatus(status)}
                              />
                              <span className="ml-2">
                                {status
                                  .replace("_", " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </span>
                            </label>
                          )
                        )}
                      </div>

                      {/* Calendar Date Picker */}
                      <div className="mb-4">
                        <p className="font-semibold mb-1 ">Select Date</p>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        />
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
                            className="inline-flex items-center mr-4 cursor-pointer"
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

                      <div className="flex justify-between mt-4 pt-2 border-t border-gray-300">
                        <button
                          onClick={handleClearAll}
                          className="text-sm font-semibold text-red-600 cursor-pointer"
                        >
                          Reset
                        </button>
                        <button
                          onClick={handleApply}
                          className="text-sm font-semibold text-blue-600 cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* <div
                          className={` flex flex-row items-center gap-4 ${
                            width >= 1265
                              ? "w-[30%] justify-end"
                              : "w-full justify-center"
                          }`}
                        >
                          {["COMPLETED", "PENDING"].map((status) => (
                            <p
                              key={status}
                              onClick={() => setcompletionstatus(status)}
                              className={`
                                ${raleway.className}
                                font-semibold text-xs px-3 py-1 flex items-center rounded-2xl cursor-pointer transition
                                ${
                                  completionstatus === status
                                    ? "bg-[#319B8F] text-white"
                                    : "bg-gray-300 text-gray-700"
                                }
                              `}
                            >
                              {status}
                            </p>
                          ))}
                        </div> */}
            </div>

            <div
              className={`w-full flex flex-col gap-2 ${
                width >= 1000 ? "h-[89%]" : "h-[98%] pb-4"
              }`}
            >
              <div
                className={`${poppins.className} h-[5%] flex flex-row items-center justify-end gap-4 px-4 text-[13px] font-medium text-gray-600`}
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
                >
                  {generatePageOptions(patients.length).map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
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
                className={`w-full h-[95%] flex-1 px-4 pt-2 pb-6 gap-6 inline-scroll ${
                  width >= 1000 ? "overflow-y-auto" : ""
                }`}
              >
                {paginatedPatients.map((patient, index) => (
                  <div
                    key={index}
                    className={`w-full rounded-lg flex  px-3 bg-white ${
                      width < 530
                        ? "flex-col justify-center items-center gap-2 py-3"
                        : "flex-row justify-between items-center py-1.5"
                    } ${width < 1000 ? "mb-2" : "mb-6"}`}
                  >
                    {/* LEFT - Avatar + Name + Age */}
                    <div
                      className={`${
                        width < 640 && width >= 530
                          ? "w-3/5"
                          : width < 530
                          ? "w-full"
                          : "w-[30%]"
                      } 
                      ${
                        !patient.activation_status
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                      `}
                    >
                      <div
                        className={`flex gap-4 py-0 items-center ${
                          width < 710 && width >= 640
                            ? "px-0 flex-row"
                            : width < 530
                            ? "flex-col justify-center items-center"
                            : "px-2 flex-row"
                        }`}
                      >
                        <Image
                          src={patient.avatar}
                          alt="Avatar"
                          width={40}
                          height={40}
                          className={`rounded-full cursor-pointer ${
                            width < 530 ? "w-11 h-11" : "w-10 h-10"
                          }`}
                        />
                        <div
                          className={`w-full flex items-center ${
                            width < 710 ? "flex-col" : "flex-row"
                          }`}
                        >
                          <div
                            className={`flex flex-col ${
                              width < 710 ? "w-full gap-2" : "w-[70%] gap-4"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p
                                className={`${
                                  raleway.className
                                } text-[#475467] font-semibold text-lg ${
                                  width < 530 ? "w-full text-center" : ""
                                }`}
                              >
                                {patient.name}
                              </p>
                            </div>
                            <p
                              className={`${
                                poppins.className
                              } font-normal text-sm text-[#475467] ${
                                width < 530 ? "text-center" : "text-start"
                              }`}
                            >
                              {patient.age}, {patient.gender}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT - UHID + Period + Status + Report Icon */}
                    <div
                      className={`flex items-center ${
                        width < 640 && width >= 530
                          ? "w-2/5 flex-col text-center gap-4"
                          : width < 530
                          ? "w-full flex-col text-center gap-4"
                          : "w-[70%] flex-row justify-between"
                      }`}
                    >
                      <div
                        className={`${
                          poppins.className
                        } text-base font-medium text-[#475467] ${
                          width < 710
                            ? "w-full text-center"
                            : "w-1/4 text-center"
                        }
                        ${
                        !patient.activation_status
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      >
                        {patient.uhid}
                      </div>

                      <div
                        className={`${
                          inter.className
                        } text-[15px] font-semibold text-[#373737] ${
                          width < 750
                            ? "w-3/4 text-center"
                            : "w-1/4 text-center"
                        }
                        ${
                        !patient.activation_status
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      >
                        {patient.period}
                      </div>

                      <div
                        className={`flex flex-col items-center justify-center ${
                          width < 750
                            ? "w-3/4 text-center"
                            : "w-1/4 text-center"
                        }
                        ${
                        !patient.activation_status
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      >
                        {patient.left_compliance === "NA" ? (
                          <div className="w-full flex flex-col items-end relative group">
                            <div className={`${poppins.className} absolute -top-5 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out text-sm font-semibold text-black`}>
                              No questionnaires assigned
                            </div>
                            <Image
                              src={Error}
                              alt="Not assigned"
                              className={`w-6 h-6`}
                            />
                            <div className="relative w-full h-1.5 overflow-hidden bg-white cursor-pointer">
                              {/* Filled Progress */}
                              <div
                                className="h-full bg-[#E5E5E5]"
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
                          <div className="w-full flex flex-col items-center relative group">
                            {/* Hover Percentage Text */}
                            <div className={`${poppins.className} absolute -top-7 left-0 transform translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out text-sm font-semibold text-black border-2 border-black px-3 rounded-lg`}>
                              {patient.left_compliance || 0}%
                            </div>

                            {/* Progress Bar Container */}
                            <div
                              className={`relative w-full h-1.5 overflow-hidden bg-[#E5E5E5] cursor-pointer `}
                              onClick={() => {
                                setisOpencompliance(true);
                                setselecteduhidcompliance(patient.uhid);
                              }}
                            >
                              {/* Filled Progress */}
                              <div
                                className="h-full"
                                style={{
                                  width: `${patient.left_compliance || 0}%`,
                                  backgroundColor: getComplianceColor(
                                    patient.left_compliance||0
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

                      <div
                        className={` flex flex-row gap-4 ${
                          width < 750 ? "w-3/4 text-center" : "w-1/4"
                        }
                        ${
                        !patient.activation_status
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      >
                        <div
                          className={`${
                            width < 750 ? "w-full text-center" : "w-full"
                          } ${
                              patient.left_compliance === "NA"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                        >
                          <Image
                            src={Notify}
                            alt="Message"
                            className={`w-6 h-6 mx-auto ${
                              patient.left_compliance === "NA" || !patient.activation_status
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                            onClick={() => {
                              if (patient.left_compliance === "NA" || !patient.activation_status) return; // 🔒 block click
                              setisOpenreminder(true);
                              setselectedpatuhid(patient.uhid);
                            }}
                          />
                        </div>
                      </div>

                      <div
                        className={`flex flex-row gap-4 items-center ${
                          width < 750 ? "w-3/4 text-center" : "w-1/4"
                        }`}
                      >
                        <div
                          className={`${
                            width < 750 ? "w-1/2 text-center" : "w-1/2"
                          }
                          ${
                        !patient.activation_status
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                        >
                          <Image
                            src={Reportimg}
                            className={`w-8 h-8 mx-auto cursor-pointer`}
                            alt="Report"
                            onClick={handlenavigatereport}
                          />
                        </div>

                        <div
                          className={` h-full ${
                            width < 750 ? "w-1/2 text-center" : "w-1/2"
                          }`}
                        >
                          <Image
                            src={Block}
                            alt="Block"
                            className={`w-6 h-6 mx-auto cursor-pointer`}
                            onClick={() => {
                              setisActivationstatus(true);
                              setselectedpatuhidactivation(patient.uhid);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {width >= 1000 && <div className="w-[2%]"></div>}
      </div>

      <Patientregistration
        isOpenacc={isOpenaccpat}
        onCloseacc={() => setIsOpenaccpat(false)}
      />

      <Doctorregistration
        isOpenacc={isOpenaccdoc}
        onCloseacc={() => setIsOpenaccdoc(false)}
      />

      <Sendreminder
        isOpenreminder={isOpenreminder}
        onClosereminder={() => setisOpenreminder(false)}
        selecteduhid={selectedpatuhid}
      />

      <Patientcompliance
        isOpencompliance={isOpencompliance}
        setisOpencompliance={() => setisOpencompliance(false)}
        selecteduhidcompliance={selecteduhidcompliance}
      />

      <Activationstatus
        isActivationstatus={isActivationstatus}
        setisActivationstatus={setisActivationstatus}
        selectedpatuhidactivation={selectedpatuhidactivation}
      />

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
    </>
  );
};

export default Patientlist;
