"use client";
import Image from "next/image";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { Poppins, Raleway, Inter, Outfit } from "next/font/google";

import CloseIcon from "@/app/Assets/closeiconwindow.png";
import UploadProfile from "@/app/assets/uploadprofilepic.png";
import ExpandIcon from "@/app/assets/expand.png";
import ShrinkIcon from "@/app/assets/shrink.png";

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

const Sendreminder = ({ isOpenreminder, onClosereminder }) => {
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

  const ques = [
    {
      id: 1,
      name: "Oxford Knee Score",
      period: "1Y",
      deadline: "2026-01-11",
      completed: 0,
    },
    {
      id: 2,
      name: "KOOS JR",
      period: "2Y",
      deadline: "2027-07-27",
      completed: 0,
    },
    {
      id: 3,
      name: "KOOS JR",
      period: "Pre Op",
      deadline: "2026-04-25",
      completed: 1,
    },
    {
      id: 4,
      name: "Oxford Knee Score",
      period: "2Y",
      deadline: "2027-08-04",
      completed: 0,
    },
    {
      id: 5,
      name: "KOOS JR",
      period: "6M",
      deadline: "2026-05-19",
      completed: 1,
    },
    {
      id: 6,
      name: "Oxford Knee Score",
      period: "Pre Op",
      deadline: "2027-06-12",
      completed: 1,
    },
    {
      id: 7,
      name: "FJS (Forgotten Joint Score)",
      period: "3M",
      deadline: "2027-07-13",
      completed: 0,
    },
    {
      id: 8,
      name: "FJS (Forgotten Joint Score)",
      period: "3M",
      deadline: "2026-05-21",
      completed: 1,
    },
    {
      id: 9,
      name: "KOOS JR",
      period: "Pre Op",
      deadline: "2026-08-30",
      completed: 0,
    },
    {
      id: 10,
      name: "Oxford Knee Score",
      period: "Pre Op",
      deadline: "2026-10-13",
      completed: 0,
    },
    {
      id: 11,
      name: "FJS (Forgotten Joint Score)",
      period: "2Y",
      deadline: "2026-07-26",
      completed: 1,
    },
    {
      id: 12,
      name: "FJS (Forgotten Joint Score)",
      period: "6M",
      deadline: "2027-06-27",
      completed: 1,
    },
    {
      id: 13,
      name: "SF-12 Health Survey",
      period: "2Y",
      deadline: "2025-11-28",
      completed: 0,
    },
    {
      id: 14,
      name: "SF-12 Health Survey",
      period: "3M",
      deadline: "2026-10-19",
      completed: 1,
    },
    {
      id: 15,
      name: "FJS (Forgotten Joint Score)",
      period: "Pre Op",
      deadline: "2026-05-07",
      completed: 1,
    },
  ];

  const [remindermessage, setremindermessage] = useState("");

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
                  <p
                    className={`${inter.className} text-2xl font-semibold text-black`}
                  >
                    Patient Name
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
                      onClick={() => onClosereminder()}
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-col gap-2 ${
                    width < 700 ? "w-full" : "w-full"
                  }`}
                >
                  <p
                    className={` ${outfit.className} font-normal text-base text-black/80`}
                  >
                    Patient ID
                  </p>
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
                  Pending
                </p>

                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-col"}`}
                >
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  Reminder
                </p>

                <div
                  className={`flex gap-4 ${
                    width >= 1200 ? "w-full" : "w-full"
                  } ${width < 700 ? "flex-col" : "flex-col"}`}
                >
                  <textarea
                    rows={10}
                    value={remindermessage}
                    onChange={(e) => setremindermessage(e.target.value)}
                    className="px-2 py-1 text-sm w-full bg-[#F3F3F3] text-black"
                  />
                </div>
              </div>

              <div className={`w-full flex flex-row`}>
                <div
                  className={`w-1/2 flex flex-row gap-6 items-center ${
                    width < 700 ? "justify-between" : "justify-start"
                  }`}
                >
                  <button
                    className={`bg-[#161C10] text-white py-2 font-normal cursor-pointer ${
                      outfit.className
                    } ${width < 700 ? "w-1/2" : "w-1/3"}`}
                  >
                    CALL
                  </button>
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
                    onClick={()=>{setremindermessage("")}}
                  >
                    Clear All
                  </button>
                  <button
                    className={`bg-[#161C10] text-white py-2 font-normal cursor-pointer ${
                      outfit.className
                    } ${width < 700 ? "w-1/2" : "w-1/3"}`}
                    onClick={() => {
                    }}
                  >
                    SEND
                  </button>
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
