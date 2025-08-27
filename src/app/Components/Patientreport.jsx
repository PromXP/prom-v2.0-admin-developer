"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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

import Manavatar from "@/app/Assets/man.png";
import Womanavatar from "@/app/Assets/woman.png";
import Reset from "@/app/Assets/minus.png";
import Delete from "@/app/Assets/delete.png";
import Calendar from "@/app/Assets/calendar.png";
import Heatmap from "@/app/Assets/heatmap.png";
import Doctorassign from "@/app/Assets/doctorassign.png";
import Doctorassigedit from "@/app/Assets/docassigniedit.png";

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
import Patientlist from "./Patientlist";
import Doctorlist from "./Doctorlist";

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

const Patientreport = () => {
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

  const patients = Array.from({ length: 50 }, (_, i) => ({
    name: `Patient ${i + 1}`,
    age: 20 + (i % 30), // age between 20–49
    gender: i % 2 === 0 ? "Male" : "Female",
    uhid: `UHID${1000 + i}`,
    period: ["Pre Op", "6W", "3M", "6M", "1Y", "2Y"][i % 6],
    status: i % 3 === 0 ? "COMPLETED" : "PENDING",
    avatar: i % 2 === 0 ? Manavatar : Womanavatar,
  }));

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

  const doctor = ["Dr. A. Kumar", "Dr. B. Mehta", "Dr. C. Rao"];

  const [searchTermdoc, setSearchTermdoc] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const handleCheckboxChangedoc = (item) => {
    setSelectedDoctor(item);
  };

  const [closedocedit, setclosedocedit] = useState(false);

  const [docside, setdocSide] = useState("LEFT");

  const questionnaireData = {
    periods: [
      { key: "pre_op", label: "Pre Op", date: "10 July 2025" },
      { key: "6w", label: "6W", date: "20 Aug 2025" },
      { key: "3m", label: "3M", date: "15 Sep 2025" },
      { key: "6m", label: "6M", date: "01 Nov 2025" },
      { key: "1y", label: "1Y", date: "10 Jan 2026" },
      { key: "2y", label: "2Y", date: "30 May 2027" },
    ],
    questionnaires: [
      {
        name: "Oxford Knee Score",
        scores: {
          pre_op: "82",
          "6w": "77",
          "3m": "58",
          "6m": "35",
          "1y": "N/A",
          "2y": "",
        },
      },
      {
        name: "KOOS, JR",
        scores: {}, // No data
      },
      {
        name: "FJS",
        scores: {
          pre_op: "50",
          "6w": "42",
          "3m": "",
          "6m": "N/A",
          "1y": "66",
          "2y": "30",
        },
      },
      {
        name: "FJS",
        scores: {
          pre_op: "50",
          "6w": "42",
          "3m": "",
          "6m": "N/A",
          "1y": "66",
          "2y": "30",
        },
      },
      {
        name: "FJS",
        scores: {
          pre_op: "50",
          "6w": "42",
          "3m": "",
          "6m": "N/A",
          "1y": "66",
          "2y": "30",
        },
      },
    ],
  };

  function getTextColor(score) {
    if (score === null || score === undefined || isNaN(score)) return "#9CA3AF"; // gray for missing

    const percent = Math.max(0, Math.min(100, score)) / 100;

    // From red (low) to green (high), via orange/yellow
    const r = Math.round(255 * (1 - percent));
    const g = Math.round(150 + 105 * percent); // start at 150 to get orange/yellow in middle
    const b = 0;

    return `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <div
      className={`w-full flex rounded-4xl ${
        width >= 1000
          ? "flex-row overflow-y-auto h-full"
          : "flex-col pb-4 h-full overflow-y-auto"
      } ${width < 1300 ? "h-full overflow-y-auto" : "h-[90%] "}`}
    >
      <div
        className={` ${width >= 1000 ? "w-1/5 pt-8 pb-2 " : "w-full"} ${
          width < 1000 ? "min-h-screen" : "h-full"
        }`}
      >
        <div
          className={`w-full h-full  flex  ${
            width >= 1000
              ? "border-gray-300 border-r-2 flex-col"
              : width >= 400 && width < 1000
              ? "flex-row gap-2"
              : "flex-col"
          }`}
        >
          <div
            className={`w-full flex flex-col gap-4 ${
              width >= 1000
                ? "h-full"
                : width >= 400 && width < 1000
                ? "h-full py-2"
                : "h-full py-4"
            }`}
          >
            <div className="flex flex-col w-full h-1/2 gap-10 pt-4">
              <div className="flex flex-col px-4 gap-4  w-full">
                <div className={`w-full flex flex-col`}>
                  <p
                    className={`${inter.className} font-bold text-[22px] text-black`}
                  >
                    LOUIS ZEN
                  </p>
                  <p
                    className={`${inter.className} font-semibold text-sm text-black`}
                  >
                    23, MALE
                  </p>
                </div>
                <p
                  className={`${inter.className} font-semibold text-sm text-black`}
                >
                  UHID - 112548578
                </p>
                <p
                  className={`${inter.className} font-semibold text-sm text-black`}
                >
                  Left : Preop
                </p>
                <p
                  className={`${inter.className} font-semibold text-sm text-black`}
                >
                  Right : Preop
                </p>
              </div>
              <div
                className={`w-6/7 ${inter.className} font-semibold text-lg text-white bg-[#319B8F] rounded-r-full px-4`}
              >
                BMI 23.54
              </div>
            </div>

            <div
              className={`w-full h-1/2 flex flex-col gap-8 px-4 pt-2 ${inter.className} font-semibold text-white text-sm  border-[#CED5D7] border-t-2`}
            >
              <p
                className={`${inter.className} font-semibold text-sm text-black text-center`}
              >
                RECORDS
              </p>

              <div className={`flex flex-col w-full items-end gap-4`}>
                <p
                  className={`${inter.className} font-semibold text-white text-sm bg-[#44A194] rounded-lg px-3 py-0.5 text-center w-fit`}
                >
                  COMPLETED 03
                </p>
                <p
                  className={`${inter.className} font-semibold text-black text-sm bg-[#C8D5D7] rounded-lg px-3 py-0.5 text-center w-fit`}
                >
                  PENDING 05
                </p>
                <p
                  className={`${inter.className} font-semibold text-black text-sm text-center w-fit`}
                >
                  LEFT LEG
                </p>
              </div>

              <div className={`flex flex-col w-full items-end gap-4`}>
                <p
                  className={`${inter.className} font-semibold text-white text-sm bg-[#44A194] rounded-lg px-3 py-0.5 text-center w-fit`}
                >
                  COMPLETED 03
                </p>
                <p
                  className={`${inter.className} font-semibold text-black text-sm bg-[#C8D5D7] rounded-lg px-3 py-0.5 text-center w-fit`}
                >
                  PENDING 05
                </p>
                <p
                  className={`${inter.className} font-semibold text-black text-sm text-center w-fit`}
                >
                  RIGHT LEG
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={` flex rounded-4xl ${
          width >= 1000
            ? "flex-row w-4/5 h-full"
            : "flex-col w-full pt-4 h-full"
        }`}
      >
        <div
          className={`flex flex-col  px-2 p-2 gap-3 ${
            width >= 1000 ? "w-full h-full overflow-y-auto" : "w-full h-fit"
          }`}
        >
          <div
            className={`w-full flex flex-col gap-2 ${
              width < 1300 ? "h-[800px]" : ""
            }`}
          >
            <div
              className={`w-full flex  ${
                width >= 500
                  ? "flex-row justify-between"
                  : "flex-col items-center gap-6"
              }`}
            >
              <div
                className={`flex flex-row gap-4 items-center justify-end ${
                  width >= 500 ? "w-1/6" : " w-full"
                }`}
              >
                <button
                  className={`${raleway.className} text-sm px-4 py-[0.5px] w-1/2 rounded-lg font-semibold bg-[#2B333E] text-white cursor-pointer`}
                >
                  Left
                </button>
                <button
                  className={`${raleway.className} text-sm px-4 py-[0.5px] w-1/2 rounded-lg font-semibold bg-[#CAD9D6] text-black cursor-pointer`}
                >
                  Right
                </button>
              </div>
              <Image src={Heatmap} alt="heatmap" />
            </div>
            <div className="bg-white rounded-2xl px-2 py-1 flex flex-col gap-4 shadow-lg h-full w-full">
              <div className="w-full overflow-x-auto h-full overflow-y-auto">
                <table className="min-w-full table-fixed border-separate border-spacing-y-1">
                  <thead className="text-[#475467] text-[16px] font-medium text-center">
                    <tr className="rounded-2xl">
                      <th
                        className={`${inter.className} font-bold text-white text-sm px-2 py-1 bg-gray-900 rounded-tl-2xl text-center whitespace-nowrap w-3/5`}
                      >
                        <div className="flex flex-row justify-center items-center gap-4">
                          <p>Questionnaire</p>
                        </div>
                      </th>
                      {questionnaireData.periods.map((period, idx) => (
                        <th
                          key={period.key}
                          className={`px-4 py-3  bg-gray-900 text-center whitespace-nowrap ${
                            idx === questionnaireData.periods.length - 1
                              ? "rounded-tr-2xl"
                              : ""
                          }`}
                        >
                          <div className="flex flex-row items-center gap-1 w-full">
                            <div className="w-fit">
                              <span
                                className={`${inter.className} font-bold text-white`}
                              >
                                <Image
                                  src={Delete}
                                  alt="reset"
                                  className="w-8 h-5 max-w-[22px] min-h-[20px] font-bold cursor-pointer"
                                  onClick={() => handleDeleteClick(col)}
                                />
                              </span>
                            </div>
                            <div className={`w-fit flex flex-col`}>
                              <span
                                className={`${inter.className} text-[15px]  text-white font-bold`}
                              >
                                {period.label}
                              </span>
                              <span
                                className={`${inter.className} text-[10px]  text-white font-semibold`}
                              >
                                {period.date}
                              </span>
                            </div>
                            <div className={`w-fit`}>
                              <span className="text-[#475467]">
                                <Image
                                  src={Reset}
                                  alt="reset"
                                  className="w-8 h-5 max-w-[22px] min-h-[20px] font-bold cursor-pointer"
                                  onClick={() => handleMinusClick(col)}
                                />
                              </span>
                            </div>

                            {/* <div
                                className={`${inter.className} font-bold text-white text-sm flex items-center justify-between gap-2 w-full`}
                              >
                                {" "}
                              </div> */}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white text-[13px]">
                    {questionnaireData.questionnaires.map((q, index) => (
                      <tr key={index} className="">
                        <td
                          className={`${raleway.className} font-semibold px-4 py-2 text-[#1F2937]`}
                        >
                          {q.name}
                        </td>

                        {Object.keys(q.scores || {}).length > 0 ? (
                          questionnaireData.periods.map((period) => {
                            const score = q.scores?.[period.key];
                            const color = getTextColor(Number(score));

                            return (
                              <td
                                key={period.key}
                                className="px-4 py-2 font-bold text-center align-middle"
                                style={{ color }}
                              >
                                {score || "—"}
                              </td>
                            );
                          })
                        ) : (
                          <td
                            colSpan={6}
                            className={`${inter.className} font-bold text-[13px] px-4 py-4 text-center text-[#3b3b3b]`}
                          >
                            No questionnaires assigned
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            className={`w-full flex gap-2 ${
              width < 1300 ? "flex-col h-full" : "flex-row h-full"
            }`}
          >
            <div
              className={`bg-white rounded-lg p-2 ${
                width < 1300 ? "w-full h-full" : "w-3/7 h-96"
              }`}
            >
              <div
                className={`bg-[#44A194] shadow-lg rounded-lg px-4 py-2 flex flex-col mr-1 justify-between w-full ${
                  width < 1300 ? "h-full" : "h-full"
                } gap-4`}
              >
                <h2
                  className={` ${raleway.className} text-end font-bold text-white text-lg`}
                >
                  ASSIGN QUESTIONNAIRES
                </h2>
                <div className="w-full h-full flex flex-col justify-between gap-4">
                  <div
                    className={`w-full h-[10%] flex ${
                      width >= 500 ? "flex-row" : "flex-col gap-4"
                    }`}
                  >
                    <div
                      className={`${
                        width >= 500 ? "w-3/4" : "w-full"
                      } flex flex-row gap-4`}
                    >
                      <div className="w-full flex flex-row items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-lg bg-white/20 ">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`${raleway.className} font-semibold text-xs w-full bg-transparent text-white placeholder-white outline-none`}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={` ${raleway.className} font-semibold w-full flex flex-row overflow-y-auto rounded-md h-full`}
                  >
                    <div className="flex flex-col w-1/2 overflow-y-auto gap-2 h-full">
                      <label className="flex items-center gap-2 px-4 py-1 text-sm text-white cursor-pointer">
                        <input
                          type="checkbox"
                          className="accent-[#D9D9D9]"
                          readOnly
                        />
                        Oxford Knee Score
                      </label>
                      <label className="flex items-center gap-2 px-4 py-1 text-sm text-white cursor-pointer ">
                        <input
                          type="checkbox"
                          className="accent-[#D9D9D9]"
                          readOnly
                        />
                        SF-12
                      </label>
                      <label className="flex items-center gap-2 px-4 py-1 text-sm text-white cursor-pointer ">
                        <input
                          type="checkbox"
                          className="accent-[#D9D9D9]"
                          readOnly
                        />
                        KOOS JR
                      </label>
                    </div>

                    <div
                      className={`${raleway.className} font-bold ${
                        width >= 500 ? "w-1/2" : "w-1/2"
                      }  flex flex-col justify-start items-center gap-4`}
                    >
                      <span className="w-fit text-center text-sm font-bold text-white bg-[#E49235] rounded-[5px] px-5 py-0.5">
                        Left
                      </span>
                      <span className="w-fit text-center text-sm font-bold text-white bg-[#2B333E] rounded-[5px] px-4 py-0.5">
                        Right
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-fullh-[20%] flex flex-wrap ${
                      width >= 500 ? "flex-row gap-y-3" : "flex-col gap-4"
                    } justify-center items-center `}
                  >
                    <div
                      className={`${
                        width >= 500 ? "w-2/3" : "w-full"
                      } flex flex-row`}
                    >
                      <div className="w-1/2 flex justify-center md:justify-between items-center">
                        <p
                          className={` ${raleway.className} font-semibold italic text-white text-xs cursor-pointer`}
                        >
                          CLEAR ALL
                        </p>
                      </div>

                      <div className="w-1/2 flex justify-center items-center">
                        <p
                          className={` ${raleway.className} font-semibold italic text-white text-xs cursor-pointer`}
                        >
                          SELECT ALL
                        </p>
                      </div>
                    </div>

                    <div
                      className={`${
                        width >= 500
                          ? "w-1/3 justify-end"
                          : "w-full justify-center"
                      } flex  items-center`}
                    >
                      <p
                        className={` ${raleway.className} font-extrabold rounded-lg px-8 py-2 text-center text-white text-xs bg-black cursor-pointer`}
                      >
                        ASSIGN
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={` flex  gap-2 ${
                width < 1300 ? "w-full h-full" : "w-4/7"
              } ${width >= 700 ? "flex-row" : "flex-col"}`}
            >
              {closedocedit ? (
                <div
                  className={` bg-white rounded-lg px-2 pt-2 flex flex-col gap-2 ${
                    width < 1300 && width >= 700
                      ? "h-full"
                      : width > 1300
                      ? ""
                      : "h-full"
                  } ${width >= 700 ? "w-1/2" : "w-full"}`}
                >
                  <div
                    className={`${
                      width < 700 ? "h-1/7" : "h-1/11"
                    } w-full flex flex-row items-center`}
                  >
                    <div className={`w-5/6 px-3 py-1 rounded-lg  bg-[#F2F2F2]`}>
                      <input
                        type="text"
                        placeholder="Search Doctor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${raleway.className} font-semibold text-xs w-full bg-transparent text-black placeholder-black outline-none`}
                      />
                    </div>
                    <div className={`w-1/6 flex items-end justify-end`}>
                      <XMarkIcon
                        className={`w-6 h-6 text-black cursor-pointer`}
                        onClick={() => {
                          setclosedocedit(false);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      width < 700 ? "h-5/7" : "h-8/11"
                    } flex flex-wrap gap-2`}
                  >
                    {doctor
                      .filter((item) =>
                        item.toLowerCase().includes(searchTermdoc.toLowerCase())
                      )
                      .map((item, index) => {
                        const [name, designation] = item.split(" - ");
                        const isSelected = selectedDoctor === item;

                        return (
                          <label
                            key={index}
                            onClick={() => handleCheckboxChangedoc(item)}
                            className={` ${
                              raleway.className
                            } font-semibold flex items-center gap-2 justify-center px-3 py-1 text-sm text-black cursor-pointer hover:bg-gray-50 flex-shrink-0 max-w-fit ${
                              isSelected ? "bg-gray-100" : ""
                            }`}
                          >
                            <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center border-[#44A194] mt-1">
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-[#44A194]" />
                              )}
                            </div>
                            <span>{item}</span>
                          </label>
                        );
                      })}
                  </div>
                  <div
                    className={`${
                      width < 700 ? "h-1/7" : "h-2/11"
                    } w-full flex flex-row justify-end items-center`}
                  >
                    <p
                      className={` ${raleway.className} font-extrabold rounded-lg px-8 py-2 cursor-pointer text-center text-white text-xs bg-black`}
                    >
                      ASSIGN
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={` rounded-lg p-2 bg-white ${
                    width < 1300 && width >= 700
                      ? "h-full"
                      : width > 1300
                      ? "h-full"
                      : "h-full"
                  } ${width >= 700 ? "w-1/2" : "w-full"}`}
                >
                  <div
                    className={`relative rounded-lg overflow-hidden ${
                      width < 1300 && width >= 700
                        ? "h-full"
                        : width > 1300
                        ? "h-full"
                        : "h-full"
                    } ${width >= 700 ? "w-full" : "w-full"}`}
                  >
                    {/* Background Image */}
                    <Image
                      src={Doctorassign} // Replace with actual image path
                      alt="Doctor"
                      className="w-full h-full object-cover"
                    />

                    {/* LEFT / RIGHT Tag */}
                    <div className="flex items-center space-x-1">
                      <div className="absolute top-3 left-3 bg-white bg-opacity-60 backdrop-blur-md rounded-lg flex space-x-1">
                        <button
                          onClick={() => setdocSide("LEFT")}
                          className={`${
                            raleway.className
                          } px-4 py-1 text-sm font-semibold rounded-lg cursor-pointer ${
                            docside === "LEFT"
                              ? "bg-gray-800 text-white"
                              : "text-gray-800"
                          }`}
                        >
                          LEFT
                        </button>
                        <button
                          onClick={() => setdocSide("RIGHT")}
                          className={`${
                            raleway.className
                          } px-4 py-1 text-sm font-semibold rounded-lg cursor-pointer ${
                            docside === "RIGHT"
                              ? "bg-gray-800 text-white"
                              : "text-gray-800"
                          }`}
                        >
                          RIGHT
                        </button>
                      </div>
                    </div>

                    {/* Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 rounded-b-lg w-full bg-black/50 backdrop-blur-none text-white py-2 px-3 flex items-center justify-between">
                      <div>
                        <p
                          className={`${inter.className} text-xl text-white font-bold`}
                        >
                          DR . DANIEL
                        </p>
                        <p
                          className={`${inter.className} text-[8px] text-white font-semibold`}
                        >
                          CURRENTLY ASSIGNED
                        </p>
                      </div>
                      <div>
                        <Image
                          src={Doctorassigedit} // Replace with actual image path
                          alt="Doctor"
                          className="w-8 h-8 object-cover cursor-pointer"
                          onClick={() => {
                            setclosedocedit(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`w-1/2 bg-white rounded-lg px-4 py-2 flex flex-col gap-2 ${
                  width < 1300 && width >= 700 ? "h-full" : ""
                } ${width >= 700 ? "w-1/2 h-3/4" : "w-full h-[400px]"}`}
              >
                <div
                  className={`${
                    width < 700 ? "h-full" : "h-1/7"
                  } w-full flex items-center`}
                >
                  <p
                    className={` ${raleway.className} font-bold text-[#29272A] text-lg`}
                  >
                    SCHEDULE SURGERY
                  </p>
                </div>
                <div
                  className={`w-3/4 ${
                    width < 700 ? "h-full" : "h-2/7"
                  } flex flex-row gap-2 justify-center items-center`}
                >
                  <Image src={Calendar} alt="Left date" />
                  <input
                    type="text"
                    placeholder="LEFT (dd-mm-yyyy) *"
                    className={` ${inter.className} w-full h-fit text-black py-3 px-4 placeholder-[#30263B] rounded-sm text-sm font-medium outline-none`}
                    maxLength={10}
                    style={{
                      backgroundColor: "rgba(217, 217, 217, 0.5)",
                    }}
                  />
                </div>
                <div
                  className={`w-3/4 ${
                    width < 700 ? "h-full" : "h-3/7"
                  } flex flex-row gap-2 justify-center items-center`}
                >
                  <Image src={Calendar} alt="Right date" />
                  <input
                    type="text"
                    placeholder="RIGHT (dd-mm-yyyy) *"
                    className={` ${inter.className} w-full h-fit text-black py-3 px-4 placeholder-[#30263B] rounded-sm text-sm font-medium outline-none`}
                    maxLength={10}
                    style={{
                      backgroundColor: "rgba(217, 217, 217, 0.5)",
                    }}
                  />
                </div>
                <div
                  className={`${
                    width < 700 ? "h-full" : "h-1/7"
                  } w-full flex flex-row justify-end items-center pb-2`}
                >
                  <p
                    className={` ${raleway.className} font-extrabold rounded-lg px-8 py-2 cursor-pointer text-center text-white text-sm bg-black`}
                  >
                    SCHEDULE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {width >= 1000 && <div className="w-[2%]"></div>}
    </div>
  );
};

export default Patientreport;
