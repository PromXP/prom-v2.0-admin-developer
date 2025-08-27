"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Raleway, Inter, Poppins } from "next/font/google";

import MainBg from "@/app/Assets/mainbg.png";
import MainsubBg from "@/app/Assets/mainsubbg.png";
import Logo from "@/app/Assets/logo.png";
import AdminImage from "@/app/Assets/admin.png";

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

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [userUHID, setuserUHID] = useState("");
  const [userPassword, setuserPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [alermessage, setAlertMessage] = useState("");
  const [response, setResponse] = useState(null);

  const showWarning = (message) => {
    setAlertMessage(message);
    setshowAlert(true);
    setTimeout(() => setshowAlert(false), 4000);
  };

  const handlelogin = () => {
    router.replace("/Homedashboard");
  };

  return (
    <div className="relative bg-[#CFDADE] min-h-screen w-full">
      {/* Top-left MainBg */}
      <div className="absolute top-0 left-0">
        <Image src={MainBg} alt="MainBg" className="w-64 h-64" />
      </div>

      {/* Bottom-right MainsubBg */}
      <div className="absolute bottom-0 right-0">
        <Image src={MainsubBg} alt="MainsubBg" className="w-80 h-44" />
      </div>

      {/* Card fills full screen with padding gap */}
      <div className="absolute inset-0 p-2 box-border rounded-4xl">
        <div className="w-full h-full rounded-4xl border-white border-[1px] bg-white/10 ring-1 ring-white/30 backdrop-blur-md p-1 shadow-[0_0_0_0.5px_rgba(255,255,255,0.3)]">
          <div
            className={`w-full h-full rounded-4xl bg-white/20 backdrop-blur-2xl text-white flex flex-row justify-center `}
          >
            <div
              className={`relative flex flex-col justify-center items-center flex-1 p-10 text-gray-900 ${
                width < 1000 ? "basis-full" : "basis-1/2"
              }`}
            >
              {/* Top-left logo + role */}
              <div className="absolute top-6 left-6 flex flex-col items-center">
                <Image src={Logo} alt="XoLabs" className="w-20 h-12" />
                <span className={`${raleway.className} text-lg font-semibold`}>
                  Admin
                </span>
              </div>

              {!showForgotPassword && (
                <div className="flex flex-col h-fit w-5/6">
                  {/* Form */}
                  <h2
                    className={`${inter.className} text-2xl font-bold mb-8 w-fit`}
                  >
                    Sign in
                  </h2>

                  <form
                    className={`flex flex-col space-y-6 ${
                      width < 1000 ? "max-w-full" : "max-w-sm"
                    }`}
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent form reload
                      handlelogin();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="UEID / Email / Phone"
                      className={`${poppins.className} rounded-md p-3 text-sm text-gray-900 placeholder-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-400`}
                    />
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`${poppins.className} w-full rounded-md text-sm p-3 text-gray-900 placeholder-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-400`}
                      />
                      {/* Password show/hide icon placeholder on right */}
                      <button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                        aria-label="Toggle Password Visibility"
                        onClick={() => setshowPassword((prev) => !prev)}
                      >
                        {!showPassword ? (
                          <svg
                            width="22"
                            height="14"
                            viewBox="0 0 22 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.8813 8.95454C2.78664 4.607 6.57133 1.51792 10.8286 1.51792C15.0845 1.51792 18.8692 4.607 19.7759 8.95454C19.8118 9.12705 19.9148 9.27823 20.0622 9.37483C20.2095 9.47142 20.3893 9.50551 20.5618 9.4696C20.7343 9.43369 20.8855 9.33072 20.9821 9.18334C21.0787 9.03596 21.1127 8.85624 21.0768 8.68373C20.0454 3.73882 15.731 0.19043 10.8286 0.19043C5.92616 0.19043 1.61181 3.73882 0.580352 8.68373C0.544441 8.85624 0.578532 9.03596 0.675126 9.18334C0.77172 9.33072 0.922904 9.43369 1.09542 9.4696C1.26794 9.50551 1.44765 9.47142 1.59503 9.37483C1.74241 9.27823 1.84538 9.12705 1.8813 8.95454V8.95454ZM10.8153 4.17291C12.0476 4.17291 13.2294 4.66242 14.1007 5.53375C14.972 6.40509 15.4615 7.58688 15.4615 8.81913C15.4615 10.0514 14.972 11.2332 14.1007 12.1045C13.2294 12.9758 12.0476 13.4654 10.8153 13.4654C9.58306 13.4654 8.40128 12.9758 7.52994 12.1045C6.65861 11.2332 6.1691 10.0514 6.1691 8.81913C6.1691 7.58688 6.65861 6.40509 7.52994 5.53375C8.40128 4.66242 9.58306 4.17291 10.8153 4.17291V4.17291Z"
                              fill="#949BA5"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="22"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.94 17.94C16.11 19.22 13.98 20 12 20C7 20 2.73 16.11 1 12C1.73947 10.1399 2.98478 8.51516 4.6 7.28M9.9 5.1C10.59 5.03 11.29 5 12 5C17 5 21.27 8.89 23 13C22.4311 14.3882 21.588 15.6563 20.52 16.73M1 1L23 23"
                              stroke="#949BA5"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <a
                        onClick={() => setShowForgotPassword(true)}
                        className={`${inter.className} text-sm text-gray-500 hover:underline cursor-pointer`}
                      >
                        Recover Password ?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className={`${raleway.className} w-2/5 text-lg cursor-pointer bg-black text-white rounded-md py-1 font-semibold hover:bg-gray-800 transition`}
                    >
                      Login
                    </button>
                  </form>
                </div>
              )}

              {showForgotPassword && (
                <div className="flex flex-col h-fit w-5/6">
                  <h2
                    className={`${inter.className} text-2xl font-bold mb-8 w-fit`}
                  >
                    Reset Password
                  </h2>
                  <form
                    className={`flex flex-col space-y-6 ${
                      width < 1000 ? "max-w-full" : "max-w-sm"
                    }`}
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent form reload
                      // handleForgotPassword(); // Call your login function
                    }}
                  >
                    <input
                      type="text"
                      placeholder="UEID"
                      value={userUHID}
                      onChange={(e) => setuserUHID(e.target.value)}
                      className={`${poppins.className} rounded-md p-3 text-sm text-gray-900 placeholder-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-400`}
                    />
                    <input
                      type="text"
                      placeholder="Registered Email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={`${poppins.className} rounded-md p-3 text-sm text-gray-900 placeholder-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-400`}
                    />

                    <div
                      className={`w-full flex ${
                        width < 600 ? "flex-col items-center gap-4" : "flex-row"
                      } justify-between`}
                    >
                      <button
                        type="submit"
                        className={`${raleway.className} ${
                          width < 600 ? "w-fit px-4" : "w-1/2"
                        } text-lg cursor-pointer bg-black text-white rounded-md py-1 font-semibold hover:bg-gray-800 transition`}
                      >
                        Send Reset Link
                      </button>

                      <button
                        className={`${raleway.className} ${
                          width < 600 ? "w-fit px-4" : "w-1/2"
                        } text-lg cursor-pointer  text-black rounded-md py-1 font-semibold`}
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetEmail("");
                        }}
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {width >= 1000 && (
              <div className="basis-1/2 max-h-full relative flex-1 bg-[linear-gradient(to_bottom_left,_#319B8F_0%,_#FFFFFF_60%,_#319B8F_100%)] rounded-4xl flex justify-center px-4 items-center">
                <div className="relative aspect-[1/2] w-full max-w-[400px] max-h-full z-10">
                  <Image
                    src={AdminImage}
                    alt="Admin"
                    className="w-full h-full object-contain rounded-2xl z-10"
                    priority
                  />

                  {/* Top-left shape */}
                  <div className="absolute top-[7%] left-[-10%] w-[30%] max-w-[120px] z-0">
                    <svg
                      viewBox="0 0 123 107"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse
                        cx="24.2525"
                        cy="24.7844"
                        rx="24.2525"
                        ry="24.7844"
                        transform="matrix(0.992027 -0.126023 0.12059 0.992702 68.9062 47.873)"
                        fill="#BDFFF0"
                      />
                      <ellipse
                        cx="14"
                        cy="92.5"
                        rx="14"
                        ry="14.5"
                        fill="white"
                      />
                      <ellipse
                        cx="14"
                        cy="14.5"
                        rx="14"
                        ry="14.5"
                        fill="#319B8F"
                      />
                    </svg>
                  </div>

                  {/* Bottom-right shape */}
                  <div className="absolute top-[10%] right-[-5%] w-[25%] max-w-[100px] z-0">
                    <svg
                      width="92"
                      height="214"
                      viewBox="0 0 92 214"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask id="path-1-inside-1_713_8710" fill="white">
                        <path d="M7.1491 0.748021C26.0129 9.66875 42.8714 22.6588 56.5267 38.7952C70.182 54.9315 80.2991 73.8181 86.1589 94.113C92.0187 114.408 93.4775 135.613 90.4317 156.221C87.3858 176.83 79.9101 196.336 68.5357 213.354L54.0567 202.965C64.0143 188.067 70.5588 170.991 73.2252 152.949C75.8916 134.908 74.6145 116.345 69.4846 98.5779C64.3548 80.8111 55.498 64.2772 43.5437 50.151C31.5894 36.0247 16.831 24.6528 0.317053 16.8433L7.1491 0.748021Z" />
                      </mask>
                      <path
                        d="M7.1491 0.748021C26.0129 9.66875 42.8714 22.6588 56.5267 38.7952C70.182 54.9315 80.2991 73.8181 86.1589 94.113C92.0187 114.408 93.4775 135.613 90.4317 156.221C87.3858 176.83 79.9101 196.336 68.5357 213.354L54.0567 202.965C64.0143 188.067 70.5588 170.991 73.2252 152.949C75.8916 134.908 74.6145 116.345 69.4846 98.5779C64.3548 80.8111 55.498 64.2772 43.5437 50.151C31.5894 36.0247 16.831 24.6528 0.317053 16.8433L7.1491 0.748021Z"
                        stroke="#E0E0E0"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        mask="url(#path-1-inside-1_713_8710)"
                      />
                    </svg>
                  </div>

                  {/* Center-bottom circle */}
                  <div className="absolute top-[16%] left-[55%] -translate-x-1/2 w-[55%] max-w-[400px] aspect-square bg-[#319B8F] rounded-full -z-10" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
