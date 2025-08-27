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

const Activationstatus = ({ isActivationstatus, setisActivationstatus }) => {
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

  const [comment, setcomment] = useState("");

  if (!isActivationstatus || !mounted) return null;

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
                    Confirmation
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
                      onClick={() => setisActivationstatus(false)}
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
                    className="px-2 py-1 text-sm w-full bg-[#F3F3F3] text-black"
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
                    className={`text-black/80 font-normal ${
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
                    onClick={() => {}}
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

export default Activationstatus;
