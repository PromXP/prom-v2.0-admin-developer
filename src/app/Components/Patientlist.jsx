"use client";

import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
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

import Patdocacc from "@/app/Assets/patdocacc.png";
import Manavatar from "@/app/Assets/man.png";
import Womanavatar from "@/app/Assets/woman.png";
import Reportimg from "@/app/Assets/report.png";
import Notify from "@/app/Assets/notify.png";
import Block from "@/app/Assets/block.png";
import Error from "@/app/Assets/error.png";
import CloseIcon from "@/app/Assets/closeiconwindow.png";
import ExpandIcon from "@/app/Assets/expand.png";
import ShrinkIcon from "@/app/Assets/shrink.png";
import UploadProfile from "@/app/Assets/uploadprofilepic.png";

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
  XCircleIcon,
  PowerIcon,
} from "@heroicons/react/16/solid";
import Patientregistration from "./Patientregistration";
import Doctorregistration from "./Doctorregistration";
import Sendreminder from "./Sendreminder";
import Patientcompliance from "./Patientcompliance";
import Activationstatus from "./Activationstatus";

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

const Patientlist = ({
  isOpenaccpat,
  setIsOpenaccpat,
  isOpenaccdoc,
  setIsOpenaccdoc,
  isOpenreminder,
  setisOpenreminder,
  isOpencompliance,
  setisOpencompliance,
  isActivationstatus,
  setisActivationstatus,
  handlenavigatereport,
  isOpenpatprof,
  setisOpenpatprof,
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

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedpatuhid, setselectedpatuhid] = useState(null);
  const [selectedpatuhidactivation, setselectedpatuhidactivation] =
    useState(null);
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("patientreportid");
  }

  const [showresetpassword, setshowresetpassword] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        let adminUhid = null;

        if (typeof window !== "undefined") {
          adminUhid = sessionStorage.getItem("admin"); // 👈 safe access
        }

        if (!adminUhid) {
          setError("No admin UHID found in session");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${API_URL}get_admin_patients/${adminUhid}`
        );
        // console.log("✅ API Response:", res.data);

        // setPatients1(res.data.patients || []);

        const apiPatients = res.data.patients || [];

        // 🔄 Map API data → static UI format
        const mapped = apiPatients.map((p, i) => ({
          name: p.Patient?.name || "Unknown",
          age: p.Patient?.birthDate
            ? new Date().getFullYear() -
              new Date(p.Patient.birthDate).getFullYear()
            : "NA",
          gender:
            p.Patient?.gender?.toLowerCase() === "male" ? "Male" : "Female",
          uhid: p.Patient?.uhid,
          dob: p.Patient?.birthDate ?? "NA",
          period: p.Patient_Status_Left || "NA", // you can decide logic here
          period_right: p.Patient_Status_Right || "NA",
          status: i % 3 === 0 ? "COMPLETED" : "PENDING", // or derive from API if you want
          left_compliance: p.Medical_Left_Completion ?? 0,
          right_compliance: p.Medical_Right_Completion ?? 0,
          activation_status: p.Activation_Status ?? "True",
          left_questionnaires: p.Medical_Left ?? "NA",
          right_questionnaires: p.Medical_Right ?? "NA",
          patient_initial_status: p.patient_current_status ?? "NA",
          surgery_left: p.Medical?.surgery_date_left ?? "NA",
          surgery_right: p.Medical?.surgery_date_right ?? "NA",
          phone: p.Patient?.phone ?? "NA",
          alterphone: p.Patient?.alterphone ?? "NA",
          email: p.Patient?.email ?? "NA",
          address: p.Patient?.address ?? "NA",
          id_proofs: p.Medical?.id_proofs ?? "NA",

          avatar:
            p.Patient?.photo && p.Patient?.photo !== "NA"
              ? p.Patient.photo
              : p.Patient?.gender?.toLowerCase() === "male"
              ? Manavatar
              : Womanavatar,
        }));

        // console.log("🔄 Mapped Patients:", mapped);
        setPatients(mapped);
      } catch (err) {
        // console.error("❌ Error fetching patients:", err);
        if (err.response) {
          setError(err.response.data.detail || "Failed to fetch patients");
        } else {
          setError("Network error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    let adminPassword = null;

    if (typeof window !== "undefined") {
      adminPassword = sessionStorage.getItem("admin_password"); // 👈 safe access
    }

    if (adminPassword === "admin@123") {
      setshowresetpassword(true);
    }
  }, []);

  const [activeTab, setActiveTab] = useState("Patients");

  const tabs = ["Patients", "Doctors", "Profile"];

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

  const [selectedStatus, setSelectedStatus] = useState("All Patients");

  const [searchTerm, setSearchTerm] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // State for dropdown radios
  const [side, setSide] = useState("left");
  const [operativePeriod, setOperativePeriod] = useState("all");
  const [subOperativePeriod, setSubOperativePeriod] = useState("all");
  const [completionStatus, setCompletionStatus] = useState("pending");
  const [selectedDate, setSelectedDate] = useState("");
  const today = new Date();
  const [selectedMonth, setselectedMonth] = useState(today.getMonth() + 1); // 1–12
  const [selectedYear, setselectedYear] = useState(today.getFullYear());

  const [sortOrder, setSortOrder] = useState("low_to_high");
  const [showAll, setShowAll] = useState(false); // false by default

  // Handlers
  const handleClearAll = () => {
    setSide("left");
    setOperativePeriod("all");
    setSubOperativePeriod("all");
    setCompletionStatus("all");
    setSortOrder("low_to_high");
    setSelectedDate("");
    setselectedMonth("");
    setselectedYear("");
    setSearchTerm("");
    setShowAll(true); // Show everything when clear all
  };

  const handleApply = () => {
    // You can do any filtering/apply logic here if needed

    setDropdownOpen(false);
  };

  const filteredPatients = patients.filter((patient) => {
    const qData =
      side === "left"
        ? patient.left_questionnaires
        : patient.right_questionnaires;
    const hasNoQuestionnaires =
      !qData || Object.values(qData).every((q) => Object.keys(q).length === 0);

    // if (
    //   hasNoQuestionnaires &&
    //   completionStatus !== "pending" &&
    //   completionStatus !== "completed"
    // )
    //   return true; // include no-questionnaire patients unconditionally

    // 1️⃣ Side filter
    if (side) {
      const surgeryDate =
        side === "left" ? patient.surgery_left : patient.surgery_right;
      if (!surgeryDate || surgeryDate === "NA") return false;
    }

    // 2️⃣ Operative period filter
    if (operativePeriod && operativePeriod !== "all") {
      if (
        operativePeriod === "pre-op" &&
        ((side === "left" && patient.period?.toLowerCase() !== "pre-op") ||
          (side === "right" &&
            patient.period_right?.toLowerCase() !== "pre-op"))
      )
        return false;

      if (operativePeriod === "post-op") {
        const postOpPeriods = ["6w", "3m", "6m", "1y", "2y"];
        if (
          (side === "left" &&
            !postOpPeriods.includes(patient.period?.toLowerCase())) ||
          (side === "right" &&
            !postOpPeriods.includes(patient.period_right?.toLowerCase()))
        )
          return false;

        if (subOperativePeriod && subOperativePeriod !== "all") {
          if (
            (side === "left" &&
              patient.period?.toLowerCase() !==
                subOperativePeriod.toLowerCase()) ||
            (side === "right" &&
              patient.period_right?.toLowerCase() !==
                subOperativePeriod.toLowerCase())
          )
            return false;
        }
      }
    }

    // 3️⃣ Completion Status filter
    const compliance =
      side === "left" ? patient.left_compliance : patient.right_compliance;

    if (!showAll) {
      // Default view: hide completed
      if (compliance === 100) return false;
    } else if (completionStatus && completionStatus !== "all") {
      // Apply user-selected completionStatus filter
      if (completionStatus === "not_assigned" && compliance !== "NA")
        return false;
      if (
        completionStatus === "pending" &&
        (compliance === "NA" || compliance === 100)
      )
        return false;
      if (
        completionStatus === "completed" &&
        (compliance === "NA" || compliance < 100)
      )
        return false;
    }

    // 4️⃣ Date / Month-Year filters
    if (selectedDate) {
      console.log("Selected date", selectedDate, qData);
      const selected = new Date(selectedDate).toISOString().split("T")[0];
      const hasMatching = Object.values(qData).some(
        (q) =>
          q &&
          typeof q === "object" &&
          Object.values(q).some(
            (period) =>
              period?.deadline &&
              new Date(period.deadline).toISOString().split("T")[0] === selected
          )
      );
      if (!hasMatching) return false;
    } else if (selectedMonth && selectedYear) {
      const month = Number(selectedMonth);
      const year = Number(selectedYear);
      const hasMatching = Object.values(qData).some(
        (q) =>
          q &&
          typeof q === "object" &&
          Object.values(q).some((period) => {
            if (!period?.deadline) return false;
            const deadline = new Date(period.deadline);
            return (
              deadline.getFullYear() === year &&
              deadline.getMonth() + 1 === month
            );
          })
      );
      if (!hasMatching) return false;
    }

    return true;
  });

  // console.log("Filtered list",filteredPatients);

  const getNearestDeadline = (patient, side) => {
    const qData =
      side === "left"
        ? patient.left_questionnaires
        : patient.right_questionnaires;

    let deadlines = [];

    Object.values(qData || {}).forEach((q) => {
      if (q && typeof q === "object") {
        Object.values(q).forEach((period) => {
          if (period?.deadline) deadlines.push(new Date(period.deadline));
        });
      }
    });

    if (deadlines.length === 0) return null;

    // Return the earliest deadline
    return new Date(Math.min(...deadlines));
  };

  const sortedPatients = filteredPatients.sort((a, b) => {
    const aData =
      side === "left" ? a.left_questionnaires : a.right_questionnaires;
    const bData =
      side === "left" ? b.left_questionnaires : b.right_questionnaires;

    const aNoData =
      !aData || Object.values(aData).every((q) => Object.keys(q).length === 0);
    const bNoData =
      !bData || Object.values(bData).every((q) => Object.keys(q).length === 0);

    // 🟡 Always move deactivated patients to the end
    if (!a.activation_status && b.activation_status) return 1;
    if (a.activation_status && !b.activation_status) return -1;

    // NA-first
    if (aNoData && !bNoData) return -1;
    if (!aNoData && bNoData) return 1;
    if (aNoData && bNoData) return 0;

    // Pending vs Completed ranking
    const getComplianceRank = (patient) => {
      const compliance =
        side === "left" ? patient.left_compliance : patient.right_compliance;
      if (compliance === "NA") return 0; // should not happen here
      if (compliance < 100) return 1; // pending
      return 2; // completed
    };

    let aRank = getComplianceRank(a);
    let bRank = getComplianceRank(b);

    // Reverse rank if sortOrder is high_to_low
    if (sortOrder === "high_to_low") {
      aRank = 3 - aRank; // pending <-> completed
      bRank = 3 - bRank;
    }

    if (aRank !== bRank) return aRank - bRank;

    // Deadline-based sorting within same status
    const aDeadline = getNearestDeadline(a, side);
    const bDeadline = getNearestDeadline(b, side);

    if (!aDeadline && !bDeadline) return 0;
    if (!aDeadline) return 1;
    if (!bDeadline) return -1;

    return sortOrder === "low_to_high"
      ? aDeadline - bDeadline
      : bDeadline - aDeadline;
  });

  // Use searchedPatients if searchTerm exists, otherwise filteredPatients
  const displayedPatients = searchTerm
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.uhid.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedPatients;

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50); // initial default

  // Whenever data or rowsPerPage change, reset page
  // Reset current page when searchTerm, filteredPatients, or rowsPerPage changes
  // Reset current page when searchTerm or filteredPatients length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filteredPatients.length]);

  // Optional: adjust rowsPerPage if it exceeds array length
  useEffect(() => {
    if (rowsPerPage > displayedPatients.length) {
      setRowsPerPage(Math.max(50, displayedPatients.length));
    }
  }, [displayedPatients.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(displayedPatients.length / rowsPerPage)
  );

  const paginatedPatients = displayedPatients.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const generatePageOptions = (total) => {
    const options = [50].filter((n) => n < total);
    if (!options.includes(total)) options.push(total);
    return options;
  };

  const [selectedRole, setSelectedRole] = useState("");

  const data = [
    { name: "Patients", count: 51 },
    { name: "Doctors", count: 3 },
  ];

  // const [isOpenacc, setIsOpenacc] = useState(false);

  useEffect(() => {
    if (isOpenaccpat && isOpenaccdoc) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenaccpat, isOpenaccdoc]);

  const [shownotassigned, setshownotassigned] = useState(false);
  const [selecteduhidcompliance, setselecteduhidcompliance] = useState(null);

  function getComplianceColor(value) {
    // value: 0–100
    const green = Math.min(255, Math.floor((value / 100) * 255));
    const red = 255 - green;
    return `rgb(${red}, ${green}, 0)`; // 0–green, red decreases as value increases
  }

  // inside your component
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showprof, setshowprof] = useState(false);
  const [profpat, setshowprofpat] = useState([]);
  const [expand, setexpand] = useState(false);

  const [reloadreq, setReloadreq] = useState(false);

  // Original value
  const [phone, setPhone] = useState(profpat?.phone);

  // Editing state
  const [isEditPhone, setIsEditPhone] = useState(false);

  // Input during editing
  const [phoneInput, setPhoneInput] = useState(phone);

  // Sync input with external changes to initialPhone
  useEffect(() => {
    setPhone(profpat?.phone);
    setPhoneInput(profpat?.phone);
  }, [profpat]);

  // Edit function
  const handleEditPhone = () => {
    setPhoneInput(phone); // initialize input with current phone
    setIsEditPhone(true);
  };

  // Save function
  const handleSavePhone = async () => {
    if (!profpat?.uhid) {
      showWarning("Patient Not found");
      return;
    }

    if (!phoneInput) {
      showWarning("Phone number required");
      return;
    }

    const digitsOnly = phoneInput.replace(/\D/g, "");

    if (digitsOnly.length !== 10) {
      showWarning("Phone number must be 10 digits");
      return;
    }

    if (digitsOnly === alterphone) {
      showWarning("Phone and Alternate phone should not be same");
      return;
    }

    if (/^0+$/.test(digitsOnly)) {
      showWarning("Invalid phone number");
      return;
    }

    setIsEditPhone(false);

    const payload = {
      field: "mobile",
      value: phoneInput,
    };

    try {
      // ✅ API call
      const response = await axios.patch(
        `${API_URL}patients/update-field/${profpat?.uhid}`,
        payload
      );

      // ✅ Update local state
      setPhone(phoneInput);
      setIsEditPhone(false);
      setReloadreq(true);

      showWarning("Phone number updated successfully");
    } catch (error) {
      // console.error("Error updating phone:", error);
      setPhone(phone);
      showWarning("Failed to update phone number");
    }
  };

  // Cancel function
  const handleCancelPhone = () => {
    setPhoneInput(phone); // revert input to original
    setIsEditPhone(false);
  };

  const [alterphone, setAlterPhone] = useState(profpat?.alterphone);
  const [alterphoneInput, setAlterPhoneInput] = useState("");
  const [isEditAlterPhone, setIsEditAlterPhone] = useState(false);

  useEffect(() => {
    setAlterPhone(profpat?.alterphone);
    setAlterPhoneInput(profpat?.email);
  }, [profpat]);

  const handleEditAlterPhone = () => {
    setAlterPhoneInput(alterphone);
    setIsEditAlterPhone(true);
  };

  const handleCancelAlterPhone = () => {
    setAlterPhoneInput(alterphone);
    setIsEditAlterPhone(false);
  };

  const handleSaveAlterPhone = async () => {
    if (!profpat?.uhid) {
      showWarning("Patient Not found");
      return;
    }

    if (!alterphoneInput || alterphoneInput.length !== 10) {
      showWarning("Alternate phone number must be 10 digits");
      return;
    }

    if (phone === alterphoneInput) {
      showWarning("Phone and Alternate phone should not be same");
      return;
    }

    const payload = {
      field: "alt_mobile",
      value: alterphoneInput,
    };

    try {
      const response = await axios.patch(
        `${API_URL}patients/update-field/${profpat?.uhid}`,
        payload
      );

      setAlterPhone(alterphoneInput);
      setIsEditAlterPhone(false);
      setReloadreq(true);

      showWarning("Alternate phone number updated successfully");
    } catch (error) {
      console.error("Error updating alternate phone:", error);
      showWarning("Failed to update alternate phone number");
    }
  };

  // ------------------ EMAIL STATE ------------------

  // Current email
  const [email, setEmail] = useState(profpat?.email);

  // Editing state
  const [isEditEmail, setIsEditEmail] = useState(false);

  // Input during editing
  const [emailInput, setEmailInput] = useState(email);

  // Sync input when profpat changes
  useEffect(() => {
    setEmail(profpat?.email);
    setEmailInput(profpat?.email);
  }, [profpat]);

  // ------------------ EMAIL FUNCTIONS ------------------

  // Edit
  const handleEditEmail = () => {
    setEmailInput(email); // load current email
    setIsEditEmail(true);
  };

  // Save
  const handleSaveEmail = async () => {
    if (!profpat?.uhid) {
      showWarning("Patient Not found");
      return;
    }

    if (!emailInput) {
      showWarning("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      showWarning("Please enter a valid email address.");
      return;
    }

    setEmail(emailInput); // update locally
    setIsEditEmail(false);

    const payload = {
      field: "email",
      value: emailInput,
    };

    try {
      // ✅ API call
      const response = await axios.patch(
        `${API_URL}patients/update-field/${profpat?.uhid}`,
        payload
      );

      // ✅ Update local state again to be safe
      setEmail(emailInput);
      setIsEditEmail(false);

      setReloadreq(true);

      showWarning("Email updated successfully");
    } catch (error) {
      console.error("Error updating email:", error);
      showWarning("Failed to update email");
    }
  };

  // Cancel
  const handleCancelEmail = () => {
    setEmailInput(email); // reset input
    setIsEditEmail(false);
  };

  const idOptions = ["PASSPORT", "PAN", "AADHAAR", "ABHA"];

  // Regex for each ID type
  const idRegex = {
    passport: /^[A-PR-WY][0-9]{7}$/, // Example: Indian passport format
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/, // PAN
    aadhaar: /^[0-9]{12}$/, // Aadhaar
    abha: /^[A-Za-z0-9]{10,20}$/, // ABHA
  };

  const idConfig = {
    passport: { maxLength: 9, pattern: /^[A-Z0-9]*$/i }, // typical alphanumeric passport
    aadhaar: { maxLength: 12, pattern: /^[0-9]*$/ },
    pan: { maxLength: 10, pattern: /^[A-Z0-9]*$/i },

    abha: { maxLength: 14, pattern: /^[0-9]*$/ }, // ✅ new entry
  };

  // State for errors
  const [idErrors, setIdErrors] = useState({});

  // Handle blur or save for each ID
  const validateID = (id, value) => {
    if (!value) return ""; // Empty is allowed
    if (!idRegex[id]?.test(value)) {
      return `${id} format is invalid`;
    }
    return "";
  };

  // State
  const [selectedIDs, setSelectedIDs] = useState({});
  // Which ID is currently being edited (null = none)
  const [editingID, setEditingID] = useState(null);

  // Keep inputs for each ID separately
  const [idInputs, setIdInputs] = useState({});

  // Sync with existing patient proofs
  useEffect(() => {
    if (profpat?.id_proofs) {
      const existing = {};
      const inputs = {};
      Object.keys(profpat.id_proofs).forEach((key) => {
        existing[key] = profpat.id_proofs[key].number;
        inputs[key] = profpat.id_proofs[key].number;
      });
      console.log("ID PROOFS", existing);
      setSelectedIDs(existing);
      setIdInputs(inputs);
    }
  }, [profpat]);

  const handleEditID = (id) => {
    setEditingID(id); // set current editing
    setIdInputs((prev) => ({ ...prev, [id]: selectedIDs[id] })); // preload value
  };

  const handleCancelID = (id) => {
    setEditingID(null); // exit edit mode
    setIdInputs((prev) => ({ ...prev, [id]: selectedIDs[id] })); // reset to original
    setIdErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleInputChange = (id, value) => {
    setIdInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveID = async (id) => {
    if (!idInputs[id]) {
      showWarning(`${id} number required`);
      return;
    }

    const error = validateID(id, idInputs[id]);
    if (error) {
      setIdErrors((prev) => ({ ...prev, [id]: error }));
      setIdInputs((prev) => ({ ...prev, [id]: "" })); // clear invalid input
      return;
    }

    const payload = {
      field: id,
      value: idInputs[id],
    };
    // console.log("ID inputs", payload);

    try {
      await axios.patch(
        `${API_URL}patients/update-field/${profpat?.uhid}`,
        payload
      );

      setSelectedIDs((prev) => ({ ...prev, [id]: idInputs[id] }));
      setEditingID(null); // close edit
      setReloadreq(true);
      setIdErrors((prev) => ({ ...prev, [id]: "" }));
      showWarning(`${id} updated successfully`);
    } catch (error) {
      console.error("Error updating ID proof:", error);
      showWarning(`Failed to update ${id}`);
    }
  };

  // State variables
  const [address, setAddress] = useState(profpat?.address);
  const [addressInput, setAddressInput] = useState(""); // editable input value
  const [isEditAddress, setIsEditAddress] = useState(false);

  // Functions
  const handleEditAddress = () => {
    setIsEditAddress(true);
    setAddressInput(address);
  };

  // Sync with existing patient proofs
  useEffect(() => {
    if (profpat?.address) {
      setAddress(profpat?.address);
      setAddressInput(profpat?.address);
    }
  }, [profpat]);

  const handleSaveAddress = async () => {
    setAddress(addressInput);
    setIsEditAddress(false);

    // 🔥 API call or PUT only { "address": addressInput }
    // console.log(addressInput + " " + profpat?.uhid);
    const payload = {
      field: "address",
      value: addressInput,
    };

    try {
      await axios.patch(
        `${API_URL}patients/update-field/${profpat?.uhid}`,
        payload
      );

      setAddress(addressInput);
      setIsEditAddress(null); // close edit
      setReloadreq(true);
      showWarning(`Address updated successfully`);
    } catch (error) {
      console.error("Error updating Address:", error);
      showWarning(`Failed to update ${profpat?.uhid}`);
    }
  };

  const handleCancelAddress = () => {
    setIsEditAddress(false);
    setAddressInput(address);
  };

  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showimgupload, setimgupload] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && e.target.files) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));

      setimgupload(true);
    }
  };

  const resetImage = () => {
    setProfileImage(null);
    setPreviewUrl(null);

    // Optionally clear the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    showWarning("Image reset Successfull");
    setimgupload(false);
  };

  const handleUpload = async ({ uhid1, type1 }) => {
    if (!profileImage) {
      setError("Please select or capture an image.");
      return;
    }

    const formData = new FormData();
    formData.append("uhid", uhid1);
    formData.append("usertype", type1); // <-- Make sure userType is defined
    formData.append("profile_image", profileImage);

    try {
      const res = await axios.post(`${API_URL}upload-profile-photo`, formData);

      // console.log("Profile upload success:", res.data);
      showWarning("Image Upload Successfull");
      setReloadreq(true);
      setimgupload(false);
    } catch (err) {
      console.error("Profile upload failed:", err);
      showWarning("Image Upload failed");
      setimgupload(true);
    }
  };

  const isBlobUrl = previewUrl && previewUrl.startsWith("blob:");

  const fileInputRef = useRef(null); // To programmatically trigger the file input

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const showWarning = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showWarning("Please fill in both fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      showWarning("Passwords do not match");
      return;
    }
    let adminUhid = null;
    if (typeof window !== "undefined") {
      adminUhid = sessionStorage.getItem("admin"); // 👈 safe access
    }

    const payload = {
      uhid: adminUhid,
      role: "admin",
      new_password: newPassword,
    };

    try {
      await axios.patch(`${API_URL}auth/reset-password`, payload);

      showWarning(`Password reset successfull`);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_password", newPassword); // 👈 safe access
      }
      window.location.reload();
    } catch (error) {
      console.error("Error reset password:", error);
      showWarning(`Failed to reset password for ${profpat?.uhid}`);
    }
  };

  const messages = [
    "Fetching patients from the database...",
    "Almost there, preparing data...",
    "Optimizing results...",
    "Hang tight! Just a moment...",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const notifyFlag = sessionStorage.getItem("notifyflag");
      const patientNotifyId = sessionStorage.getItem("patientnotifyid");

      if (notifyFlag === "true" && patientNotifyId) {
        setisOpenreminder(true);
        setselectedpatuhid(patientNotifyId);
        return;
      }

      const activeFlag = sessionStorage.getItem("activflag");
      const patientActiveId = sessionStorage.getItem("patientactivid");

      if (activeFlag === "true" && patientActiveId) {
        setisActivationstatus(true);
        setselectedpatuhidactivation(patientActiveId);
        return;
      }
    }
  }, [paginatedPatients]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        if (reloadreq) {
          window.location.reload();
        }
        setshowprof(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    // cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const isDefaultFilter =
    side === "left" &&
    operativePeriod === "all" &&
    subOperativePeriod === "all" &&
    completionStatus === "all" &&
    sortOrder === "low_to_high" &&
    selectedDate === "" &&
    selectedMonth === "" &&
    selectedYear === "";

  return (
    <>
      <div
        className={`w-full h-[90%] flex rounded-4xl ${
          width >= 1000 ? "flex-row" : "flex-col pb-4"
        }`}
      >
        <div
          className={`flex flex-col ${
            width >= 1000 ? "w-1/5 pt-8 pb-4" : "w-full pt-8"
          } ${width < 400 ? "min-h-screen" : "h-full"}`}
        >
          <div
            className={`  ${
              width >= 700
                ? "w-full justify-center items-center"
                : "w-full items-center justify-center"
            } flex flex-row gap-6 `}
          >
            <div className="w-fit flex flex-row items-center justify-center gap-3">
              <p
                className={`${raleway.className} font-bold text-2xl text-[#2B2B2B]`}
              >
                PATIENTS
              </p>
              <p
                className={`${inter.className} font-bold text-4xl text-white py-1.5 px-4 bg-[#2A343D] rounded-[10px]`}
              >
                {patients.length ?? "NA"}
              </p>
            </div>
          </div>

          <div
            className={`w-full h-full  flex ${
              width >= 1000
                ? "border-gray-300 border-r-2 flex-col justify-end"
                : width >= 400 && width < 1000
                ? "flex-row gap-2"
                : "flex-col justify-center"
            }`}
          >
            <div
              className={`w-full flex justify-center items-end relative ${
                width >= 1000
                  ? "h-4/9"
                  : width >= 400 && width < 1000
                  ? "h-full"
                  : "h-1/2"
              }`}
            >
              <Image
                src={Patdocacc}
                className={`h-full object-fit ${
                  width >= 1500
                    ? "w-3/5"
                    : width < 1500 && width >= 400
                    ? "w-full px-2"
                    : "w-3/5"
                }`}
                alt="Account creation"
              />

              <div className="absolute flex flex-col items-center justify-between h-3/5 px-1 py-2.5 gap-8">
                <p
                  onClick={() => {
                    setSelectedRole("patient");
                    setIsOpenaccdoc(false);
                    setIsOpenaccpat(true);
                  }}
                  className={`
                                ${inter.className}
                                px-3 py-3 text-[15px] font-semibold rounded-xl cursor-pointer transition
                                ${
                                  selectedRole === "patient"
                                    ? "bg-[#3867D8] text-white"
                                    : "bg-white text-black"
                                }
                              `}
                  title="Click for new patient registration"
                >
                  ADD NEW PATIENT
                </p>
                <p
                  onClick={() => {
                    setSelectedRole("doctor");
                    setIsOpenaccpat(false);
                    setIsOpenaccdoc(true);
                  }}
                  className={`
                                ${inter.className}
                                px-3 py-3 text-[15px] font-semibold rounded-xl cursor-pointer transition
                                ${
                                  selectedRole === "doctor"
                                    ? "bg-[#3867D8] text-white"
                                    : "bg-white text-black"
                                }
                              `}
                  title="Click for new doctor registration"
                >
                  ADD NEW DOCTOR
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={` h-full flex rounded-4xl ${
            width >= 1000 ? "flex-row w-4/5" : "flex-col w-full pt-4"
          }`}
        >
          <div
            className={`flex flex-col h-full px-2 pt-4 gap-5 ${
              width >= 1000 ? "w-full" : "w-full"
            }`}
          >
            <p
              className={`${raleway.className} h-[5%] text-[#30263B] font-extrabold text-2xl`}
            >
              DASHBOARD
            </p>

            <div
              className={`w-full flex h-[6%] ${
                width >= 1265 ? "flex-row" : "flex-col gap-4"
              }`}
            >
              <div
                className={` flex flex-row items-center gap-4 pl-4 ${
                  width >= 1265 ? "w-[70%]" : "w-full"
                }`}
              >
                <p
                  className={`
                    ${raleway.className}
                    text-teal-600
                    font-semibold
                    text-sm
                    w-1/7
                    cursor-pointer
                    underline
                    hover:scale-110
                    transition
                  `}
                  onClick={handleClearAll}
                  title="Click to clear the filter and search"
                >
                  Clear All
                </p>

                <div className="relative w-6/7">
                  <input
                    type="text"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      // allow only letters, numbers, and spaces
                      const filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
                      setSearchTerm(filteredValue);
                    }}
                    className="text-black w-full pl-10 pr-4 py-1 border-2 border-gray-300 rounded-lg"
                  />
                  <svg
                    className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                    />
                  </svg>
                </div>

                {/* Dropdown SVG Button */}
                <div
                  ref={dropdownRef}
                  className={`${raleway.className} relative`}
                >
                  <div
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-300 ${
                      isDefaultFilter
                        ? "bg-white border border-gray-200"
                        : "bg-teal-100 border-2 border-teal-500 shadow-md"
                    }`}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    title="Click to open filter options"
                  >
                    <svg
                      width="12"
                      height="14"
                      viewBox="0 0 12 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.79 1.61564C12.3029 0.959102 11.8351 0 11.002 0H1.00186C0.168707 0 -0.299092 0.959101 0.213831 1.61564L5.03983 7.72867C5.1772 7.90449 5.25181 8.1212 5.25181 8.34432V13.7961C5.25181 13.9743 5.46724 14.0635 5.59323 13.9375L6.60536 12.9254C6.69913 12.8316 6.75181 12.7044 6.75181 12.5718V8.34432C6.75181 8.1212 6.82643 7.90449 6.96379 7.72867L11.79 1.61564Z"
                        fill="#464F60"
                      />
                    </svg>
                  </div>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 max-h-[500px] overflow-y-auto mt-2 w-56 bg-white border rounded shadow-md z-10 p-4 text-base text-gray-700"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#888 transparent", // Firefox
                      }}
                    >
                      {/* Side */}
                      <div className="mb-4">
                        <p className="font-semibold mb-1">Side</p>
                        <label
                          className={`inline-flex items-center mr-4 cursor-pointer ${
                            side === "left" ? "font-bold text-lg" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            className="form-radio"
                            name="side"
                            value="left"
                            checked={side === "left"}
                            onChange={() => setSide("left")}
                            onClick={() => setShowAll(true)}
                          />
                          <span className="ml-2">Left</span>
                        </label>
                        <label
                          className={`inline-flex items-center cursor-pointer ${
                            side === "right" ? "font-bold text-lg" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            className="form-radio"
                            name="side"
                            value="right"
                            checked={side === "right"}
                            onChange={() => setSide("right")}
                            onClick={() => setShowAll(true)}
                          />
                          <span className="ml-2">Right</span>
                        </label>
                      </div>

                      {/* Operative Period */}
                      <div className="mb-4">
                        <p className="font-semibold mb-1">Operative Period</p>
                        {["all", "pre-op", "post-op"].map((period) => (
                          <div key={period}>
                            <label
                              className={`inline-flex items-center mr-4 cursor-pointer ${
                                operativePeriod === period
                                  ? "font-bold text-lg"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                className="form-radio"
                                name="operativePeriod"
                                value={period}
                                checked={operativePeriod === period}
                                onChange={() => {
                                  setOperativePeriod(period);
                                  if (period !== "post-op") {
                                    setSubOperativePeriod(""); // reset sub-period if switching away
                                  }
                                }}
                                onClick={() => setShowAll(true)}
                              />
                              <span className="ml-2 capitalize">{period}</span>
                            </label>

                            {/* Show sub-options if post-op selected */}
                            {period === "post-op" &&
                              operativePeriod === "post-op" && (
                                <div className="ml-6 mt-2 flex flex-wrap gap-4">
                                  {["all", "6w", "3m", "6m", "1y", "2y"].map(
                                    (sub) => (
                                      <label
                                        key={sub}
                                        className={`inline-flex items-center cursor-pointer ${
                                          subOperativePeriod === sub
                                            ? "font-bold text-lg"
                                            : ""
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          className="form-radio"
                                          name="subOperativePeriod"
                                          value={sub}
                                          checked={subOperativePeriod === sub}
                                          onChange={() =>
                                            setSubOperativePeriod(sub)
                                          }
                                        />
                                        <span className="ml-2 capitalize">
                                          {sub}
                                        </span>
                                      </label>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>

                      {/* Completion Status */}
                      <div className="mb-4">
                        <p className="font-semibold mb-1">Completion Status</p>
                        {["all", "not_assigned", "pending", "completed"].map(
                          (status) => (
                            <label
                              key={status}
                              className={`inline-flex items-center mr-4 cursor-pointer ${
                                completionStatus === status
                                  ? "font-bold text-lg"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                className="form-radio"
                                name="completionStatus"
                                value={status}
                                checked={completionStatus === status}
                                onChange={() => setCompletionStatus(status)}
                                onClick={() => setShowAll(true)}
                              />
                              <span className="ml-2">
                                {status
                                  .replace("_", " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </span>
                            </label>
                          )
                        )}
                      </div>

                      {/* Calendar Date Picker */}
                      <div className="mb-4" title="Deadline Date">
                        <p className="font-semibold mb-1 ">Select Date</p>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className={`  rounded px-2 py-1 text-sm w-full cursor-pointer ${
                            selectedDate
                              ? "font-bold text-lg border-black border-2"
                              : "border-gray-300 border"
                          }`}
                          onClick={() => setShowAll(true)}
                          title="Questionnaire Deadline Date"
                        />
                      </div>

                      {/* Custom Month-Year Picker */}
                      <div className="mb-4 w-full max-w-xs">
                        <p className="font-semibold mb-1">
                          Select Month & Year
                        </p>
                        <div className="flex gap-2">
                          {/* Month Dropdown */}
                          <select
                            value={selectedMonth}
                            onChange={(e) => setselectedMonth(e.target.value)}
                            onClick={() => setShowAll(true)}
                            className={` rounded px-2 py-1 text-sm w-1/2 cursor-pointer ${
                              selectedMonth
                                ? "font-bold text-lg border-black border-2"
                                : "border-gray-300 border"
                            }`}
                            title="Questionnaire Deadline Month"
                          >
                            <option value="">Month</option>
                            {[
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ].map((month, idx) => (
                              <option key={idx} value={idx + 1}>
                                {month}
                              </option>
                            ))}
                          </select>

                          {/* Year Dropdown */}
                          <select
                            value={selectedYear}
                            onChange={(e) => setselectedYear(e.target.value)}
                            onClick={() => setShowAll(true)}
                            className={`rounded px-2 py-1 text-sm w-1/2 cursor-pointer ${
                              selectedYear
                                ? "font-bold text-lg border-black border-2"
                                : "border-gray-300 border"
                            }`}
                            title="Questionnaire Deadline Year"
                          >
                            <option value="">Year</option>
                            {Array.from(
                              {
                                length:
                                  new Date().getFullYear() + 10 - 1950 + 1,
                              },
                              (_, i) => 1950 + i
                            ).map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Sort */}
                      <div>
                        <p className="font-semibold mb-1">Sort</p>
                        {[
                          { label: "Low to High", value: "low_to_high" },
                          { label: "High to Low", value: "high_to_low" },
                        ].map(({ label, value }) => (
                          <label
                            key={value}
                            className={`inline-flex items-center mr-4 cursor-pointer ${
                              sortOrder === value ? "font-bold text-lg " : ""
                            }`}
                            title="Sorting based on the compliance score"
                          >
                            <input
                              type="radio"
                              className="form-radio"
                              name="sortOrder"
                              value={value}
                              checked={sortOrder === value}
                              onChange={() => setSortOrder(value)}
                              onClick={() => setShowAll(true)}
                            />
                            <span className="ml-2">{label}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex justify-center mt-4 pt-2 border-t border-gray-300">
                        <button
                          onClick={handleClearAll}
                          className="text-sm font-semibold text-red-600 cursor-pointer"
                        >
                          Reset
                        </button>
                        {/* <button
                          onClick={handleApply}
                          className="text-sm font-semibold text-blue-600 cursor-pointer"
                        >
                          Apply
                        </button> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`w-full flex flex-col gap-2 ${
                width >= 1000 ? "h-[89%]" : "h-[98%] pb-4"
              }`}
            >
              <div
                className={`${poppins.className} h-[5%] flex flex-row items-center justify-end gap-4 px-4 text-[13px] font-medium text-gray-600`}
              >
                {/* Rows per page */}
                <span>Records per page:</span>
                <select
                  className="bg-transparent outline-none text-gray-700 font-semibold cursor-pointer"
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  title="Click to select no of records to be displayed"
                >
                  {generatePageOptions(displayedPatients.length).map(
                    (count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    )
                  )}
                </select>

                {/* Pagination controls */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  {/* Previous */}
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow border cursor-pointer"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    title="Move to previous page"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* Page Info */}
                  <span className="text-gray-700 text-[13px]">
                    <span className="text-black">{currentPage}</span> /{" "}
                    <span>{totalPages}</span>
                  </span>

                  {/* Next */}
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow border cursor-pointer"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    title="Move to next page"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                className={`w-full h-[95%] flex-1 px-4 pt-2 pb-6 gap-6 inline-scroll ${
                  width >= 1000 ? "overflow-y-auto" : ""
                }`}
              >
                {loading ? (
                  <div className="flex space-x-2 w-full justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span
                      className={`${poppins.className} text-black font-semibold`}
                    >
                      {messages[index]}
                    </span>
                  </div>
                ) : paginatedPatients.length !== 0 ? (
                  paginatedPatients.map((patient, index) => (
                    <div
                      key={index}
                      className={`w-full rounded-lg flex px-3 bg-white ${
                        width < 530
                          ? "flex-col justify-center items-center gap-2 py-3"
                          : "flex-row justify-between items-center py-1.5"
                      } ${width < 1000 ? "mb-2" : "mb-6"}`}
                    >
                      {/* LEFT - Avatar + Name + Age */}
                      <div
                        className={`${
                          width < 640 && width >= 530
                            ? "w-3/5"
                            : width < 530
                            ? "w-full"
                            : "w-[30%]"
                        } ${
                          !patient.activation_status
                            ? "opacity-30 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <div
                          className={`flex gap-4 py-0 items-center ${
                            width < 710 && width >= 640
                              ? "px-0 flex-row"
                              : width < 530
                              ? "flex-col justify-center items-center"
                              : "px-2 flex-row"
                          }`}
                        >
                          <Image
                            src={patient.avatar}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className={`rounded-full cursor-pointer ${
                              width < 530 ? "w-11 h-11" : "w-10 h-10"
                            }`}
                            onClick={() => {
                              setshowprof(true);
                              setshowprofpat(patient);
                              console.log("Prof Pat", patient);
                            }}
                            title="Click to view patient profile"
                          />
                          <div
                            className={`w-full flex items-center ${
                              width < 710 ? "flex-col" : "flex-row"
                            }`}
                          >
                            <div
                              className={`flex flex-col ${
                                width < 710 ? "w-full gap-2" : "w-[70%] gap-4"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <p
                                  className={`${
                                    raleway.className
                                  } text-[#475467] font-semibold text-lg ${
                                    width < 530 ? "w-full text-center" : ""
                                  }`}
                                >
                                  {patient.name}
                                </p>
                              </div>
                              <p
                                className={`${
                                  poppins.className
                                } font-normal text-sm text-[#475467] ${
                                  width < 530 ? "text-center" : "text-start"
                                }`}
                              >
                                {patient.age}, {patient.gender}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT - UHID + Period + Status + Report Icon */}
                      <div
                        className={`flex items-center ${
                          width < 640 && width >= 530
                            ? "w-2/5 flex-col text-center gap-4"
                            : width < 530
                            ? "w-full flex-col text-center gap-4"
                            : "w-[70%] flex-row justify-between"
                        }`}
                      >
                        {/* UHID */}
                        <div
                          className={`${
                            poppins.className
                          } text-base font-medium text-[#475467] ${
                            width < 710
                              ? "w-full text-center"
                              : "w-1/4 text-center"
                          } ${
                            !patient.activation_status
                              ? "opacity-30 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {patient.uhid}
                        </div>

                        {/* Period */}
                        <div
                          className={`${
                            inter.className
                          } text-[15px] font-semibold text-[#373737] ${
                            width < 750
                              ? "w-3/4 text-center"
                              : "w-1/4 text-center"
                          } ${
                            !patient.activation_status
                              ? "opacity-30 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {patient.period}
                        </div>

                        {/* Compliance */}
                        <div
                          className={`flex flex-col items-center justify-center ${
                            width < 750
                              ? "w-3/4 text-center"
                              : "w-1/4 text-center"
                          } ${
                            !patient.activation_status
                              ? "opacity-30 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {(side === "left"
                            ? patient.left_compliance
                            : patient.right_compliance) === "NA" ? (
                            <div
                              className="w-full flex flex-col items-end relative group"
                              title="Questionnaire Compliance rate"
                            >
                              <div
                                className={`${poppins.className} absolute -top-5 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out text-sm font-semibold text-black`}
                              >
                                No questionnaires assigned
                              </div>
                              <Image
                                src={Error}
                                alt="Not assigned"
                                className="w-6 h-6"
                              />
                              <div className="relative w-full h-1.5 overflow-hidden bg-white ">
                                <div
                                  className="h-full bg-[#E5E5E5]"
                                  style={{
                                    width: "100%",
                                    backgroundImage: "url('/stripes.svg')",
                                    backgroundRepeat: "repeat",
                                    backgroundSize: "20px 20px",
                                  }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="w-full flex flex-col items-center relative group"
                              title="Questionnaire Compliance rate"
                            >
                              <div
                                className={`${poppins.className} absolute -top-7 left-0 transform translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out text-sm font-semibold text-black border-2 border-black px-3 rounded-lg`}
                              >
                                {side === "left"
                                  ? `${patient.left_compliance || 0}%`
                                  : `${patient.right_compliance || 0}%`}
                              </div>
                              <div
                                className="relative w-full h-1.5 overflow-hidden bg-[#E5E5E5] cursor-pointer"
                                onClick={() => {
                                  setisOpencompliance(true);
                                  setselecteduhidcompliance(patient.uhid);
                                }}
                              >
                                <div
                                  className="h-full"
                                  style={{
                                    width: `${
                                      side === "left"
                                        ? patient.left_compliance || 0
                                        : patient.right_compliance || 0
                                    }%`,

                                    backgroundColor: getComplianceColor(
                                      side === "left"
                                        ? patient.left_compliance || 0
                                        : patient.right_compliance || 0
                                    ),

                                    backgroundImage: "url('/stripes.svg')",
                                    backgroundRepeat: "repeat",
                                    backgroundSize: "20px 20px",
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Report & Block */}
                        <div
                          className={`flex flex-row gap-4 ${
                            width < 750 ? "w-3/4 text-center" : "w-1/4"
                          } ${
                            !patient.activation_status
                              ? "opacity-30 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div
                            className={`${
                              width < 750 ? "w-full text-center" : "w-full"
                            } ${
                              patient.left_compliance === "NA"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Image
                              src={Notify}
                              alt="Message"
                              className={`w-6 h-6 mx-auto ${
                                !patient.activation_status
                                  ? "opacity-30 cursor-not-allowed"
                                  : patient.left_compliance === "NA"
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }
                              `}
                              onClick={() => {
                                if (
                                  patient.left_compliance === "NA" ||
                                  !patient.activation_status
                                )
                                  return;
                                if (typeof window !== "undefined") {
                                  sessionStorage.setItem("notifyflag", "true");
                                  sessionStorage.setItem(
                                    "patientnotifyid",
                                    patient.uhid
                                  );
                                }
                                setisOpenreminder(true);
                                setselectedpatuhid(patient.uhid);
                              }}
                              title="Click to Notify patients"
                            />
                          </div>
                        </div>

                        <div
                          className={`flex flex-row gap-4 items-center ${
                            width < 750 ? "w-3/4 text-center" : "w-1/4"
                          }`}
                        >
                          <div
                            className={`${
                              width < 750 ? "w-1/2 text-center" : "w-1/2"
                            } ${
                              !patient.activation_status
                                ? "opacity-30 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <Image
                              src={Reportimg}
                              className="w-8 h-8 mx-auto"
                              alt="Report"
                              onClick={() => {
                                if (!patient.activation_status) return;
                                handlenavigatereport();
                                if (typeof window !== "undefined") {
                                  sessionStorage.setItem(
                                    "patientreportid",
                                    patient.uhid
                                  );
                                }
                              }}
                              title="Click to view patient report"
                            />
                          </div>
                          <div
                            className={`${
                              width < 750 ? "w-1/2 text-center" : "w-1/2"
                            } `}
                          >
                            <PowerIcon
                              className={`w-6 h-6 cursor-pointer ${
                                !patient.activation_status
                                  ? "text-red-800"
                                  : "text-green-700"
                              }`}
                              onClick={() => {
                                if (typeof window !== "undefined") {
                                  sessionStorage.setItem("activflag", "true");
                                  sessionStorage.setItem(
                                    "patientactivid",
                                    patient.uhid
                                  );
                                }
                                setisActivationstatus(true);
                                setselectedpatuhidactivation(patient.uhid);
                              }}
                              title="Click to activate/deactivate patient"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : patients.length === 0 ? (
                  <p
                    className={`${poppins.className} text-gray-500 font-medium text-center`}
                  >
                    No Patients Found
                  </p>
                ) : (
                  <p
                    className={`${poppins.className} text-gray-500 font-medium text-center`}
                  >
                    No Patients Found Try clear All
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {width >= 1000 && <div className="w-[2%]"></div>}
      </div>

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
            min-h-[100vh]  flex flex-col items-center justify-center mx-auto my-auto
            ${width < 950 ? "gap-4 w-full" : "w-5/6"}
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
                    className={`w-full h-full rounded-lg flex flex-col gap-12 ${
                      width < 760 ? "py-0" : "py-4 px-8"
                    }`}
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <p
                        className={`${inter.className} text-2xl font-semibold text-black`}
                      >
                        Patient Profile
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

                        <XCircleIcon
                          className="w-fit h-7 text-red-600  cursor-pointer"
                          onClick={() => {
                            setshowprof(false);
                            if (reloadreq) {
                              window.location.reload();
                            }
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
                            {profpat?.name}
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
                          UHID
                        </p>
                        <p
                          className={`w-full text-black
                          font-medium
                          text-lg
                          ${inter.className}`}
                        >
                          {profpat?.uhid}
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
                          ${inter.className}`}
                            >
                              {profpat?.gender}
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
                              {profpat?.dob}
                            </p>
                          </div>
                        </div>

                        <div className={`w-full flex flex-col gap-2`}>
                          <p
                            className={`${outfit.className} font-normal text-base text-black/80`}
                          >
                            PHONE NUMBER
                          </p>

                          {!isEditPhone ? (
                            <div className="flex items-center gap-2">
                              <span className="text-black/90">
                                {phone || "NA"}
                              </span>
                              <PencilSquareIcon
                                className="w-5 h-5 cursor-pointer text-gray-500"
                                onClick={handleEditPhone}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={10}
                                className={`border-b-2 border-black outline-none text-black px-1 w-full ${inter.className}`}
                                value={phoneInput}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  setPhoneInput(value);
                                }}
                              />
                              <ClipboardDocumentCheckIcon
                                className="w-5 h-5 cursor-pointer text-green-500"
                                onClick={handleSavePhone}
                              />
                              <XMarkIcon
                                className="w-5 h-5 cursor-pointer text-red-500"
                                onClick={handleCancelPhone}
                              />
                            </div>
                          )}
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
                            className={`flex flex-col gap-2 ${
                              width < 700 ? "w-full" : "w-4/7"
                            }`}
                          >
                            <p
                              className={`${outfit.className} font-normal text-base text-black/80`}
                            >
                              ADDRESS
                            </p>

                            {!isEditAddress ? (
                              <div className="flex items-center gap-2">
                                <span className="text-black/90">
                                  {address || "Not provided"}
                                </span>
                                <PencilSquareIcon
                                  className="w-5 h-5 cursor-pointer text-gray-500"
                                  onClick={handleEditAddress}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <textarea
                                  className={`w-full bg-[#D9D9D9]/20 outline-none text-black py-2 px-2 
                    font-medium text-base resize-none ${inter.className} border-2 border-black rounded-md`}
                                  rows={5}
                                  value={addressInput}
                                  onChange={(e) =>
                                    setAddressInput(e.target.value)
                                  }
                                />
                                <div className="flex gap-2">
                                  <ClipboardDocumentCheckIcon
                                    className="w-5 h-5 cursor-pointer text-green-500"
                                    onClick={handleSaveAddress}
                                  />
                                  <XMarkIcon
                                    className="w-5 h-5 cursor-pointer text-red-500"
                                    onClick={handleCancelAddress}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div
                            className={`flex flex-col items-center gap-2 ${
                              width < 700 ? "w-full" : "w-4/7"
                            }`}
                          >
                            <div
                              className="w-40 h-40 cursor-pointer"
                              onClick={() => fileInputRef.current.click()}
                              style={{ position: "relative" }}
                              title="Click to edit Profile Picture"
                            >
                              {isBlobUrl ? (
                                // Plain <img> for blob URLs
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "fill",
                                    borderRadius: 8,
                                  }}
                                  className="border"
                                />
                              ) : (
                                // Next.js Image for static or remote URLs
                                <Image
                                  src={profpat?.avatar}
                                  alt="Upload or Capture"
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded border w-full h-full"
                                />
                              )}

                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleImageChange}
                              />
                            </div>
                            <div>
                              {showimgupload && (
                                <div
                                  className={` ${raleway.className} w-full flex flex-row justify-center items-center gap-8`}
                                >
                                  <div className="w-1/2 flex flex-row justify-start items-center">
                                    <p
                                      className="font-semibold italic text-black text-md cursor-pointer"
                                      onClick={resetImage}
                                    >
                                      RESET
                                    </p>
                                  </div>
                                  <div className="w-1/2 flex flex-row justify-end items-center">
                                    <p
                                      className=" cursor-pointer text-center text-black text-md font-semibold "
                                      onClick={() => {
                                        handleUpload({
                                          uhid1: profpat.uhid,
                                          type1: "patient",
                                        });
                                      }}
                                      title="Click to upload in the profile"
                                    >
                                      UPLOAD
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex gap-12 ${
                        width >= 1200 ? "flex-row" : "flex-col"
                      }`}
                    >
                      <div className={`w-full flex flex-col gap-2`}>
                        <p
                          className={`${outfit.className} font-normal text-base text-black/80`}
                        >
                          EMAIL
                        </p>

                        {!isEditEmail ? (
                          <div className="flex items-center gap-2">
                            <span className="text-black/90">
                              {email || "NA"}
                            </span>
                            <PencilSquareIcon
                              className="w-5 h-5 cursor-pointer text-gray-500"
                              onClick={handleEditEmail}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="email"
                              className={`border-b-2 border-black outline-none text-black px-1 w-full ${inter.className}`}
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                            />
                            <ClipboardDocumentCheckIcon
                              className="w-5 h-5 cursor-pointer text-green-500"
                              onClick={handleSaveEmail}
                            />
                            <XMarkIcon
                              className="w-5 h-5 cursor-pointer text-red-500"
                              onClick={handleCancelEmail}
                            />
                          </div>
                        )}
                      </div>

                      <div className={`w-full flex flex-col gap-2`}>
                        <p
                          className={`${outfit.className} font-normal text-base text-black/80`}
                        >
                          ALTERNATE PHONE NUMBER
                        </p>

                        {!isEditAlterPhone ? (
                          <div className="flex items-center gap-2">
                            <span className="text-black/90">
                              {alterphone || "NA"}
                            </span>
                            <PencilSquareIcon
                              className="w-5 h-5 cursor-pointer text-gray-500"
                              onClick={handleEditAlterPhone}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={10}
                              className={`border-b-2 border-black outline-none text-black px-1 w-full ${inter.className}`}
                              value={alterphoneInput}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setAlterPhoneInput(value);
                              }}
                            />
                            <ClipboardDocumentCheckIcon
                              className="w-5 h-5 cursor-pointer text-green-500"
                              onClick={handleSaveAlterPhone}
                            />
                            <XMarkIcon
                              className="w-5 h-5 cursor-pointer text-red-500"
                              onClick={handleCancelAlterPhone}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-5/7 flex flex-col gap-6">
                      <p
                        className={`${outfit.className} font-normal text-base text-black/80`}
                      >
                        ID PROOF
                      </p>

                      {Object.keys(selectedIDs).map((id) => (
                        <div key={id} className="flex flex-col gap-2 mt-2">
                          <label
                            className={`${outfit.className} text-base uppercase text-black/80`}
                          >
                            {id} Number
                          </label>

                          {editingID !== id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-black/90">
                                {selectedIDs[id] && selectedIDs[id].length > 5
                                  ? selectedIDs[id].slice(0, -5) + "*****"
                                  : selectedIDs[id]}
                              </span>

                              <PencilSquareIcon
                                className="w-5 h-5 cursor-pointer text-gray-500"
                                onClick={() => handleEditID(id)}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                className={`w-full border-b-2 border-black outline-none text-black font-medium text-lg px-1 bg-transparent ${inter.className}`}
                                value={idInputs[id] || ""}
                                onChange={(e) =>
                                  handleInputChange(id, e.target.value)
                                }
                                maxLength={idConfig[id]?.maxLength || 50}
                                onBlur={() => {
                                  const error = validateID(id, idInputs[id]);
                                  if (error) {
                                    setIdErrors((prev) => ({
                                      ...prev,
                                      [id]: error,
                                    }));
                                    setIdInputs((prev) => ({
                                      ...prev,
                                      [id]: "",
                                    }));
                                  } else {
                                    setIdErrors((prev) => ({
                                      ...prev,
                                      [id]: "",
                                    }));
                                  }
                                }}
                              />
                              <ClipboardDocumentCheckIcon
                                className="w-5 h-5 cursor-pointer text-green-500"
                                onClick={() => handleSaveID(id)}
                              />
                              <XMarkIcon
                                className="w-5 h-5 cursor-pointer text-red-500"
                                onClick={() => {
                                  handleCancelID(id);
                                }}
                              />
                              {idErrors[id] && (
                                <span className="text-red-500 text-sm">
                                  {idErrors[id]}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
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

      {showresetpassword &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)", // white with 50% opacity
            }}
          >
            <div
              className={`
    h-fit flex flex-col items-center justify-center mx-auto my-auto bg-white p-8 rounded-2xl
    ${width < 950 ? "gap-4 w-full" : "w-1/2"}
  `}
            >
              <h2
                className={`${raleway.className} text-2xl font-semibold text-gray-800 mb-6`}
              >
                Reset Password
              </h2>

              <div
                className={`${poppins.className} w-full flex flex-col gap-8`}
              >
                {/* New Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-base text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full border-b-2 border-gray-400 outline-none px-2 py-2 text-lg bg-transparent text-black"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-base text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="text"
                    className="w-full border-b-2 border-gray-400 outline-none px-2 py-2 text-lg bg-transparent text-black"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleResetPassword}
                  className="cursor-pointer mt-4 w-full bg-[#319B8F] text-white font-semibold py-2 rounded-lg hover:bg-[#26776f] transition-all"
                >
                  Reset Password
                </button>
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
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                  {alertMessage}
                </div>
              </div>
            )}
          </div>,
          document.body // Render to body, outside constrained parent.
        )}

      <Patientregistration
        isOpenacc={isOpenaccpat}
        onCloseacc={() => {
          setIsOpenaccpat(false);
          setSelectedRole("");
        }}
      />

      <Doctorregistration
        isOpenacc={isOpenaccdoc}
        onCloseacc={() => {
          setIsOpenaccdoc(false);
          setSelectedRole("");
        }}
      />

      <Sendreminder
        isOpenreminder={isOpenreminder}
        onClosereminder={() => setisOpenreminder(false)}
        selecteduhid={selectedpatuhid}
      />

      <Patientcompliance
        isOpencompliance={isOpencompliance}
        setisOpencompliance={() => setisOpencompliance(false)}
        selecteduhidcompliance={selecteduhidcompliance}
      />

      <Activationstatus
        isActivationstatus={isActivationstatus}
        setisActivationstatus={setisActivationstatus}
        selectedpatuhidactivation={selectedpatuhidactivation}
      />

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
    </>
  );
};

export default Patientlist;
