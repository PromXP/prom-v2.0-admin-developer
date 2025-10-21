"use client";
import Image from "next/image";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import { API_URL } from "../libs/global";

import { Poppins, Raleway, Inter, Outfit } from "next/font/google";

import { ArrowsRightLeftIcon, XCircleIcon } from "@heroicons/react/16/solid";

import CloseIcon from "@/app/Assets/closeiconwindow.png";
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

const Sendreminder = ({ isOpenreminder, onClosereminder, selecteduhid }) => {
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

  const [followup, setFollowup] = useState([]);

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!selecteduhid) return;

    const fetchPatientReminder = async () => {
      try {
        const res = await axios.get(
          `${API_URL}get_admin_patient_reminder_page/${selecteduhid}`
        );

        const patientData = res.data.patient;
        setFollowup(res.data.patient.follow_up_records);
        setPatient(patientData);
        setPhone(res.data.patient.Patient.phone);
        setEmail(res.data.patient.Patient.email);

        // 🔄 Transform API data → ques format
        const transformedQues = [];

        // Helper to push questionnaires
        const processSide = (sideObj, sideName) => {
          if (!sideObj) return;

          Object.entries(sideObj).forEach(([qName, periods]) => {
            Object.entries(periods).forEach(([period, data]) => {
              if (!data.completed) {
                transformedQues.push({
                  id: transformedQues.length + 1,
                  name:
                    qName === "OKS"
                      ? "Oxford Knee Score"
                      : qName === "SF12"
                      ? "Short Form - 12"
                      : qName === "FJS"
                      ? "Forgotten Joint Score"
                      : qName === "KOOS_JR"
                      ? "Knee Injury and Osteoarthritis Outcome Score, Joint Replacement"
                      : qName === "KSS"
                      ? "Knee Society Score"
                      : qName,
                  period: period.replace("_", " "), // e.g., "Pre Op"
                  deadline: data.deadline,
                  completed: data.completed ? 1 : 0,
                  side: sideName,
                });
              }
            });
          });
        };

        // Process both sides
        processSide(patientData.Medical_Left, "Left");
        processSide(patientData.Medical_Right, "Right");

        // console.log("📝 Incomplete Questionnaires:", transformedQues);
        setQues(transformedQues); // replace your static ques
      } catch (err) {
        console.error("Error fetching patient reminder:", err);
      }
    };

    fetchPatientReminder();
  }, [selecteduhid]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [remindermessage, setremindermessage] = useState("");
  const [followupmessage, setfollowupmessage] = useState("");

  const handleSubmit = async () => {
    if (!selecteduhid.trim()) {
      showWarning("UHID is required");
      return;
    }
    if (!followupmessage.trim()) {
      showWarning("Comment is required");
      return;
    }
    const payload = {
      uhid: selecteduhid,
      comment: followupmessage,
    };
    // console.log("Follow-up payload:", payload);
    try {
      const response = await axios.post(
        `${API_URL}provenance/followup`,
        payload
      );
      // console.log("Follow-up added:", response.data);
      showWarning("Follow-up added successfully!");
      window.location.reload();
    } catch (err) {
      if (err.response) {
        const msg =
          err.response.data?.detail ||
          err.response.data?.message ||
          `Server Error: ${err.response.status}`;
        showWarning(msg);
      } else if (err.request) {
        showWarning("No response from server. Please check your connection.");
      } else {
        showWarning(`Request failed: ${err.message}`);
      }
      console.error("Follow-up error:", err);
    }
  };

  const handleSendremainder = async () => {
    if (remindermessage.trim() === "") {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
      return;
    }

    // console.log(
    //   "Reminder data",
    //   JSON.stringify({
    //     // message:
    //     //   "Hey User\nHope Your doing well !\n" +
    //     //   message +
    //     //   "\nThank you with love,\nXolabsHealth ",
    //     user_name: patient?.Patient?.name,
    //     message: remindermessage,
    //     phone_number: "+91" + phone,
    //   })
    // );
    // return;

    // sendRealTimeMessage();
    try {
      const res = await fetch(API_URL + "send/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: patient?.Patient?.name,
          email: email,
          subject: "Questionnaire Pending Reminder",
          message: remindermessage + "<br>Thank you with love,<br>XolabsHealth",
        }),
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: "Invalid JSON response", raw: text };
      }

      // console.log("Email API response:", data);

      if (res.ok) {
        // alert("Email sent (check console for details)");
        // showWarning("Email sent Successfully");
        // sendRealTimeMessage();
      } else {
        showWarning("Failed to send email. Check logs.");
      }
      sendwhatsapp();
    } catch (error) {
      console.error("Error sending email:", error);
      showWarning("Failed to send email.");
    }
  };

  const templates = [
    "This is a reminder to complete your pending health questionnaire. Please fill it in at your earliest convenience to help us provide better care.",
    "Your medical questionnaire is still pending. Kindly complete it before your upcoming appointment.",
    "Reminder: Your health questionnaire is due. Completing it on time ensures that your doctor has the necessary information for your care.",
    "Your post-surgery questionnaire is pending. Please complete it today so we can track your recovery progress.",
    "Please take a few minutes to complete your assigned questionnaire. This helps us prepare for your consultation and provide the best care.",
  ];

  const sendwhatsapp = async () => {
    const res = await fetch(API_URL + "send-whatsapp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // message:
        //   "Hey User\nHope Your doing well !\n" +
        //   message +
        //   "\nThank you with love,\nXolabsHealth ",
        user_name: patient?.Patient?.name,
        message: remindermessage,
        phone_number: "+91" + phone,
        flag: 0,
      }),
    });

    let data;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: "Invalid JSON response", raw: text };
    }

    showWarning("Reminder Sent Successfully");
    window.location.reload();
  };

  const showWarning = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const [switchcont, setSwitchcont] = useState(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClosereminder();
        setSwitchcont(false);
        setremindermessage("");
        setfollowupmessage("");
        setexpand(false);
        setPatient(null);
        setQues([]);
        setFollowup([]);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("notifyflag", "false");
          sessionStorage.setItem("patientnotifyid", "");
        }
      }
    };

    window.addEventListener("keydown", handleEsc);

    // cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (!isOpenreminder || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 "
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
              width < 760 ? "h-fit" : "h-fit"
            } `}
          >
            <div
              className={`w-full h-fit rounded-lg flex flex-col gap-8 ${
                width < 760 ? "py-0" : "py-4 px-8"
              }`}
            >
              <div className={`w-full flex flex-col gap-1`}>
                <div className="flex flex-row justify-between items-center w-full">
                  <div
                    className={`${outfit.className} text-lg font-normal text-black/80 w-1/3 gap-2`}
                  >
                    <p className={`text-2xl font-semibold text-black`}>
                      {patient?.Patient?.name || "Patient Name"}
                    </p>
                    <p className={`text-lg font-normal text-black/80`}>
                      {patient?.uhid || "Patient ID"}
                    </p>
                  </div>

                  <div
                    className={`${raleway.className} w-1/3 flex flex-col items-center gap-1 text-black font-semibold`}
                    title={!switchcont ? "Click to Follow Up" : "Click to Reminder"}
                  >
                    {!switchcont ? "Switch to Follow Up" : "Switch to Reminder"}
                    <ArrowsRightLeftIcon
                      className={`w-6 h-6 text-black cursor-pointer`}
                      onClick={() => setSwitchcont(!switchcont)}
                    />
                  </div>
                  <div
                    className={`flex flex-row gap-4 items-center justify-end w-1/3`}
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
                        onClosereminder();
                        setSwitchcont(false);
                        setremindermessage("");
                        setfollowupmessage("");
                        setexpand(false);
                        setPatient(null);
                        setQues([]);
                        setFollowup([]);
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("notifyflag", "false");
                          sessionStorage.setItem("patientnotifyid", "");
                        }
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-col gap-2 ${
                    width < 700 ? "w-full" : "w-full"
                  }`}
                ></div>
              </div>

              <div
                className={`w-full flex gap-2 ${
                  width >= 1200 ? "flex-col" : "flex-col"
                }`}
              >
                <p
                  className={`${outfit.className} text-lg font-normal text-black`}
                >
                  {!switchcont ? "Reminder Message" : "Admin Follow Up Notes"}
                </p>

                <div
                  className={`${poppins.className} flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-col"}`}
                >
                  {!switchcont ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {templates.map((template, index) => (
                        <div
                          key={index}
                          onClick={() => setremindermessage(template)}
                          className={`border rounded-md px-4 py-3 text-sm text-black cursor-pointer hover:bg-blue-100 ${
                            remindermessage === template
                              ? "bg-blue-200 border-blue-500"
                              : "bg-gray-100"
                          }`}
                          title="Select any one reminder message"
                        >
                          {template}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      rows={10}
                      maxLength={100}
                      value={followupmessage}
                      onChange={(e) => setfollowupmessage(e.target.value)}
                      placeholder="Enter follow up comment (max 100 characters"
                      className={` ${inter.className} px-2 py-1 text-sm w-full bg-[#F3F3F3] text-black`}
                    />
                  )}
                </div>
              </div>

              <div className={`w-full flex flex-row`}>
                <div
                  className={`w-1/2 flex flex-row gap-6 items-center ${
                    width < 700 ? "justify-between" : "justify-start"
                  }`}
                >
                  <a
                    href={`tel:+91${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-[#161C10] text-white py-2 font-normal cursor-pointer flex justify-center items-center ${
                      outfit.className
                    } ${width < 700 ? "w-1/2" : "w-1/3"}`}
                    title="Contact Patient"
                  >
                    CALL
                  </a>
                </div>

                <div
                  className={`w-1/2 flex flex-row gap-6 items-center ${
                    width < 700 ? "justify-between" : "justify-end"
                  }`}
                >
                  <button
                    className={`text-black/80 font-normal ${
                      outfit.className
                    } cursor-pointer ${width < 700 ? "w-1/2" : "w-1/3"}`}
                    onClick={() => {
                      if (!switchcont) {
                        setremindermessage("");
                      } else {
                        setfollowupmessage("");
                      }
                    }}
                  >
                    Clear All
                  </button>
                  <button
                    className={`bg-[#161C10] text-white py-2 font-normal cursor-pointer ${
                      outfit.className
                    } ${width < 700 ? "w-1/2" : "w-1/3"}`}
                    onClick={() => {
                      if (!switchcont) {
                        handleSendremainder();
                      } else {
                        handleSubmit();
                      }
                    }}
                    title={!switchcont ? "Send reminder to patient" : "Save the follow up notes"}
                  >
                    {!switchcont ? "SEND" : "NOTE"}
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
                  {!switchcont ? "Pending" : "Follow Up History"}
                </p>

                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-col"}`}
                >
                  {!switchcont ? (
                    ques && ques.length > 0 ? (
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
                              Period
                            </th>
                            <th className=" text-sm font-semibold text-black py-2 border-b border-dashed border-gray-500">
                              Name
                            </th>
                            <th className=" text-sm font-semibold text-black py-2 border-b border-dashed border-gray-500">
                              Side
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...ques]
                            .sort((a, b) => {
                              const periodOrder = [
                                "Pre Op",
                                "6W",
                                "3M",
                                "6M",
                                "1Y",
                                "2Y",
                              ];
                              const periodDiff =
                                periodOrder.indexOf(a.period) -
                                periodOrder.indexOf(b.period);
                              if (periodDiff !== 0) return periodDiff;
                              return a.side === "Left" ? -1 : 1; // Left before Right
                            })
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="py-2 text-sm text-center text-black">
                                  {index + 1}
                                </td>
                                <td className="py-2 text-sm text-black">
                                  {item.period}
                                </td>
                                <td
                                  className="py-2 text-sm text-black break-words text-center"
                                  style={{
                                    maxWidth: "250px",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {item.name}
                                </td>
                                <td
                                  className={`py-2 text-sm ${
                                    item.side === "Left"
                                      ? "text-teal-500"
                                      : "text-orange-500"
                                  } text-black`}
                                >
                                  {item.side}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    ) : (
                      <p
                        className={` ${raleway.className} font-semibold text-center text-gray-500 py-4 text-sm`}
                      >
                        No Questionnaire pending
                      </p>
                    )
                  ) : followup && followup.length > 0 ? (
                    <table
                      className={`w-full ${inter.className} font-medium text-center text-black border border-solid border-gray-400 rounded-lg`}
                      style={{
                        borderCollapse: "separate",
                        borderSpacing: "8px 8px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th className="text-sm font-semibold text-black py-2 border-b border-dashed border-gray-500">
                            S. No
                          </th>
                          <th className="text-sm font-semibold text-black py-2 border-b border-dashed border-gray-500">
                            Timestamp
                          </th>
                          <th className="text-sm font-semibold text-black py-2 border-b border-dashed border-gray-500">
                            Follow Up Comment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {followup
                          ?.slice() // make a copy to avoid mutating state
                          .sort(
                            (a, b) =>
                              new Date(b.recorded) - new Date(a.recorded)
                          ) // latest first
                          .map((item, index) => {
                            const date = new Date(item.recorded);

                            const formattedDate = date
                              .toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              .replace(",", " -");

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
                                  {item.follow_up_comment}
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
    </div>,
    document.body // Render to body, outside constrained parent.
  );
};

export default Sendreminder;
