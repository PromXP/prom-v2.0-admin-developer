"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/16/solid";

import Patientlist from "../Components/Patientlist";
import Doctorlist from "../Components/Doctorlist";
import Patientreport from "../Components/Patientreport";

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

const page = () => {
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

  const router = useRouter();

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("selectedTab") || "Patients";
    }
    return "Patients";
  });

  const tabs = ["Patients", "Doctors"];

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

  const [isOpenaccpatient, setIsOpenaccpatient] = useState(false);
  const [isOpenaccdoctor, setIsOpenaccdoctor] = useState(false);
  const [isOpenreminder, setisOpenreminder] = useState(false);
  const [isOpencompliance, setisOpencompliance] = useState(false);
  const [isActivationstatus, setisActivationstatus] = useState(false);

  const handlenavigatereport = () => {
    setActiveTab("Report");
  };

  const renderSelectedComponent = () => {
    switch (activeTab) {
      case "Patients":
        return (
          <Patientlist
            isOpenaccpat={isOpenaccpatient}
            setIsOpenaccpat={setIsOpenaccpatient}
            isOpenaccdoc={isOpenaccdoctor}
            setIsOpenaccdoc={setIsOpenaccdoctor}
            isOpenreminder={isOpenreminder}
            setisOpenreminder={setisOpenreminder}
            isOpencompliance={isOpencompliance}
            setisOpencompliance={setisOpencompliance}
            isActivationstatus={isActivationstatus}
            setisActivationstatus={setisActivationstatus}
            handlenavigatereport={handlenavigatereport}
          />
        );

      case "Doctors":
        return (
          <Doctorlist
            isOpenaccpat={isOpenaccpatient}
            setIsOpenaccpat={setIsOpenaccpatient}
            isOpenaccdoc={isOpenaccdoctor}
            setIsOpenaccdoc={setIsOpenaccdoctor}
          />
        );

      case "Report":
        return <Patientreport />;

      default:
        return null;
    }
  };

  const handlelogout = () => {
    router.replace("/Login");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedTab", activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSelected = sessionStorage.getItem("selectedTab");

      if (storedSelected !== null) {
        setActiveTab(storedSelected);
      }
    }
  }, []);



  return (
    <div
      className={`relative bg-[#CFDADE] min-h-screen w-full overflow-x-hidden `}
    >
      {/* Top-left MainBg */}
      <div className="absolute top-0 left-0">
        <Image src={MainBg} alt="MainBg" className="w-64 h-64" />
      </div>

      {/* Bottom-right MainsubBg */}
      <div className="absolute bottom-0 right-0">
        <Image src={MainsubBg} alt="MainsubBg" className="w-80 h-44" />
      </div>

      {/* Card fills full screen with padding gap */}
      <div className="w-full h-full absolute inset-0 p-2 box-border rounded-4xl ">
        <div className="w-full h-full rounded-4xl border-white border-[1px] bg-white/10 ring-1 ring-white/30 backdrop-blur-sm p-1 shadow-[0_0_0_0.5px_rgba(255,255,255,0.3)]">
          <div
            className={`w-full h-full rounded-4xl bg-white/20 backdrop-blur-sm text-white flex flex-col inline-scroll ${
              width >= 1000
                ? " overflow-y-hidden"
                : isOpenaccpatient || isOpenaccdoctor || isSidebarOpen
                ? "overflow-y-hidden"
                : "overflow-y-auto"
            }`}
          >
            {width >= 800 ? (
              <div className="w-full h-[10%] flex flex-row">
                <div className="w-1/5 px-4">
                  <div className="w-fit flex flex-col items-center">
                    <Image src={Logo} alt="XoLabs" className="w-20 h-12" />

                    <span
                      className={`${raleway.className} text-lg font-semibold text-black`}
                    >
                      Admin
                    </span>
                  </div>
                </div>
                <div className="w-4/5 flex flex-row border-b-2 pb-4 border-gray-300">
                  <div className="w-5/7 flex flex-row gap-20 items-end justify-center">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative font-semibold text-lg ${
                          raleway.className
                        }  cursor-pointer ${
                          activeTab === tab ? "text-teal-600" : "text-black"
                        }`}
                      >
                        {tab}
                        <span
                          className="absolute right-0 bottom-0 h-[2px] bg-teal-500 rounded-full transition-all duration-300 ease-in-out origin-right"
                          style={{
                            width: activeTab === tab ? "60%" : "0%",
                            opacity: activeTab === tab ? 1 : 0,
                          }}
                        ></span>
                      </button>
                    ))}
                  </div>
                  <div className="w-2/7 flex flex-row items-end justify-end gap-8">
                    <Image src={Headset} alt="Support" className="w-6 h-6" />
                    <ArrowRightStartOnRectangleIcon
                      className="w-6 h-6 text-black cursor-pointer"
                      onClick={handlelogout}
                    />
                    <div
                      className={`${raleway.className} py-1 px-4 bg-[#1A2E39] rounded-full text-xs w-fit`}
                    >
                      <p className="font-semibold">Admin Name</p>
                    </div>
                  </div>
                </div>
                <div className="w-[2%]"></div>
              </div>
            ) : (
              <div className="w-full flex flex-col">
                {/* Top Bar with Hamburger */}
                <div className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-300">
                  <div className="flex items-center gap-2">
                    <Image src={Logo} alt="XoLabs" className="w-16 h-10" />
                    <span
                      className={`${raleway.className} text-lg font-semibold text-black`}
                    >
                      Admin
                    </span>
                  </div>
                  <button onClick={handleOpen}>
                    <Bars3Icon className="w-7 h-7 text-black" />
                  </button>
                </div>

                {/* Backdrop Overlay */}
                <div
                  className={`fixed inset-0 z-40 bg-transparent bg-opacity-40 transition-opacity duration-300 ${
                    isSidebarOpen
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                />

                {/* Sidebar Slide-In from Right */}
                <div
                  className={`
                    fixed top-0 -right-2 h-full w-64 bg-white z-50 shadow-lg rounded-2xl transform transition-transform duration-300
                    ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
                    ${isFullyHidden ? "hidden" : ""}
                  `}
                  onTransitionEnd={() => {
                    if (!isSidebarOpen) {
                      setIsFullyHidden(true); // Hide after slide-out completes
                    }
                  }}
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b">
                    <h2 className="text-xl font-semibold"></h2>
                    <button onClick={handleClose}>
                      <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                  <div className="w-full flex flex-col items-center justify-center gap-8 py-4">
                    <div
                      className={`${raleway.className} py-1 px-4 bg-[#1A2E39] rounded-full text-xs w-fit`}
                    >
                      <p className="font-semibold">Admin Name</p>
                    </div>
                    <div className="w-fit flex flex-row gap-8">
                      <Image src={Headset} alt="Support" className="w-6 h-6" />
                      <ArrowRightStartOnRectangleIcon
                        className="w-6 h-6 text-black"
                        onClick={handlelogout}
                      />
                    </div>
                  </div>
                  <nav className="p-4 space-y-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setIsSidebarOpen(false);
                        }}
                        className={`block w-full text-left text-lg font-semibold ${
                          raleway.className
                        } ${
                          activeTab === tab ? "text-teal-600" : "text-gray-700"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}

            {renderSelectedComponent()}
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
    </div>
  );
};

export default page;
