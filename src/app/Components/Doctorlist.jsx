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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${API_URL}get_admin_doctor_page`);

        const doctors = res.data.total_doctors || [];
        const doctorPatients = doctors.map((doc, i) => ({
          name: doc.name,
          age: doc.birth_date
            ? new Date().getFullYear() - new Date(doc.birth_date).getFullYear()
            : "NA",
          gender: doc.gender === "male" ? "Male" : "Female",
          uhid: doc.uhid,
          compliance: doc.overall_compliance,
          count: doc.total_patients,
          avatar: doc.gender === "male" ? Manavatar : Womanavatar,
        }));
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

  const [shownotassigned, setshownotassigned] = useState(false);

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
            className={`flex flex-col h-full px-2 pt-4 pb-12 gap-5  ${
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
                className={`w-full h-[95%] flex-1 px-4 pt-2 inline-scroll ${
                  width >= 1000 ? "overflow-y-scroll" : "overflow-y-auto"
                }`}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    width >= 1000
                      ? "repeat(auto-fit, minmax(200px, 1fr))"
                      : "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {paginatedPatients.map((patient, index) => (
                  <div
                    key={index}
                    className="w-full h-[200px]  bg-white p-4 flex flex-col justify-between gap-2 rounded-md"
                    style={{ minWidth: 0 }} // prevent overflow
                  >
                    {/* LEFT - Avatar + Name + Age */}
                    <div className="flex items-center gap-4">
                      <Image
                        src={patient.avatar}
                        alt="Avatar"
                        className="rounded-full cursor-pointer w-12 h-12"
                      />
                      <div className="flex flex-col gap-3">
                        <p
                          className={`${raleway.className} text-[#475467] font-semibold text-lg`}
                        >
                          {patient.name}
                        </p>
                        <p
                          className={`${poppins.className} font-normal text-sm text-[#475467]`}
                        >
                          {patient.age}, {patient.gender}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT - UHID + Period + Status + Icons */}
                    <div
                      className={`flex flex-col justify-center items-center `}
                    >
                      <p
                        className={`${poppins.className} text-base font-medium text-[#475467] opacity-50`}
                      >
                        {patient.uhid}
                      </p>
                    </div>

                    <div
                      className={`flex flex-row justify-between ${
                        shownotassigned ? "items-end" : "items-center"
                      }`}
                    >
                      <div
                        className={`${inter.className} font-semibold text-[#373737] text-sm w-1/2`}
                      >
                        {patient.count} Patients
                      </div>

                      {/* Progress Bar with Hover */}
                      {patient.compliance === "NA" ? (
                        <div className="w-1/2 flex flex-col items-end relative group">
                          <Image
                            src={Error}
                            alt="Not assigned"
                            className={`w-6 h-6`}
                          />

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
                        <div className="w-1/2 flex flex-col items-center relative group">
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
    </>
  );
};

export default Doctorlist;
