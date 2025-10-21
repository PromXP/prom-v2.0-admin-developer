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

const Patientcompliance = ({
  isOpencompliance,
  setisOpencompliance,
  selecteduhidcompliance,
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

  const [expand, setexpand] = useState(false);

  const [mounted, setMounted] = useState(false);

  const [ques, setQues] = useState([]);

  const [patientname, setPatientName] = useState("");

  useEffect(() => {
    if (!selecteduhidcompliance) return;

    const fetchPatientReminder = async () => {
      try {
        const res = await axios.get(
          `${API_URL}patients/${selecteduhidcompliance}`
        );

        const nameMapping = {
          OKS: "Oxford Knee Score (OKS)",
          KOOS_JR:
            "Knee Injury and Osteoarthritis Outcome Score, Joint Replacement (KOOS, JR)",
          FJS: "Forgotten Joint Score (FJS)",
          SF12: "Short Form-12 (SF-12)",
          KSS: "Knee Society Score (KSS)", // <-- add if needed
        };

        const transformData = (data, side) => {
          let result = [];
          let idCounter = 1;

          for (const [key, periods] of Object.entries(data)) {
            for (const [period, details] of Object.entries(periods)) {
              result.push({
                id: idCounter++,
                name: nameMapping[key] || key, // map short code to full name
                period: period.replace("_", " "), // e.g. Pre_Op → Pre Op
                deadline: details.deadline || "",
                completed: details.completed ? 1 : 0,
                side: side,
              });
            }
          }

          return result;
        };

        setPatientName(res.data.patient.Patient.name);
        setQues([
          ...transformData(res.data.patient.Medical_Left, "left"),
          ...transformData(res.data.patient.Medical_Right, "right"),
        ]);

        

        // console.log("Fetched patient data:", {
        //   transformData: transformData(res.data.patient.Medical_Left),
        // });
      } catch (err) {
        // console.error("Error fetching patient reminder:", err);
        showWarning(err);
      }
    };

    fetchPatientReminder();
  }, [selecteduhidcompliance]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showWarning = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const [editingRow, setEditingRow] = useState(null); // index of row being edited
  const [tempDeadlines, setTempDeadlines] = useState({}); // {index: deadline}

  const updateQuestionnaire = async (data) => {
    // console.log("Updating questionnaire:", data);
    try {
      const response = await axios.put(
        `${API_URL}questionnaires/reset-single`,
        data
      );

      // console.log("Questionnaire updated:", response.data);
      showWarning("Questionnaire Reset successful!");
    } catch (error) {
      if (error.response) {
        // Server returned a response
        showWarning("Failed to update questionnaire");
      } else if (error.request) {
        // Request made but no response
        showWarning("No response from server. Please try again.");
      } else {
        // Other errors
        showWarning("Error: " + error.message);
      }
    }
  };

  const messages = [
    "Fetching questionnaire compliance data...",
    "Almost ready! Finalizing compliance overview...",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setPatientName("");
        setQues([]);
        setisOpencompliance();
        setexpand(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    // cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const periodOrder = ["Pre Op", "6W", "3M", "6M", "1Y", "2Y"];

// Sort ques by period
const sortedQues = [...ques].sort(
  (a, b) => periodOrder.indexOf(a.period) - periodOrder.indexOf(b.period)
);

  if (!isOpencompliance || !mounted) return null;

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
               ${width < 950 ? "gap-4 w-full" : "w-6/7"}
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
              className={`w-full h-full rounded-lg flex flex-col gap-8 ${
                width < 760 ? "py-0" : "py-4 px-8"
              }`}
            >
              <div className={`w-full flex flex-col gap-1`}>
                <div className="flex flex-row justify-between items-center w-full">
                  <p
                    className={`${inter.className} text-xl font-bold text-black`}
                  >
                    {patientname || "Patient"}'s Compliance
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
                      className={`w-6 h-6 text-red-600 cursor-pointer`}
                      onClick={() => {
                        setPatientName("");
                        setQues([]);
                        setisOpencompliance();
                        setexpand(false);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`w-full flex gap-2 ${
                  width >= 1200 ? "flex-col" : "flex-col"
                }`}
              >
                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-col"}`}
                >
                  <div className="w-full overflow-x-auto">
                    <table
                      className={`w-full min-w-[1000px] ${inter.className} font-medium text-center text-black`}
                    >
                      <thead>
                        <tr
                          className={`${inter.className} font-bold text-[15px] text-white bg-[#363636]`}
                        >
                          <th className="py-2">Name</th>
                          <th className="py-2">Period</th>
                          <th className="py-2">Side</th>
                          <th className="py-2">Deadline</th>
                          <th className="py-2"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {sortedQues.length === 0 ? (
                          <div className="flex py-2 items-center space-x-2 w-full justify-center">
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
                          sortedQues.map((item, index) => {
                            const isEditing = editingRow === index;
                            const tempDeadline =
                              tempDeadlines[index] ?? item.deadline;

                            return (
                              <tr
                                key={index}
                                className={`${raleway.className} font-semibold`}
                              >
                                <td className="text-start py-2 text-sm text-black w-4/9">
                                  {item.name}
                                </td>
                                <td className="py-2 text-sm text-black w-1/9">
                                  {item.period}
                                </td>
                                <td
                                  className={`py-2 text-sm w-1/9 ${
                                    item.completed === 1
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {item.side.charAt(0).toUpperCase()}
                                </td>

                                <td
                                  className={`py-2 text-sm text-black w-2/9 ${
                                    inter.className
                                  } font-medium ${
                                    item.completed === 1
                                      ? "text-gray-400 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center justify-center gap-4 w-4/5 mx-auto">
                                    {isEditing ? (
                                      <>
                                        <input
                                          type="date"
                                          className="border rounded px-2 py-1 text-sm"
                                          value={tempDeadline}
                                          onChange={(e) =>
                                            setTempDeadlines({
                                              ...tempDeadlines,
                                              [index]: e.target.value,
                                            })
                                          }
                                        />
                                        <ClipboardDocumentCheckIcon
                                          className="w-6 h-6 cursor-pointer text-green-600"
                                          onClick={() => {
                                            item.deadline =
                                              tempDeadlines[index]; // save
                                            setEditingRow(null);
                                          }}
                                        />
                                        <XMarkIcon
                                          className="w-6 h-6 cursor-pointer text-red-600"
                                          onClick={() => {
                                            setTempDeadlines({
                                              ...tempDeadlines,
                                              [index]: item.deadline,
                                            }); // reset
                                            setEditingRow(null);
                                          }}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <span>{item.deadline}</span>
                                        {item.completed !== 1 && (
                                          <PencilSquareIcon
                                            className="w-5 h-5 cursor-pointer"
                                            onClick={() => setEditingRow(index)}
                                            title="Click to edit the deadline"
                                          />
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>

                                <td
                                  onClick={() => {
                                    if (item.completed !== 1) {
                                      const data = {
                                        uhid: selecteduhidcompliance,
                                        side: item.side,
                                        name: item.name,
                                        period: item.period,
                                        deadline: tempDeadlines[index],
                                      };
                                      updateQuestionnaire(data);
                                    }
                                  }}
                                  className={`w-1/9 ${
                                    item.completed === 1
                                      ? "text-gray-400 cursor-not-allowed"
                                      : "text-black cursor-pointer"
                                  }`}
                                  title="Click to confirm the modified deadline"
                                >
                                  Reschedule
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
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
    document.body // Render to body, outside constrained parent.
  );
};

export default Patientcompliance;
