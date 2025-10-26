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

const Activationstatus = ({
  isActivationstatus,
  setisActivationstatus,
  selectedpatuhidactivation,
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

  const [patient, setPatient] = useState(null);

  const [ques, setQues] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!selectedpatuhidactivation) return;

    const fetchPatientReminder = async () => {
      try {
        const res = await axios.get(
          `${API_URL}get_admin_patient_activation_page/${selectedpatuhidactivation}`
        );

        const patientData = res.data.patient.activation_records;
        setPatient(patientData);
        setStatus(res.data.patient.activation_status);
        // console.log("Fetched patient reminder data:", patientData);
      } catch (err) {
        console.error("Error fetching patient reminder:", err);
      }
    };

    fetchPatientReminder();
  }, [selectedpatuhidactivation]);

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

  const [comment, setcomment] = useState("");

  const updatePatient = async (uhid) => {
    if (!uhid) {
      showWarning("UHID is required");
      return;
    }
    if (!comment) {
      showWarning("Comment is required");
      return;
    }
    const update = {
      uhid: uhid,
      comment: `${
        String(status) === "false" ? "Activation - " : "Deactivation - "
      }${comment}`,
    };

    const update1 = {
      field: "activation_status",
      value: `${String(status) === "false" ? "true" : "false"}`,
    };

    try {
      const res = await axios.patch(
        `${API_URL}patients/update-field/${uhid}`,

        update1,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res1 = await axios.post(
        `${API_URL}provenance/activation`,

        update,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      showWarning("Successfully Updated");
      window.location.reload();
    } catch (error) {
      console.error("❌ Error updating patient:", error);

      // ✅ Handle error safely
      if (error.response?.data?.message) {
        showWarning(error.response.data.message);
      } else {
        showWarning(error.message || "Error updating patient");
      }

      throw error;
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("activflag", "false");
          sessionStorage.setItem("patientactivid", "");
        }
        setisActivationstatus(false);
        setPatient(null);
        setexpand(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    // cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (!isActivationstatus || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // white with 50% opacity
      }}
    >
      <div
        className={`
               h-screen  flex flex-col items-center justify-center mx-auto my-auto
               ${width < 950 ? "gap-4 w-full" : "w-1/2"}
               ${expand ? "w-full" : "p-4"}
             `}
      >
        <div
          className={`w-full bg-[#FCFCFC]  p-4  overflow-y-auto overflow-x-hidden inline-scroll ${
            width < 1095 ? "flex flex-col gap-4" : ""
          } ${expand ? "h-screen" : "max-h-[92vh] rounded-2xl"}`}
        >
          <div
            className={`w-full bg-[#FCFCFC]  ${
              width < 760 ? "h-fit" : "h-full"
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
                    className={`${inter.className} text-2xl w-1/2 font-semibold text-black`}
                  >
                    Activation / Deactivation
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
                      className="w-fit h-7 text-red-600  cursor-pointer"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("activflag", "false");
                          sessionStorage.setItem("patientactivid", "");
                        }
                        setisActivationstatus(false);
                        setPatient(null);
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
                <p
                  className={`${outfit.className} text-lg font-normal text-black`}
                >
                  Comment
                </p>

                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-col"}`}
                >
                  <textarea
                    rows={10}
                    value={comment}
                    onChange={(e) => setcomment(e.target.value)}
                    maxLength={100}
                    placeholder="Enter comment (max 100 characters)"
                    className={` ${inter.className} px-2 py-1 text-sm w-full bg-[#F3F3F3] text-black`}
                  />
                </div>
              </div>

              <div className={`w-full flex flex-row`}>
                <div
                  className={`w-full flex flex-row gap-6 items-center ${
                    width < 700 ? "justify-between" : "justify-end"
                  }`}
                >
                  <button
                    className={`text-black/80 border-1 border-gray-300 py-2 font-normal ${
                      outfit.className
                    } cursor-pointer ${width < 700 ? "w-1/2" : "w-1/2"}`}
                    onClick={() => {
                      setcomment("");
                    }}
                  >
                    Clear All
                  </button>
                  <button
                    className={`bg-[#161C10] text-white py-2 font-normal cursor-pointer ${
                      outfit.className
                    } ${width < 700 ? "w-1/2" : "w-1/2"}`}
                    onClick={() => {
                      updatePatient(selectedpatuhidactivation);
                    }}
                  >
                    {String(status) === "false" ? "Activate" : "Deactivate"}
                  </button>
                </div>
              </div>

              <div
                className={`w-full flex gap-2 ${
                  width >= 1200 ? "flex-col" : "flex-col"
                }`}
              >
                <p
                  className={`${outfit.className} text-lg font-normal text-black`}
                >
                  Activation / Deactivation History
                </p>

                <div
                  className={`flex gap-4 pb-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-col"}`}
                >
                  {patient && patient.length > 0 ? (
                    <table
                      className={`w-full ${inter.className} font-medium text-center text-black border border-solid border-gray-400 rounded-lg`}
                      style={{
                        borderCollapse: "separate",
                        borderSpacing: "8px 8px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th className=" text-sm font-semibold text-black py-2 border-b border-dashed border-gray-500">
                            S. No
                          </th>
                          <th className=" text-sm font-semibold text-black py-2 border-b border-dashed border-gray-500">
                            Timestamp
                          </th>
                          <th className=" text-sm font-semibold text-black py-2 border-b border-dashed border-gray-500">
                            Comment
                          </th>
                          <th className=" text-sm font-semibold text-black py-2 border-b border-dashed border-gray-500">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient
                          ?.slice() // make a copy to avoid mutating state
                          .sort(
                            (a, b) =>
                              new Date(b.recorded) - new Date(a.recorded)
                          ) // ✅ latest first
                          .map((item, index) => {
                            // ✅ Convert to IST & format as dd/mm/yyyy - hh:mm
                            const date = new Date(item.recorded);

                            const formattedDate = date
                              .toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              .replace(",", " -"); // "dd/mm/yyyy - hh:mm"

                            // ✅ Status formatting
                            const statusText = item.activation_status
                              ? "Activated"
                              : "Deactivated";

                            return (
                              <tr key={index}>
                                <td className="py-2 text-sm text-center text-black">
                                  {index + 1}
                                </td>
                                <td className="py-2 text-sm text-black">
                                  {formattedDate}
                                </td>
                                <td
                                  className="py-2 text-sm text-black break-words text-center"
                                  style={{
                                    maxWidth: "250px", // ✅ controls wrapping width
                                    whiteSpace: "normal", // ✅ allows text to wrap
                                    wordBreak: "break-word", // ✅ breaks long strings if needed
                                  }}
                                >
                                  {item.activation_comment}
                                </td>
                                <td
                                  className={`py-2 text-sm font-semibold ${
                                    statusText === "Activated"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {statusText}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  ) : (
                    <p
                      className={` ${raleway.className} font-semibold text-center text-gray-500 py-4 text-sm`}
                    >
                      No history found
                    </p>
                  )}
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

      {showAlert && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`${poppins.className} bg-yellow-100 border border-red-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out`}
          >
            {alertMessage}
          </div>
        </div>
      )}
    </div>,
    document.body // Render to body, outside constrained parent.
  );
};

export default Activationstatus;
