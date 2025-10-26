"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ReactDOM from "react-dom";
import { useRouter } from "next/navigation";

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

import { Raleway, Inter, Poppins, Outfit } from "next/font/google";
import { Bars3Icon } from "@heroicons/react/24/outline";

import MainBg from "@/app/Assets/mainbg.png";
import MainsubBg from "@/app/Assets/mainsubbg.png";
import Logo from "@/app/Assets/xolabslogo.png";
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
  ArrowLeftIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";

import Patientlist from "../Components/Patientlist";
import Doctorlist from "../Components/Doctorlist";
import Patientreport from "../Components/Patientreport";
import Resetpassword from "../Components/Resetpassword";

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
  const [isOpenpatprof, setisOpenpatprof] = useState(false);
  const [isOpenresetpassword, setisOpenresetpassword] = useState(false);

  const handlenavigatereport = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("deleteside", "left");
    }
    setActiveTab("Report");
  };

  const [adminame, setAdminname] = useState("");

  useEffect(() => {
    let adminUhid = null;

    if (typeof window !== "undefined") {
      adminUhid = sessionStorage.getItem("admin"); // 👈 safe access
    }

    const fetchPatientReminder = async () => {
      try {
        const res = await axios.get(`${API_URL}getadminname/${adminUhid}`);
        setAdminname(res.data.admin_name);
      } catch (err) {
        console.error("Error fetching patient reminder:", err);
      }
    };

    fetchPatientReminder();
  }, [adminame]);

  const renderSelectedComponent = () => {
    switch (activeTab) {
      case "Patients":
        console.clear();
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
            isOpenpatprof={isOpenpatprof}
            setisOpenpatprof={setisOpenpatprof}
          />
        );

      case "Doctors":
        console.clear();
        return (
          <Doctorlist
            isOpenaccpat={isOpenaccpatient}
            setIsOpenaccpat={setIsOpenaccpatient}
            isOpenaccdoc={isOpenaccdoctor}
            setIsOpenaccdoc={setIsOpenaccdoctor}
          />
        );

      case "Report":
        console.clear();
        return <Patientreport />;

      default:
        return null;
    }
  };

  const [logoutconfirm, setlogoutconfirm] = useState(false);

  const handlelogout = () => {
    setlogoutconfirm(true);
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

    const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showWarning = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };


   const [showprof, setshowprof] = useState(false);

   const [doctor, setdoctor] = useState({});
   
     const fetchdoctor = async () => {
       try {
         const res = await axios.get(`${API_URL}getadmin/${sessionStorage.getItem("admin")}`);
         showWarning("Admin profile fetched");
   
         const apiPatients = res.data || {};
         setdoctor(apiPatients);
       } catch (error) {
         showWarning("Failed to fetch admin profile");
       }
     };

       const [expand, setexpand] = useState(false);




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
                  <div className="w-fit flex flex-col items-center pt-4">
                    <Image src={Logo} alt="XoLabs" className="w-20 h-6" />

                    <span
                      className={`${raleway.className} text-lg font-semibold text-black`}
                    >
                      Admin
                    </span>
                  </div>
                </div>
                <div className="w-4/5 flex flex-row items-end border-b-2 pb-4 border-gray-300">
                  {activeTab === "Report" && (
                    <ArrowLeftIcon
                      className={`w-7 h-7 text-black cursor-pointer`}
                      title="Back to Home Dashboard"
                      onClick={() => {
                        setActiveTab("Patients");
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("deleteside", "left");
                        }
                      }}
                    />
                  )}

                  <div className="w-5/7 flex flex-row gap-20 items-end justify-center">
                    {tabs
                      .filter(
                        (tab) => !(activeTab === "Report" && tab === "Patients")
                      )
                      .map((tab) => (
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
                    {/* <Image src={Headset} alt="Support" className="w-6 h-6" /> */}
                    <ArrowRightStartOnRectangleIcon
                      className="w-6 h-6 text-black cursor-pointer"
                      onClick={handlelogout}
                    />
                    <div
                      className={`${raleway.className} py-1 px-4 bg-[#1A2E39] rounded-full text-xs w-fit ${adminame?"cursor-pointer":"pointer-events-none"}`}
                      onClick={()=>{
                        if(adminame){
                          fetchdoctor();
                          setshowprof(true);
                        }
                      }}
                    >
                      <p className="font-semibold">
                        {adminame || "Admin Name"}
                      </p>
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
                    <Image src={Logo} alt="XoLabs" className="w-16 h-full" />
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
                      onClick={()=>{setshowprof(true);}}
                    >
                      <p className="font-semibold">{adminame || "Admin Name"}</p>
                    </div>
                    <div className="w-fit flex flex-row gap-8">
                      {/* <Image src={Headset} alt="Support" className="w-6 h-6" /> */}
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

      {logoutconfirm && (
        <div
          className="fixed inset-0 z-40 "
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)", // white with 50% opacity
          }}
        >
          <div
            className={`min-h-[100vh]  flex flex-col items-center justify-center mx-auto my-auto ${
              width < 950 ? "gap-4 w-full" : "w-1/3"
            }`}
          >
            <div
              className={`w-full bg-[#FCFCFC]  p-4  overflow-y-auto overflow-x-hidden inline-scroll ${
                width < 1095 ? "flex flex-col gap-4" : ""
              } max-h-[92vh] rounded-2xl`}
            >
              <div
                className={`w-full bg-[#FCFCFC]  ${
                  width < 760 ? "h-fit" : "h-[80%]"
                } `}
              >
                <div
                  className={`w-full h-full rounded-lg flex flex-col gap-8 ${
                    width < 760 ? "py-0" : "py-4 px-4"
                  }`}
                >
                  <div className={`w-full flex flex-col gap-1`}>
                    <div className="flex flex-row justify-center items-center w-full">
                      <p
                        className={`${inter.className} text-xl font-bold text-black`}
                      >
                        Confirmation
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-full flex gap-2 justify-center items-center ${
                      width >= 1200 ? "flex-col" : "flex-col"
                    }`}
                  >
                    <p
                      className={`${raleway.className} text-lg font-semibold text-black`}
                    >
                      Are you sure need to sign out?
                    </p>
                  </div>

                  <div className={`w-full flex flex-row`}>
                    <div
                      className={`w-full flex flex-row gap-6 items-center ${
                        width < 700 ? "justify-between" : "justify-end"
                      }`}
                    >
                      <button
                        className={`text-black/80 font-normal py-2 border-1 border-gray-300 ${
                          raleway.className
                        } cursor-pointer ${width < 700 ? "w-1/2" : "w-1/2"}`}
                        onClick={() => {
                          setlogoutconfirm(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className={`bg-[#161C10] text-white py-2 font-normal cursor-pointer ${
                          raleway.className
                        } ${width < 700 ? "w-1/2" : "w-1/2"}`}
                        onClick={() => {
                          console.clear(); // ✅ clear console logs
                          router.replace("/Login");
                        }}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>

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
      )}

    {showprof &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-40 "
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)", // white with 50% opacity
            }}
          >
            <div
              className={`
                    h-screen  flex flex-col items-center justify-center mx-auto my-auto
                    ${width < 950 ? "gap-4 w-full" : "w-5/8"}
                    ${expand ? "w-full" : "p-4"}
                  `}
            >
              <div
                className={`w-full bg-[#FCFCFC]  p-4  overflow-y-auto overflow-x-hidden inline-scroll ${
                  width < 1095 ? "flex flex-col gap-4" : ""
                } ${expand ? "h-full" : "max-h-[92vh] rounded-2xl"}`}
              >
                <div
                  className={`w-full bg-[#FCFCFC]  ${
                    width < 760 ? "h-fit" : "h-full"
                  } `}
                >
                  <div
                    className={`w-full h-full rounded-lg flex flex-col gap-12 ${
                      width < 760 ? "py-0" : "py-4 px-8"
                    }`}
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <p
                        className={`${inter.className} text-2xl font-semibold text-black`}
                      >
                        Admin Profile
                      </p>
                      <div
                        className={`flex flex-row gap-4 items-center justify-center`}
                      >
                        {/* {expand ? (
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
                        )} */}

                        <XCircleIcon
                          className="w-fit h-7 text-red-600  cursor-pointer"
                          onClick={() => {
                            setshowprof(false);
                            setdoctor({});
                          }}
                        />
                      </div>
                    </div>

                    <div
                      className={`w-full flex gap-12 ${
                        width >= 1200 ? "flex-row" : "flex-col"
                      }`}
                    >
                      <div
                        className={`flex gap-4 ${
                          width >= 1200 ? "w-1/2" : "w-full"
                        } ${width < 700 ? "flex-col" : "flex-row"}`}
                      >
                        <div
                          className={`flex flex-col gap-2 ${
                            width < 700 ? "w-full" : "w-1/2"
                          }`}
                        >
                          <p
                            className={` ${outfit.className} font-normal text-base text-black/80`}
                          >
                            NAME
                          </p>
                          <p
                            className={`w-full text-black
                                  font-medium
                                  text-lg
                                  ${inter.className}`}
                          >
                            {doctor?.name}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex flex-col gap-2 ${
                          width >= 1200 ? "w-1/2" : "w-full"
                        }`}
                      >
                        <p
                          className={` ${outfit.className} font-normal text-base text-black/80`}
                        >
                          UEID
                        </p>
                        <p
                          className={`w-full text-black
                                  font-medium
                                  text-lg
                                  ${inter.className}`}
                        >
                          {doctor?.uhid}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex gap-12 ${
                        width >= 1200 ? "flex-row" : "flex-col"
                      }`}
                    >
                      <div
                        className={`flex flex-col gap-8 ${
                          width >= 1200 ? "w-1/2" : "w-full"
                        }`}
                      >
                        <div
                          className={`w-full flex  gap-8 ${
                            width < 700 ? "flex-col" : "flex-row"
                          }`}
                        >
                          {/* Gender Dropdown */}
                          <div
                            className={`flex flex-col gap-2 ${
                              width < 700 ? "w-full" : "w-1/3"
                            }`}
                          >
                            <p
                              className={`${outfit.className} font-normal text-base text-black/80`}
                            >
                              GENDER
                            </p>
                            <p
                              className={`w-full text-black
                                  font-medium
                                  text-lg
                                  capitalize
                                  ${inter.className}`}
                            >
                              {doctor?.gender}
                            </p>
                          </div>

                          {/* Date of Birth Input */}
                          <div
                            className={`flex flex-col gap-2.5 ${
                              width < 700 ? "w-full" : "w-1/3"
                            }`}
                          >
                            <p
                              className={`${outfit.className} font-normal text-base text-black/80`}
                            >
                              DATE OF BIRTH
                            </p>
                            <p
                              className={`w-full text-black
                                  font-medium
                                  text-lg
                                  ${inter.className}`}
                            >
                              {doctor?.birth_date}
                            </p>
                          </div>
                          
                          
                          
                        </div>

                        <div className={`w-full flex flex-col gap-2`}>
                          <p
                          className={`${outfit.className} font-normal text-base text-black/80`}
                        >
                          EMAIL
                        </p>

                        <span className="text-black/90">
                          {doctor?.email || "NA"}
                        </span>
                        </div>
                      </div>

                      <div
                        className={`flex flex-col gap-2 justify-between ${
                          width >= 1200 ? "w-1/2" : "w-full"
                        }`}
                      >
                        <div
                          className={`w-full flex  gap-2 ${
                            width < 700 ? "flex-col" : "flex-row"
                          }`}
                        >
                          <div
                            className={`flex flex-col justify-between gap-2  ${
                              width < 700 ? "w-full" : "w-4/7"
                            }`}
                          >
                            

                            <div className={`w-full flex flex-col gap-2`}>
                              <p
                                className={`${outfit.className} font-normal text-base text-black/80`}
                              >
                                PHONE NUMBER
                              </p>

                              <span className="text-black/90">
                                {doctor?.phone || "NA"}
                              </span>
                            </div>
                          </div>

                
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
          document.body // portal target
        )}
      

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
