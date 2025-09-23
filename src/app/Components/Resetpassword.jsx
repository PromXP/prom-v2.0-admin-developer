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

const Resetpassword = ({ isOpenacc, onCloseacc }) => {
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

  const [mounted, setMounted] = useState(false);



  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpenacc) return null;

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

export default Resetpassword;
