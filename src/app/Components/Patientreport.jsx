"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

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

import Manavatar from "@/app/Assets/man.png";
import Womanavatar from "@/app/Assets/woman.png";
import Reset from "@/app/Assets/minus.png";
import Delete from "@/app/Assets/delete.png";
import Calendar from "@/app/Assets/calendar.png";
import Heatmap from "@/app/Assets/heatmap.png";
import Doctorassign from "@/app/Assets/doctorassign.png";
import Doctorassigedit from "@/app/Assets/docassigniedit.png";
import CloseIcon from "@/app/Assets/closeiconwindow.png";

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
} from "@heroicons/react/16/solid";
import Patientlist from "./Patientlist";
import Doctorlist from "./Doctorlist";

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

const Patientreport = () => {
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

  const [activeTab, setActiveTab] = useState("Patients");

  const tabs = ["Patients", "Doctors", "Profile"];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullyHidden, setIsFullyHidden] = useState(true); // for hidden toggle

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [patientbasic, setpatientbasic] = useState({});

  const showWarning = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };
  let patientReportId = null;

  if (typeof window !== "undefined") {
    patientReportId = sessionStorage.getItem("patientreportid");
  }

  useEffect(() => {
    if (!patientReportId) {
      showWarning("No patient report found");
      return;
    }

    const fetchPatientReminder = async () => {
      try {
        const res = await axios.get(
          `${API_URL}patients-by-uhid/${patientReportId}`
        );

        const patient = res.data.patient;

        // calculate age from birthDate
        const calculateAge = (dob) => {
          if (!dob) return "NA";
          const birth = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
          return age;
        };

        // calculate BMI
        const calculateBMI = (heightStr, weightStr) => {
          if (!heightStr || !weightStr) return "NA";
          const heightVal = parseFloat(heightStr.replace("cm", "").trim());
          const weightVal = parseFloat(weightStr.replace("kg", "").trim());
          if (isNaN(heightVal) || isNaN(weightVal) || heightVal === 0)
            return "NA";
          const heightM = heightVal / 100; // convert cm → m
          return (weightVal / (heightM * heightM)).toFixed(1); // 1 decimal place
        };

        const bmi = calculateBMI(
          patient.Medical?.height,
          patient.Medical?.weight
        );

        const TOTAL_PERIODS = 6; // expected periods for each questionnaire

        function checkCompletion(sideData) {
          if (!sideData || Object.keys(sideData).length === 0) {
            return "Pending"; // no questionnaires = pending
          }

          for (const [qName, qData] of Object.entries(sideData)) {
            const periods = Object.keys(qData || {});
            if (periods.length < TOTAL_PERIODS) {
              return "Pending"; // ❌ this questionnaire incomplete
            }
          }

          return "Completed"; // ✅ all questionnaires have 6 periods
        }

        // Usage:
        const statusLeft = checkCompletion(patient.Medical_Left);
        const statusRight = checkCompletion(patient.Medical_Right);

        const pickedData = {
          name: patient.Patient?.name ?? "NA",
          age: calculateAge(patient.Patient?.birthDate),
          gender: patient.Patient?.gender ?? "NA",
          phone: patient.Patient?.phone ?? "NA",
          email: patient.Patient?.email ?? "NA",
          uhid: patient.uhid ?? "NA",
          statusLeft: patient.Patient_Status_Left ?? "NA",
          statusRight: patient.Patient_Status_Right ?? "NA",
          leftCompleted: patient.Medical_Left_Completed_Count ?? "NA",
          leftPending: patient.Medical_Left_Pending_Count ?? "NA",
          rightCompleted: patient.Medical_Right_Completed_Count ?? "NA",
          rightPending: patient.Medical_Right_Pending_Count ?? "NA",
          bmi: bmi, // ✅ store BMI instead of height/weight
          left_doctor:
            patient.Practitioners?.left_doctor &&
            patient.Practitioners.left_doctor !== "NA"
              ? patient.Practitioners.left_doctor
              : "Doctor",
          right_doctor:
            patient.Practitioners?.right_doctor &&
            patient.Practitioners.right_doctor !== "NA"
              ? patient.Practitioners.right_doctor
              : "Doctor",
          surgery_left: patient.Medical?.surgery_date_left ?? "NA",
          surgery_right: patient.Medical?.surgery_date_right ?? "NA",
          questionnaire_left: patient.Medical_Left ?? {},
          questionnaire_right: patient.Medical_Right ?? {},
          questionnaireStatusLeft: checkCompletion(patient.Medical_Left),
          questionnaireStatusRight: checkCompletion(patient.Medical_Right),
        };

        setpatientbasic(pickedData);

        console.log(
          "Fetched patient reminder data:",
          patient
        );
      } catch (err) {
        console.error("Error fetching patient reminder:", err);
      }
    };

    fetchPatientReminder();
  }, [patientReportId]);

  const [searchTermquestionnaire, setSearchTermquestionnaire] = useState("");
  const [searchTermdoctors, setSearchTermdoctors] = useState("");
  const [selected, setSelected] = useState([]);

  const questionnaires = [
    "Oxford Knee Score (OKS)",
    "Short Form - 12 (SF-12)",
    "Knee Injury and Osteoarthritis Outcome Score, Joint Replacement (KOOS, JR)",
    "Knee Society Score (KSS)",
    "Forgotten Joint Score (FJS)",
  ];

  const filteredQuestionnaires = useMemo(() => {
    return questionnaires.filter((q) =>
      q.toLowerCase().includes(searchTermquestionnaire.toLowerCase())
    );
  }, [searchTermquestionnaire, questionnaires]);

  const toggleCheckbox = (q) => {
    setSelected((prev) =>
      prev.includes(q)
        ? prev.filter((item) => item !== q)
        : [...new Set([...prev, q])]
    );
  };

  const selectAll = () => {
    setSelected((prev) => [...new Set([...prev, ...filteredQuestionnaires])]);
  };

  // ✅ clear all
  const clearAll = () => {
    setSelected([]);
  };

  const [doctor, setDoctor] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${API_URL}get_admin_doctor_page`);

        const doctors = res.data.total_doctors || [];
        const doctorPatients = doctors.map((doc, i) => ({
          name: doc.name.replace(/^Dr\.\s*/i, ""),
          uhid: doc.uhid,
        }));
        setDoctor(doctorPatients);
        console.log("✅ Fetched doctors:", doctorPatients);
      } catch (err) {
        // console.error("❌ Error fetching patients:", err);
        if (err.response) {
          setError(err.response.data.detail || "Failed to fetch patients");
        } else {
          setError("Network error");
        }
      }
    };

    fetchPatients();
  }, []);

  const [selectedDoctor, setSelectedDoctor] = useState("");

  const handleCheckboxChangedoc = (item) => {
    setSelectedDoctor(item.uhid);
  };

  const [closedocedit, setclosedocedit] = useState(false);

  const [docside, setdocSide] = useState("LEFT");

  const handleassigndoctor = async ({}) => {
    if (!patientbasic?.uhid) {
      showWarning("Patient ID not found");
      return;
    }
    if (!selectedDoctor) {
      showWarning("Please select a doctor");
      return;
    }

    const payload = {
      ...(docside === "LEFT"
        ? { doctor_left: selectedDoctor }
        : { doctor_right: selectedDoctor }),
    };

    console.log("Payload for doctor assignment:", payload);

    try {
      const res = await axios.put(
        `${API_URL}update-doctor/${patientbasic?.uhid}`,
        payload
      );
      showWarning("Doctor assigned successfully");
      window.location.reload();
    } catch (err) {
      if (err.response) {
        showWarning(err.response.data.detail || "Failed to assign doctor");
      } else {
        showWarning("Network error");
      }
    }
  };

  const hanlderemovedoctor = async ({}) => {
    if (!patientbasic?.uhid) {
      showWarning("Patient ID not found");
      return;
    }

    const payload = {
      ...(docside === "LEFT" ? { doctor_left: "NA" } : { doctor_right: "NA" }),
    };

    console.log("Payload for doctor assignment:", payload);

    try {
      const res = await axios.put(
        `${API_URL}update-doctor/${patientbasic?.uhid}`,
        payload
      );
      showWarning("Doctor removed successfully");
      window.location.reload();
    } catch (err) {
      if (err.response) {
        showWarning(err.response.data.detail || "Failed to remove doctor");
      } else {
        showWarning("Network error");
      }
    }
  };

  const [handlequestableswitch, sethandlequestableswitch] = useState("left");

  const [surgerydatleft, setsurgeryDateleft] = useState("");
  const [surgerydatright, setsurgeryDateright] = useState("");

  // ✅ Load values from patientbasic when it changes
  useEffect(() => {
    if (patientbasic) {
      setsurgeryDateleft(patientbasic.surgery_left || "");
      setsurgeryDateright(patientbasic.surgery_right || "");
    }
  }, [patientbasic]);

  const addDays = (date, days) => {
    if (!date) return "NA"; // invalid or missing date

    const result = new Date(date);
    if (isNaN(result)) return "NA"; // invalid date format

    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const QUESTIONNAIRE_NAMES = {
    OKS: "Oxford Knee Score (OKS)",
    SF12: "Short Form - 12 (SF-12)",
    KOOS_JR:
      "Knee Injury and Osteoarthritis Outcome Score, Joint Replacement (KOOS, JR)",
    KSS: "Knee Society Score (KSS)",
    FJS: "Forgotten Joint Score (FJS)",
  };

  const qNameMap = {
    "Oxford Knee Score": "OKS",
    "Short Form - 12": "SF12",
    "Knee Injury and Osteoarthritis Outcome Score, Joint Replacement":
      "KOOS_JR",
    "Knee Society Score": "KSS",
    "Forgotten Joint Score": "FJS",
  };

  const transformApiDataToStaticWithDates = (apiData, surgeryDateLeft) => {
    if (!apiData) return { periods: [], questionnaires: [] };

    const periodOffsets = [
      { key: "pre_op", label: "Pre Op", offset: -1 },
      { key: "6w", label: "6W", offset: 42 },
      { key: "3m", label: "3M", offset: 90 },
      { key: "6m", label: "6M", offset: 180 },
      { key: "1y", label: "1Y", offset: 365 },
      { key: "2y", label: "2Y", offset: 730 },
    ];

    const periods = periodOffsets.map((p) => ({
      key: p.key,
      label: p.label,
      date: addDays(surgeryDateLeft, p.offset),
    }));

    const questionnaires = Object.entries(apiData).map(([qKey, qPeriods]) => {
      const scores = {};
      const notesMap = {};

      periodOffsets.forEach((p) => {
        const periodData = qPeriods?.[p.label];

        if (!qPeriods?.[p.label]) {
          // Period itself not present
          scores[p.key] = "-";
          notesMap[p.key] = "-";
        } else if (periodData && !periodData.score) {
          // Period exists but score missing
          scores[p.key] = "NA";

          // Notes
          const [first, second, third, fourth] = periodData.other_notes || [];
          const filtered = [];
          if (first === "No") filtered.push(first);
          if (third === "No") filtered.push(third);
          notesMap[p.key] = filtered.length ? filtered.join(", ") : "NA";
        } else {
          // Period exists and score exists
          const match = periodData.score.match(/:\s*(\d+)/);
          scores[p.key] = match ? match[1] : "NA";

          const [first, second, third, fourth] = periodData.other_notes || [];
          const filtered = [];
          if (first === "No") filtered.push(first);
          if (third === "No") filtered.push(third);
          notesMap[p.key] = filtered.length ? filtered.join(", ") : "NA";
        }
      });

      const fullName = QUESTIONNAIRE_NAMES[qKey] || qKey;

      return { name: fullName, scores, notesMap };
    });

    return { periods, questionnaires };
  };

  // Usage
  const staticLeft = surgerydatleft
    ? transformApiDataToStaticWithDates(
        patientbasic?.questionnaire_left,
        surgerydatleft
      )
    : { periods: [], questionnaires: [] };
  const staticRight = surgerydatright
    ? transformApiDataToStaticWithDates(
        patientbasic?.questionnaire_right,
        surgerydatright
      )
    : { periods: [], questionnaires: [] };
  console.log(staticLeft);

  const questionnaireData =
    handlequestableswitch === "left" ? staticLeft : staticRight;

  // const questionnaireData = {
  //   periods: [
  //     { key: "pre_op", label: "Pre Op", date: "10 July 2025" },
  //     { key: "6w", label: "6W", date: "20 Aug 2025" },
  //     { key: "3m", label: "3M", date: "15 Sep 2025" },
  //     { key: "6m", label: "6M", date: "01 Nov 2025" },
  //     { key: "1y", label: "1Y", date: "10 Jan 2026" },
  //     { key: "2y", label: "2Y", date: "30 May 2027" },
  //   ],
  //   questionnaires: [
  //     {
  //       name: "Oxford Knee Score",
  //       scores: {
  //         pre_op: "82",
  //         "6w": "77",
  //         "3m": "58",
  //         "6m": "35",
  //         "1y": "N/A",
  //         "2y": "",
  //       },
  //     },
  //     {
  //       name: "KOOS, JR",
  //       scores: {}, // No data
  //     },
  //     {
  //       name: "FJS",
  //       scores: {
  //         pre_op: "50",
  //         "6w": "42",
  //         "3m": "",
  //         "6m": "N/A",
  //         "1y": "66",
  //         "2y": "30",
  //       },
  //     },
  //     {
  //       name: "FJS",
  //       scores: {
  //         pre_op: "50",
  //         "6w": "42",
  //         "3m": "",
  //         "6m": "N/A",
  //         "1y": "66",
  //         "2y": "30",
  //       },
  //     },
  //     {
  //       name: "FJS",
  //       scores: {
  //         pre_op: "50",
  //         "6w": "42",
  //         "3m": "",
  //         "6m": "N/A",
  //         "1y": "66",
  //         "2y": "30",
  //       },
  //     },
  //   ],
  // };

  function getTextColor(score) {
    if (score === null || score === undefined || isNaN(score)) return "#9CA3AF"; // gray for missing

    const percent = Math.max(0, Math.min(100, score)) / 100;

    // From red (low) to green (high), via orange/yellow
    const r = Math.round(255 * (1 - percent));
    const g = Math.round(150 + 105 * percent); // start at 150 to get orange/yellow in middle
    const b = 0;

    return `rgb(${r}, ${g}, ${b})`;
  }

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  // Convert RGB back to hex
  const rgbToHex = (r, g, b) =>
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

  // Interpolate between two colors
  const interpolateColor = (color1, color2, factor) => {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    return rgbToHex(
      Math.round(r1 + factor * (r2 - r1)),
      Math.round(g1 + factor * (g2 - g1)),
      Math.round(b1 + factor * (b2 - b1))
    );
  };

  // Continuous BMI Heatmap
  const getBMIColor = (bmi) => {
    if (!bmi) return "#6B7280"; // default gray

    const stops = [
      { value: 15, color: "#3B82F6" }, // blue
      { value: 22, color: "#22C55E" }, // green
      { value: 28, color: "#EAB308" }, // yellow
      { value: 35, color: "#EF4444" }, // red
    ];

    // Clamp BMI
    if (bmi <= stops[0].value) return stops[0].color;
    if (bmi >= stops[stops.length - 1].value)
      return stops[stops.length - 1].color;

    // Find between which stops BMI lies
    for (let i = 0; i < stops.length - 1; i++) {
      const curr = stops[i],
        next = stops[i + 1];
      if (bmi >= curr.value && bmi <= next.value) {
        const factor = (bmi - curr.value) / (next.value - curr.value);
        return interpolateColor(curr.color, next.color, factor);
      }
    }
  };

  const getDoctorNameByUhid = (uhid) => {
    if (!uhid) return "Doctor";
    const doc = doctor.find((d) => d.uhid === uhid);
    if (!doc) return "Doctor";
    return doc.name.startsWith("Dr.") ? doc.name : `Dr. ${doc.name}`;
  };

  const handleManualsurgeryDateChangeleft = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove all non-digits

    if (value.length >= 3 && value.length <= 4) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    } else if (value.length > 4 && value.length <= 8) {
      value =
        value.slice(0, 2) + "-" + value.slice(2, 4) + "-" + value.slice(4);
    } else if (value.length > 8) {
      value = value.slice(0, 8);
      value =
        value.slice(0, 2) + "-" + value.slice(2, 4) + "-" + value.slice(4);
    }

    // Until full date entered, show raw value
    setsurgeryDateleft(value);

    if (value.length === 10) {
      const [dayStr, monthStr, yearStr] = value.split("-");
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      const today = new Date();
      const currentYear = today.getFullYear();

      // Basic validations
      if (day < 1 || day > 31 || month < 1 || month > 12) {
        showWarning("Please enter a valid surgery date");
        setS("");
        return;
      }

      // Check valid real date
      const manualDate = new Date(`${year}-${month}-${day}`);
      if (
        manualDate.getDate() !== day ||
        manualDate.getMonth() + 1 !== month ||
        manualDate.getFullYear() !== year
      ) {
        showWarning("Invalid date combination. Please enter a correct date.");
        setsurgeryDateleft("");
        return;
      }

      // 🚨 Past date check
      if (manualDate < today) {
        showWarning("Past dates are not allowed");
        setsurgeryDateleft("");
        return;
      }

      // Check if future or today
      today.setHours(0, 0, 0, 0);
      manualDate.setHours(0, 0, 0, 0);

      // If all valid, format as "dd Mmm yyyy"
      const formattedDate = manualDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      });

      // Final validated date components
      const isoDate = `${year.toString().padStart(4, "0")}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      setsurgeryDateleft(isoDate); // This avoids time zone issues
    }
  };

  const handleManualsurgeryDateChangeright = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove all non-digits

    if (value.length >= 3 && value.length <= 4) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    } else if (value.length > 4 && value.length <= 8) {
      value =
        value.slice(0, 2) + "-" + value.slice(2, 4) + "-" + value.slice(4);
    } else if (value.length > 8) {
      value = value.slice(0, 8);
      value =
        value.slice(0, 2) + "-" + value.slice(2, 4) + "-" + value.slice(4);
    }

    // Until full date entered, show raw value
    setsurgeryDateright(value);

    if (value.length === 10) {
      const [dayStr, monthStr, yearStr] = value.split("-");
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      const today = new Date();
      const currentYear = today.getFullYear();

      // Basic validations
      if (day < 1 || day > 31 || month < 1 || month > 12) {
        showWarning("Please enter a valid surgery date");
        setS("");
        return;
      }

      // Check valid real date
      const manualDate = new Date(`${year}-${month}-${day}`);
      if (
        manualDate.getDate() !== day ||
        manualDate.getMonth() + 1 !== month ||
        manualDate.getFullYear() !== year
      ) {
        showWarning("Invalid date combination. Please enter a correct date.");
        setsurgeryDateright("");
        return;
      }

      // 🚨 Past date check
      if (manualDate < today) {
        showWarning("Past dates are not allowed");
        setsurgeryDateright("");
        return;
      }

      // Check if future or today
      today.setHours(0, 0, 0, 0);
      manualDate.setHours(0, 0, 0, 0);

      // If all valid, format as "dd Mmm yyyy"
      const formattedDate = manualDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      });

      // Final validated date components
      const isoDate = `${year.toString().padStart(4, "0")}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      setsurgeryDateright(isoDate); // This avoids time zone issues
    }
  };

  const handleschedulesurgery = async () => {
    if (!surgerydatleft && !surgerydatright) {
      showWarning("Surgery Date is required");
    }

    const payload = {
      ...(surgerydatleft && { surgery_date_left: surgerydatleft }),
      ...(surgerydatright && { surgery_date_right: surgerydatright }),
    };

    console.log("Payload for surgery schedule:", payload);

    try {
      const res = await axios.put(
        `${API_URL}patients/update/${patientbasic?.uhid}`,
        payload
      );
      showWarning("Surgery Scheduled successfully");
      window.location.reload();
    } catch (err) {
      if (err.response) {
        showWarning(err.response.data.detail || "Failed to schedule surgery");
      } else {
        showWarning("Network error");
      }
    }
  };

  const handleassignquestionnaires = async () => {
    if (!patientbasic || selected.length === 0) {
      showWarning("Patient ID not found");
      return;
    }
    if (!surgerydatleft && !surgerydatright) {
      showWarning("No surgery date found for either side.");
      return;
    }
    const uhid = patientbasic.uhid;
    const sides = [];

    if (
      surgerydatleft &&
      surgerydatleft !== "NA" &&
      patientbasic?.questionnaireStatusLeft !== "Completed"
    ) {
      sides.push({ side: "left", surgeryDate: surgerydatleft });
    }
    if (
      surgerydatright &&
      surgerydatright !== "NA" &&
      patientbasic?.questionnaireStatusRight !== "Completed"
    ) {
      sides.push({ side: "right", surgeryDate: surgerydatright });
    }

    const periods = [
      { label: "Pre Op", days: 0, isPreOp: true },
      { label: "6W", days: 42 },
      { label: "3M", days: 90 },
      { label: "6M", days: 180 },
      { label: "1Y", days: 365 },
      { label: "2Y", days: 730 },
    ];

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const payload = [];

    sides.forEach(({ side, surgeryDate }) => {
      const [syear, smonth, sday] = surgeryDate.split("-");
      const surgery = new Date(syear, parseInt(smonth) - 1, sday);
      const today = new Date();

      periods.forEach((p) => {
        let assignedDate, deadline;

        if (p.isPreOp) {
          // Pre Op: assigned_date = today or surgeryDate-14 if today > surgery
          assignedDate =
            today > surgery
              ? new Date(
                  surgery.getFullYear(),
                  surgery.getMonth(),
                  surgery.getDate() - 14
                )
              : today;

          // Pre Op deadline = surgeryDate -1
          deadline = new Date(surgery);
          deadline.setDate(deadline.getDate() - 1);
        } else {
          assignedDate = new Date(surgery);
          assignedDate.setDate(assignedDate.getDate() + p.days);
          deadline = new Date(assignedDate);
          deadline.setDate(deadline.getDate() + 14);
        }

        selected.forEach((name) => {
          payload.push({
            uhid,
            side,
            name,
            period: p.label,
            assigned_date: formatDate(assignedDate),
            deadline: formatDate(deadline),
            completed: 0,
          });
        });
      });
    });

    console.log("Questionnaires", payload);

    try {
      const res = await axios.post(
        `${API_URL}assign-questionnaire-bulk`,
        payload
      );
      showWarning("Questionnaire Assigned Successfully");
      handleSendremainder();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showWarning(error.response?.data || error.message);
      } else {
        showWarning(error);
      }
    }
  };

  const [resetperiod, setrestperiod] = useState("");

  const handleMinusClick = ({ period }) => {
    if (!patientbasic?.uhid) {
      showWarning("Patient ID not found");
      return;
    }

    if (!handlequestableswitch) {
      showWarning("Reset Side not found");
      return;
    }

    if (!period) {
      showWarning("Reset Period not found");
      return;
    }
    setrestperiod(period);
    setresetconfirm(true);
  };

  const handleresetquestionnaire = async () => {
    if (!patientbasic?.uhid) {
      showWarning("Patient ID not found");
      return;
    }

    if (!handlequestableswitch) {
      showWarning("Reset Side not found");
      return;
    }

    if (!resetperiod) {
      showWarning("Reset Period not found");
      return;
    }

    const payload = {
      patient_id: patientbasic?.uhid,
      side: handlequestableswitch,
      period: resetperiod,
    };

    console.log("Payload for reset questionnaire:", payload);

    try {
      const res = await axios.put(`${API_URL}reset_questionnaires`, payload);
      showWarning("Questionnaire Reset Successful");
      window.location.reload();
    } catch (err) {
      if (err.response) {
        showWarning(err.response.data.detail || "Failed to reset questionnaires");
      } else {
        showWarning("Network error");
      }
    }
  };

  const handleBinClick = ({ period }) => {
    if (!patientbasic?.uhid) {
      showWarning("Patient ID not found");
      return;
    }

    if (!handlequestableswitch) {
      showWarning("Reset Side not found");
      return;
    }

    if (!period) {
      showWarning("Reset Period not found");
      return;
    }
    setrestperiod(period);
    setdeleteconfirm(true);
  };

  const handledeletequestionnaire = async () => {
    if (!patientbasic?.uhid) {
      showWarning("Patient ID not found");
      return;
    }

    if (!handlequestableswitch) {
      showWarning("Reset Side not found");
      return;
    }

    if (!resetperiod) {
      showWarning("Reset Period not found");
      return;
    }

    const payload = {
      patient_id: patientbasic?.uhid,
      side: handlequestableswitch,
      period: resetperiod,
    };

    console.log("Payload for reset questionnaire:", payload);

    try {
      const res = await axios.delete(
        `${API_URL}delete-questionnaires`,
        {data: payload}
      );
      showWarning("Questionnaire Delete Successful");
      window.location.reload();
    } catch (err) {
      if (err.response) {
        showWarning(err.response.data.message || "Failed to delete questionnaire");
      } else {
        showWarning("Network error");
      }
    }
  };

  const handleSendremainder = async () => {
    if (!patientbasic?.email) {
      showWarning("Patient email is missing.");
      return;
    }

    try {
      const res = await fetch(API_URL + "send/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: patientbasic?.name,
          email: patientbasic?.email,
          subject: "New Questionnaire Assigned",
          message:
            "This is a kind reminder regarding your pending health questionnaire(s). Completing these forms helps us track your recovery and provide better care.",
        }),
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: "Invalid JSON response", raw: text };
      }

      // console.log("Email send response:", data);
      sendwhatsapp();

      if (!res.ok) {
        showWarning("Failed to send email.");

        return;
      }

      // alert("✅ Email sent (check console for details)");
      showWarning("✅ Email sent Successfull");
      // sendRealTimeMessage();
    } catch (error) {
      showWarning("Failed to send email.");
    }
  };

  const sendwhatsapp = async () => {
    console.log(
      "Whatsapp contact",
      JSON.stringify({
        user_name: patientbasic?.name,
        phone_number: "+91" + patientbasic?.phone,
        message: "",
        flag: 1,
      })
    );

    // return;

    const res = await fetch(API_URL + "send-whatsapp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: patientbasic?.name,
        phone_number: "+91" + patientbasic?.phone,
        message: "",
        flag: 1,
      }),
    });

    let data;
    const text = await res.text();
    try {
      data = JSON.parse(text);
      window.location.reload();
    } catch {
      data = { error: "Invalid JSON response", raw: text };
    }
  };

  const [resetconfirm, setresetconfirm] = useState(false);
  const [deleteconfirm, setdeleteconfirm] = useState(false);

  return (
    <div
      className={`w-full flex rounded-4xl ${
        width >= 1000
          ? "flex-row overflow-y-auto h-full"
          : "flex-col pb-4 h-full overflow-y-auto"
      } ${width < 1300 ? "h-full overflow-y-auto" : "h-[90%] "}`}
    >
      <div
        className={` ${width >= 1000 ? "w-1/5 pt-8 pb-2 " : "w-full"} ${
          width < 1000 ? "min-h-screen" : "h-full"
        }`}
      >
        <div
          className={`w-full h-full  flex  ${
            width >= 1000
              ? "border-gray-300 border-r-2 flex-col"
              : width >= 400 && width < 1000
              ? "flex-row gap-2"
              : "flex-col"
          }`}
        >
          <div
            className={`w-full flex flex-col gap-4 ${
              width >= 1000
                ? "h-full"
                : width >= 400 && width < 1000
                ? "h-full py-2"
                : "h-full py-4"
            }`}
          >
            <div className="flex flex-col w-full h-1/2 gap-10 pt-4">
              <div className="flex flex-col px-4 gap-4  w-full">
                <div className={`w-full flex flex-col`}>
                  <p
                    className={`${inter.className} font-bold text-[22px] text-black`}
                  >
                    {patientbasic?.name || "Patient Name"}
                  </p>
                  <p
                    className={`${inter.className} font-semibold text-sm text-black`}
                  >
                    {patientbasic?.age || "Age"},{" "}
                    {patientbasic?.gender?.toUpperCase() || "Gender"}
                  </p>
                </div>
                <p
                  className={`${inter.className} font-semibold text-sm text-black`}
                >
                  UHID - {patientbasic.uhid || "N/A"}
                </p>
                <p
                  className={`${inter.className} font-semibold text-sm text-black`}
                >
                  Left : {patientbasic?.leftPreop || "Pre OP"}
                </p>
                <p
                  className={`${inter.className} font-semibold text-sm text-black`}
                >
                  Right : {patientbasic?.rightPreop || "Pre OP"}
                </p>
              </div>
              <div
                className={`w-6/7 ${inter.className} font-semibold text-lg text-white rounded-r-full px-4`}
                style={{ backgroundColor: getBMIColor(patientbasic?.bmi) }}
              >
                BMI {patientbasic?.bmi || "0.00"}
              </div>
            </div>

            <div
              className={`w-full h-1/2 flex flex-col gap-8 px-4 pt-2 ${inter.className} font-semibold text-white text-sm  border-[#CED5D7] border-t-2`}
            >
              <p
                className={`${inter.className} font-semibold text-sm text-black text-center`}
              >
                RECORDS
              </p>

              <div className={`flex flex-col w-full items-end gap-4`}>
                <p
                  className={`${inter.className} font-semibold text-white text-sm bg-[#44A194] rounded-lg px-3 py-0.5 text-center w-fit`}
                >
                  COMPLETED {patientbasic?.leftCompleted ?? "N/A"}
                </p>
                <p
                  className={`${inter.className} font-semibold text-black text-sm bg-[#C8D5D7] rounded-lg px-3 py-0.5 text-center w-fit`}
                >
                  PENDING {patientbasic?.leftPending ?? "N/A"}
                </p>
                <p
                  className={`${inter.className} font-semibold text-black text-sm text-center w-fit`}
                >
                  LEFT LEG
                </p>
              </div>

              <div className={`flex flex-col w-full items-end gap-4`}>
                <p
                  className={`${inter.className} font-semibold text-white text-sm bg-[#44A194] rounded-lg px-3 py-0.5 text-center w-fit`}
                >
                  COMPLETED {patientbasic?.rightCompleted ?? "N/A"}
                </p>
                <p
                  className={`${inter.className} font-semibold text-black text-sm bg-[#C8D5D7] rounded-lg px-3 py-0.5 text-center w-fit`}
                >
                  PENDING {patientbasic?.rightPending ?? "N/A"}
                </p>
                <p
                  className={`${inter.className} font-semibold text-black text-sm text-center w-fit`}
                >
                  RIGHT LEG
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={` flex rounded-4xl ${
          width >= 1000
            ? "flex-row w-4/5 h-full"
            : "flex-col w-full pt-4 h-full"
        }`}
      >
        <div
          className={`flex flex-col  px-2 p-2 gap-3 ${
            width >= 1000 ? "w-full h-full overflow-y-auto" : "w-full h-fit"
          }`}
        >
          <div
            className={`w-full flex flex-col gap-2 ${
              width < 1300 ? "h-[800px]" : ""
            }`}
          >
            <div
              className={`w-full flex  ${
                width >= 500
                  ? "flex-row justify-between"
                  : "flex-col items-center gap-6"
              }`}
            >
              <div
                className={`flex flex-row gap-4 items-center justify-end ${
                  width >= 500 ? "w-1/6" : " w-full"
                }`}
              >
                <button
                  className={`${
                    raleway.className
                  } text-sm px-4 py-[0.5px] w-1/2 rounded-lg font-semibold   ${
                    !surgerydatleft || surgerydatleft === "NA"
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                  ${
                    handlequestableswitch === "left"
                      ? "bg-[#2B333E] text-white"
                      : "bg-[#CAD9D6] text-black"
                  }
                  `}
                  onClick={
                    !surgerydatleft || surgerydatleft === "NA"
                      ? undefined
                      : () => {
                          sethandlequestableswitch("left");
                        }
                  }
                >
                  Left
                </button>
                <button
                  className={`${
                    raleway.className
                  } text-sm px-4 py-[0.5px] w-1/2 rounded-lg font-semibold   ${
                    !surgerydatright || surgerydatright === "NA"
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                  ${
                    handlequestableswitch === "right"
                      ? "bg-[#2B333E] text-white"
                      : "bg-[#CAD9D6] text-black"
                  }`}
                  onClick={
                    !surgerydatright || surgerydatright === "NA"
                      ? undefined
                      : () => {
                          sethandlequestableswitch("right");
                        }
                  }
                >
                  Right
                </button>
              </div>
              <Image src={Heatmap} alt="heatmap" />
            </div>
            <div className="bg-white rounded-2xl px-2 py-1 flex flex-col gap-4 shadow-lg h-full w-full">
              <div className="w-full overflow-x-auto h-full overflow-y-auto">
                <table className="min-w-full table-fixed border-separate border-spacing-y-1">
                  <thead className="text-[#475467] text-[16px] font-medium text-center">
                    <tr className="rounded-2xl">
                      <th
                        className={`${inter.className} font-bold text-white text-sm px-2 py-1 bg-gray-900 rounded-tl-2xl text-center whitespace-nowrap w-3/5`}
                      >
                        <div className="flex flex-row justify-center items-center gap-4">
                          <p>Questionnaire</p>
                        </div>
                      </th>
                      {questionnaireData.periods.map((period, idx) => (
                        <th
                          key={period.key}
                          className={`px-4 py-3  bg-gray-900 text-center whitespace-nowrap ${
                            idx === questionnaireData.periods.length - 1
                              ? "rounded-tr-2xl"
                              : ""
                          }`}
                        >
                          <div className="flex flex-row items-center gap-1 w-full">
                            <div className="w-fit">
                              <span
                                className={`${inter.className} font-bold text-white`}
                              >
                                <Image
                                  src={Delete}
                                  alt="reset"
                                  className="w-8 h-5 max-w-[22px] min-h-[20px] font-bold cursor-pointer"
                                  onClick={() =>
                                    handleBinClick({ period: period.label })
                                  }
                                />
                              </span>
                            </div>
                            <div className={`w-fit flex flex-col`}>
                              <span
                                className={`${inter.className} text-[15px]  text-white font-bold`}
                              >
                                {period.label}
                              </span>
                              <span
                                className={`${inter.className} text-[10px]  text-white font-semibold`}
                              >
                                {period.date}
                              </span>
                            </div>
                            <div className={`w-fit`}>
                              <span className="text-[#475467]">
                                <Image
                                  src={Reset}
                                  alt="reset"
                                  className="w-8 h-5 max-w-[22px] min-h-[20px] font-bold cursor-pointer"
                                  onClick={() =>
                                    handleMinusClick({ period: period.label })
                                  }
                                />
                              </span>
                            </div>

                            {/* <div
                                className={`${inter.className} font-bold text-white text-sm flex items-center justify-between gap-2 w-full`}
                              >
                                {" "}
                              </div> */}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white text-[13px]">
                    {questionnaireData.questionnaires.map((q, index) => (
                      <tr key={index} className="">
                        <td
                          className={`${raleway.className} font-semibold px-4 py-2 text-[#1F2937]`}
                        >
                          {q.name}
                        </td>

                        {Object.keys(q.scores || {}).length > 0 ? (
                          questionnaireData.periods.map((period) => {
                            const score = q.scores?.[period.key];
                            const color = getTextColor(Number(score));

                            return (
                              <td
                                key={period.key}
                                className={`px-4 py-2 font-bold text-center align-middle ${
                                  q.notesMap[period.key] &&
                                  q.notesMap[period.key] !== "NA"
                                    ? "cursor-pointer"
                                    : ""
                                }`}
                                style={{ color }}
                                title={
                                  q.notesMap[period.key] &&
                                  q.notesMap[period.key] !== "NA"
                                    ? q.notesMap[period.key]
                                    : undefined
                                } // Hover text
                              >
                                {score || "—"}
                              </td>
                            );
                          })
                        ) : (
                          <td
                            colSpan={6}
                            className={`${inter.className} font-bold text-[13px] px-4 py-4 text-center text-[#3b3b3b]`}
                          >
                            No questionnaires assigned
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            className={`w-full flex gap-2 ${
              width < 1300 ? "flex-col h-full" : "flex-row h-full"
            }`}
          >
            <div
              className={`bg-white rounded-lg p-2 ${
                width < 1300 ? "w-full h-full" : "w-3/7 h-96"
              }`}
            >
              <div
                className={`bg-[#44A194] shadow-lg rounded-lg px-4 py-2 flex flex-col mr-1 justify-between w-full ${
                  width < 1300 ? "h-full" : "h-full"
                } gap-4`}
              >
                <h2
                  className={` ${raleway.className} text-end font-bold text-white text-lg h-[10%]`}
                >
                  ASSIGN QUESTIONNAIRES
                </h2>
                <div className="w-full h-[90%] flex flex-col justify-between gap-4">
                  <div
                    className={`w-full h-[10%] flex ${
                      width >= 500 ? "flex-row" : "flex-col gap-4"
                    }`}
                  >
                    <div
                      className={`${
                        width >= 500 ? "w-3/4" : "w-full"
                      } flex flex-row gap-4`}
                    >
                      <div className="w-full flex flex-row items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-lg bg-white/20 ">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTermquestionnaire}
                          onChange={(e) =>
                            setSearchTermquestionnaire(e.target.value)
                          }
                          className={`${raleway.className} font-semibold text-xs w-full bg-transparent text-white placeholder-white outline-none`}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={` ${raleway.className} font-semibold w-full flex flex-row overflow-y-auto rounded-md h-4/5`}
                  >
                    <div className="flex flex-col w-2/3 overflow-y-auto gap-2 h-full">
                      {filteredQuestionnaires.length > 0 ? (
                        filteredQuestionnaires.map((q, index) => (
                          <label
                            key={index}
                            className="flex items-center gap-2 px-4 py-1 text-sm text-white cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="accent-[#D9D9D9]"
                              checked={selected.includes(q)}
                              onChange={() => toggleCheckbox(q)}
                            />
                            {q}
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-gray-300 px-4">
                          No matches found
                        </p>
                      )}
                    </div>

                    <div
                      className={`${raleway.className} font-bold w-1/3 flex flex-col justify-start items-center gap-4`}
                    >
                      <span
                        className={`w-fit text-center text-sm font-bold text-white rounded-[5px] px-5 py-0.5 ${
                          !surgerydatleft || surgerydatleft === "NA"
                            ? "bg-black opacity-30"
                            : patientbasic?.questionnaireStatusLeft ===
                              "Completed"
                            ? "bg-black opacity-50"
                            : "bg-[#E49235]"
                        }`}
                      >
                        Left
                      </span>

                      <span
                        className={`w-fit text-center text-sm font-bold text-white rounded-[5px] px-4 py-0.5 ${
                          !surgerydatright || surgerydatright === "NA"
                            ? "bg-black opacity-30"
                            : patientbasic?.questionnaireStatusRight ===
                              "Completed"
                            ? "bg-black opacity-50"
                            : "bg-[#E49235]"
                        }`}
                      >
                        Right
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-full h-fit flex flex-wrap ${
                      width >= 500 ? "flex-row gap-y-0" : "flex-col gap-4"
                    } justify-center items-center `}
                  >
                    <div
                      className={`${
                        width >= 500 ? "w-2/3" : "w-full"
                      } flex flex-row`}
                    >
                      <div className="w-1/2 flex justify-center md:justify-between items-center">
                        <p
                          className={` ${raleway.className} font-semibold italic text-white text-xs cursor-pointer`}
                          onClick={clearAll}
                        >
                          CLEAR ALL
                        </p>
                      </div>

                      <div className="w-1/2 flex justify-center items-center">
                        <p
                          className={` ${raleway.className} font-semibold italic text-white text-xs cursor-pointer`}
                          onClick={selectAll}
                        >
                          SELECT ALL
                        </p>
                      </div>
                    </div>

                    <div
                      className={`${
                        width >= 500
                          ? "w-1/3 justify-end"
                          : "w-full justify-center"
                      } flex  items-center`}
                    >
                      <p
                        className={` ${raleway.className} ${
                          selected.length !== 0 &&
                          ((surgerydatleft &&
                            surgerydatleft !== "NA" &&
                            patientbasic?.questionnaireStatusLeft !==
                              "Completed") ||
                            (surgerydatright &&
                              surgerydatright !== "NA" &&
                              patientbasic?.questionnaireStatusRight !==
                                "Completed"))
                            ? "cursor-pointer bg-black"
                            : "cursor-not-allowed opacity-50 bg-black"
                        } font-extrabold rounded-lg px-8 py-2 text-center text-white text-xs`}
                        onClick={() => {
                          if (
                            selected.length !== 0 &&
                            ((surgerydatleft &&
                              surgerydatleft !== "NA" &&
                              patientbasic?.questionnaireStatusLeft !==
                                "Completed") ||
                              (surgerydatright &&
                                surgerydatright !== "NA" &&
                                patientbasic?.questionnaireStatusRight !==
                                  "Completed"))
                          ) {
                            handleassignquestionnaires();
                          }
                        }}
                      >
                        ASSIGN
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={` flex  gap-2 ${
                width < 1300 ? "w-full h-full" : "w-4/7"
              } ${width >= 700 ? "flex-row" : "flex-col"}`}
            >
              {closedocedit ? (
                <div
                  className={` bg-white rounded-lg px-2 pt-2 flex flex-col gap-2 ${
                    width < 1300 && width >= 700
                      ? "h-full"
                      : width > 1300
                      ? ""
                      : "h-full"
                  } ${width >= 700 ? "w-1/2" : "w-full"}`}
                >
                  <div
                    className={`${
                      width < 700 ? "h-1/7" : "h-1/11"
                    } w-full flex flex-row items-center`}
                  >
                    <div className={`w-5/6 px-3 py-1 rounded-lg  bg-[#F2F2F2]`}>
                      <input
                        type="text"
                        placeholder="Search Doctor..."
                        value={searchTermdoctors}
                        onChange={(e) => setSearchTermdoctors(e.target.value)}
                        className={`${raleway.className} font-semibold text-xs w-full bg-transparent text-black placeholder-black outline-none`}
                      />
                    </div>
                    <div className={`w-1/6 flex items-end justify-end`}>
                      <XMarkIcon
                        className={`w-6 h-6 text-black cursor-pointer`}
                        onClick={() => {
                          setclosedocedit(false);
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className={`${
                      width < 700 ? "h-5/7" : "h-8/11"
                    } flex flex-wrap gap-2`}
                  >
                    {doctor
                      .filter((item) =>
                        item.name
                          .toLowerCase()
                          .includes(searchTermdoctors.toLowerCase())
                      )
                      .map((item, index) => {
                        const isSelected = selectedDoctor === item.uhid; // compare by uhid

                        // Ensure "Dr." prefix
                        const displayName = item.name.startsWith("Dr.")
                          ? item.name
                          : `Dr. ${item.name}`;

                        return (
                          <label
                            key={item.uhid || index}
                            onClick={() => handleCheckboxChangedoc(item)}
                            className={`${
                              raleway.className
                            } font-semibold flex items-center gap-2 justify-center px-3 py-1 text-sm text-black cursor-pointer hover:bg-gray-50 flex-shrink-0 max-w-fit ${
                              isSelected ? "bg-gray-100" : ""
                            }`}
                          >
                            <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center border-[#44A194] mt-1">
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-[#44A194]" />
                              )}
                            </div>
                            <span>{displayName}</span>
                          </label>
                        );
                      })}
                  </div>

                  <div
                    className={`${
                      width < 700 ? "h-1/7" : "h-2/11"
                    } w-full flex flex-row justify-between items-center`}
                  >
                    <p
                      className={` ${
                        raleway.className
                      } font-extrabold rounded-lg px-8 py-2 text-center text-white text-xs bg-black 
                        ${
                          docside === "LEFT"
                            ? patientbasic.left_doctor &&
                              patientbasic.left_doctor !== "Doctor"
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                            : patientbasic.right_doctor &&
                              patientbasic.right_doctor !== "Doctor"
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }
                      `}
                      onClick={
                        docside === "LEFT"
                          ? patientbasic.left_doctor &&
                            patientbasic.left_doctor !== "Doctor"
                            ? hanlderemovedoctor
                            : undefined
                          : patientbasic.right_doctor &&
                            patientbasic.right_doctor !== "Doctor"
                          ? hanlderemovedoctor
                          : undefined
                      }
                    >
                      REMOVE DOCTOR
                    </p>

                    <p
                      className={` ${raleway.className} font-extrabold rounded-lg px-8 py-2 cursor-pointer text-center text-white text-xs bg-black`}
                      onClick={handleassigndoctor}
                    >
                      ASSIGN
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={` rounded-lg p-2 bg-white ${
                    width < 1300 && width >= 700
                      ? "h-full"
                      : width > 1300
                      ? "h-full"
                      : "h-full"
                  } ${width >= 700 ? "w-1/2" : "w-full"}`}
                >
                  <div
                    className={`relative rounded-lg overflow-hidden ${
                      width < 1300 && width >= 700
                        ? "h-full"
                        : width > 1300
                        ? "h-full"
                        : "h-full"
                    } ${width >= 700 ? "w-full" : "w-full"}`}
                  >
                    {/* Background Image */}
                    <Image
                      src={Doctorassign} // Replace with actual image path
                      alt="Doctor"
                      className="w-full h-full object-cover"
                    />

                    {/* LEFT / RIGHT Tag */}
                    <div className="flex items-center space-x-1">
                      <div className="absolute top-3 left-3 bg-white bg-opacity-60 backdrop-blur-md rounded-lg flex space-x-1">
                        <button
                          onClick={() => setdocSide("LEFT")}
                          className={`${
                            raleway.className
                          } px-4 py-1 text-sm font-semibold rounded-lg cursor-pointer ${
                            docside === "LEFT"
                              ? "bg-gray-800 text-white"
                              : "text-gray-800"
                          }`}
                        >
                          LEFT
                        </button>
                        <button
                          onClick={() => setdocSide("RIGHT")}
                          className={`${
                            raleway.className
                          } px-4 py-1 text-sm font-semibold rounded-lg cursor-pointer ${
                            docside === "RIGHT"
                              ? "bg-gray-800 text-white"
                              : "text-gray-800"
                          }`}
                        >
                          RIGHT
                        </button>
                      </div>
                    </div>

                    {/* Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 rounded-b-lg w-full bg-black/50 backdrop-blur-none text-white py-2 px-3 flex items-center justify-between">
                      <div>
                        <p
                          className={`${inter.className} text-xl text-white font-bold`}
                        >
                          {docside === "LEFT"
                            ? getDoctorNameByUhid(patientbasic.left_doctor)
                            : getDoctorNameByUhid(patientbasic.right_doctor)}
                        </p>
                        <p
                          className={`${inter.className} text-[8px] text-white font-semibold`}
                        >
                          {docside === "LEFT"
                            ? patientbasic.left_doctor !== "Doctor"
                              ? "CURRENTLY ASSIGNED"
                              : "NOT ASSIGNED"
                            : patientbasic.right_doctor !== "Doctor"
                            ? "CURRENTLY ASSIGNED"
                            : "NOT ASSIGNED"}
                        </p>
                      </div>
                      <div>
                        <Image
                          src={Doctorassigedit} // Replace with actual image path
                          alt="Doctor"
                          className="w-8 h-8 object-cover cursor-pointer"
                          onClick={() => {
                            setclosedocedit(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`w-1/2 bg-white rounded-lg px-4 py-2 flex flex-col gap-2 ${
                  width < 1300 && width >= 700 ? "h-full" : ""
                } ${width >= 700 ? "w-1/2 h-3/4" : "w-full h-[400px]"}`}
              >
                <div
                  className={`${
                    width < 700 ? "h-full" : "h-1/7"
                  } w-full flex items-center`}
                >
                  <p
                    className={` ${raleway.className} font-bold text-[#29272A] text-lg`}
                  >
                    SCHEDULE SURGERY
                  </p>
                </div>
                <div
                  className={`w-6/7 ${
                    width < 700 ? "h-full" : "h-2/7"
                  } flex flex-row gap-2 justify-center items-center`}
                >
                  <Image src={Calendar} alt="Left date" />
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="LEFT (dd-mm-yyyy) *"
                      className={` ${inter.className} w-full h-fit text-black py-3 px-4 placeholder-[#30263B] rounded-sm text-sm font-medium outline-none`}
                      maxLength={10}
                      value={surgerydatleft}
                      onChange={handleManualsurgeryDateChangeleft}
                      style={{
                        backgroundColor: "rgba(217, 217, 217, 0.5)",
                      }}
                    />
                    <span
                      className={`absolute right-2 top-1/2 -translate-y-1/2 font-bold ${(() => {
                        if (!surgerydatleft) return "text-red-600"; // empty → red
                        const [day, month, year] = surgerydatleft.split("-");
                        const inputDate = new Date(
                          `${year}-${month}-${day}T00:00:00`
                        );
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // normalize
                        inputDate.setHours(0, 0, 0, 0);
                        return inputDate < today
                          ? "text-green-700"
                          : "text-red-600";
                      })()}`}
                    >
                      L
                    </span>
                  </div>
                </div>
                <div
                  className={`w-6/7 ${
                    width < 700 ? "h-full" : "h-3/7"
                  } flex flex-row gap-2 justify-center items-center`}
                >
                  <Image src={Calendar} alt="Right date" />
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="RIGHT (dd-mm-yyyy) *"
                      value={surgerydatright}
                      onChange={handleManualsurgeryDateChangeright}
                      className={` ${inter.className} w-full h-fit text-black py-3 px-4 placeholder-[#30263B] rounded-sm text-sm font-medium outline-none`}
                      maxLength={10}
                      style={{
                        backgroundColor: "rgba(217, 217, 217, 0.5)",
                      }}
                    />
                    <span
                      className={`absolute right-2 top-1/2 -translate-y-1/2 font-bold ${(() => {
                        if (!surgerydatright) return "text-red-600"; // empty → red
                        const [day, month, year] = surgerydatright.split("-");
                        const inputDate = new Date(
                          `${year}-${month}-${day}T00:00:00`
                        );
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // normalize
                        inputDate.setHours(0, 0, 0, 0);
                        return inputDate < today
                          ? "text-green-700"
                          : "text-red-600";
                      })()}`}
                    >
                      R
                    </span>
                  </div>
                </div>
                <div
                  className={`${
                    width < 700 ? "h-full" : "h-1/7"
                  } w-full flex flex-row justify-end items-center pb-2`}
                >
                  <p
                    className={` ${raleway.className} font-extrabold rounded-lg px-8 py-2 cursor-pointer text-center text-white text-sm bg-black`}
                    onClick={handleschedulesurgery}
                  >
                    SCHEDULE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {width >= 1000 && <div className="w-[2%]"></div>}

      {showAlert && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`${poppins.className} bg-yellow-100 border border-red-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out`}
          >
            {alertMessage}
          </div>
        </div>
      )}

      {resetconfirm && (
        <div
          className="fixed inset-0 z-40 "
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)", // white with 50% opacity
          }}
        >
          <div
            className={`min-h-[100vh]  flex flex-col items-center justify-center mx-auto my-auto ${
              width < 950 ? "gap-4 w-full" : "w-1/2"
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
                        <Image
                          src={CloseIcon}
                          alt="Close"
                          className={`w-fit h-6 cursor-pointer`}
                          onClick={() => {
                            setresetconfirm(false);
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
                      Kindly confirm the reset of all the questionnaire in the
                      period:{" "}
                      <span className={`font-bold uppercase`}>
                        {resetperiod}
                      </span>
                    </p>
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
                          setresetconfirm(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className={`bg-[#161C10] text-white py-2 font-normal cursor-pointer ${
                          outfit.className
                        } ${width < 700 ? "w-1/2" : "w-1/2"}`}
                        onClick={() => {
                          handleresetquestionnaire();
                        }}
                      >
                        RESET
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

          {showAlert && (
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
              <div
                className={`${poppins.className} bg-yellow-100 border border-red-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out`}
              >
                {alertMessage}
              </div>
            </div>
          )}
        </div>
      )}

      {deleteconfirm && (
        <div
          className="fixed inset-0 z-40 "
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)", // white with 50% opacity
          }}
        >
          <div
            className={`min-h-[100vh]  flex flex-col items-center justify-center mx-auto my-auto ${
              width < 950 ? "gap-4 w-full" : "w-1/2"
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
                        <Image
                          src={CloseIcon}
                          alt="Close"
                          className={`w-fit h-6 cursor-pointer`}
                          onClick={() => {
                            setdeleteconfirm(false);
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
                      Kindly confirm to delete all the questionnaire in the
                      period:{" "}
                      <span className={`font-bold uppercase`}>
                        {resetperiod}
                      </span>
                    </p>
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
                          setdeleteconfirm(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className={`bg-[#161C10] text-white py-2 font-normal cursor-pointer ${
                          outfit.className
                        } ${width < 700 ? "w-1/2" : "w-1/2"}`}
                        onClick={() => {
                          handledeletequestionnaire();
                        }}
                      >
                        DELETE
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

          {showAlert && (
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
              <div
                className={`${poppins.className} bg-yellow-100 border border-red-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out`}
              >
                {alertMessage}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Patientreport;
