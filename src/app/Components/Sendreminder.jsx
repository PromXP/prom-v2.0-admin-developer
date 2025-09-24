"use client";
import Image from "next/image";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import { API_URL } from "../libs/global";

import { Poppins, Raleway, Inter, Outfit } from "next/font/google";

import { ArrowsRightLeftIcon } from "@heroicons/react/16/solid";

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

        console.log("📝 Incomplete Questionnaires:", patientData.Medical_Left);
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
    console.log("Follow-up payload:", payload);
    try {
      const response = await axios.post(
        `${API_URL}provenance/followup`,
        payload
      );
      console.log("Follow-up added:", response.data);
      showWarning("Follow-up added successfully!");
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
              className={`w-full h-full rounded-lg flex flex-col gap-8 ${
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
                  >
                    {!switchcont ? "Follow Up" : "Reminder"}
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
                    <Image
                      src={CloseIcon}
                      alt="Close"
                      className={`w-fit h-6 cursor-pointer`}
                      onClick={() => {
                        onClosereminder();
                        setSwitchcont(false);
                        setremindermessage("");
                        setfollowupmessage("");
                        setexpand(false);
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
                  {!switchcont ? "Reminder" : "Add Follow Up Comment"}
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
                        >
                          {template}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      rows={10}
                      value={followupmessage}
                      onChange={(e) => setfollowupmessage(e.target.value)}
                      className="px-2 py-1 text-sm w-full bg-[#F3F3F3] text-black"
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
                    href={`tel:${phone}`}
                    className={`bg-[#161C10] text-white py-2 font-normal cursor-pointer flex justify-center items-center ${
                      outfit.className
                    } ${width < 700 ? "w-1/2" : "w-1/3"}`}
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
                  >
                    SEND
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
                  {!switchcont ? "Pending" : "Follow Up"}
                </p>

                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-col"}`}
                >
                  {!switchcont ? (
                    <table
                      className={`w-full ${inter.className} font-medium text-center text-black`}
                    >
                      <thead>
                        <tr>
                          <th className=" text-sm font-semibold text-black py-2">
                            S. No
                          </th>
                          <th className=" text-sm font-semibold text-black py-2">
                            Period
                          </th>
                          <th className=" text-sm font-semibold text-black py-2">
                            Name
                          </th>
                          <th className=" text-sm font-semibold text-black py-2">
                            Side
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ques.map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 text-sm text-center text-black">
                              {index + 1}
                            </td>
                            <td className="py-2 text-sm text-black">
                              {item.period}
                            </td>
                            <td className="py-2 text-sm text-black">
                              {item.name}
                            </td>
                            <td className="py-2 text-sm text-black">
                              {item.side}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table
                      className={`w-full ${inter.className} font-medium text-center text-black`}
                    >
                      <thead>
                        <tr>
                          <th className="text-sm font-semibold text-black py-2">
                            S. No
                          </th>
                          <th className="text-sm font-semibold text-black py-2">
                            Timestamp
                          </th>
                          <th className="text-sm font-semibold text-black py-2">
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
                                <td className="py-2 text-sm text-black">
                                  {item.follow_up_comment}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
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
