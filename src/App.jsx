import React, { useMemo, useState, useEffect } from "react";
import { useUVData } from "./useUVData";
import { motion } from "framer-motion";

import {
  Sun,
  MapPin,
  Shield,
  Bell,
  Share2,
  Shirt,
  Info,
  ChevronRight,
  Droplets,
  TriangleAlert,
  CloudSun,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const melanomaTrendData = [
  { year: 1982, males: 405, females: 593, persons: 998 },
  { year: 1983, males: 415, females: 671, persons: 1086 },
  { year: 1984, males: 426, females: 633, persons: 1059 },
  { year: 1985, males: 495, females: 738, persons: 1233 },
  { year: 1986, males: 545, females: 700, persons: 1245 },
  { year: 1987, males: 679, females: 820, persons: 1499 },
  { year: 1988, males: 726, females: 823, persons: 1549 },
  { year: 1989, males: 598, females: 724, persons: 1322 },
  { year: 1990, males: 593, females: 691, persons: 1284 },
  { year: 1991, males: 608, females: 736, persons: 1344 },
  { year: 1992, males: 617, females: 729, persons: 1346 },
  { year: 1993, males: 603, females: 720, persons: 1323 },
  { year: 1994, males: 655, females: 711, persons: 1366 },
  { year: 1995, males: 678, females: 882, persons: 1560 },
  { year: 1996, males: 664, females: 848, persons: 1512 },
  { year: 1997, males: 699, females: 882, persons: 1581 },
  { year: 1998, males: 602, females: 787, persons: 1389 },
  { year: 1999, males: 655, females: 789, persons: 1444 },
  { year: 2000, males: 631, females: 802, persons: 1433 },
  { year: 2001, males: 631, females: 761, persons: 1392 },
  { year: 2002, males: 629, females: 754, persons: 1383 },
  { year: 2003, males: 598, females: 721, persons: 1319 },
  { year: 2004, males: 627, females: 715, persons: 1342 },
  { year: 2005, males: 611, females: 770, persons: 1381 },
  { year: 2006, males: 596, females: 704, persons: 1300 },
  { year: 2007, males: 506, females: 692, persons: 1198 },
  { year: 2008, males: 563, females: 688, persons: 1251 },
  { year: 2009, males: 580, females: 661, persons: 1241 },
  { year: 2010, males: 521, females: 621, persons: 1142 },
  { year: 2011, males: 496, females: 606, persons: 1102 },
  { year: 2012, males: 521, females: 642, persons: 1163 },
  { year: 2013, males: 498, females: 655, persons: 1153 },
  { year: 2014, males: 488, females: 602, persons: 1090 },
  { year: 2015, males: 460, females: 640, persons: 1100 },
  { year: 2016, males: 517, females: 723, persons: 1240 },
  { year: 2017, males: 525, females: 647, persons: 1172 },
  { year: 2018, males: 507, females: 697, persons: 1204 },
  { year: 2019, males: 539, females: 689, persons: 1228 },
];

const generationalAwarenessData = [
  {
    group: "Gen Z",
    fullLabel: "15-24 years",
    suntan: 20.6,
    sunburn: 15.2,
    sunscreen: 38.9,
  },
  {
    group: "Millennials",
    fullLabel: "35-44 years",
    suntan: 8.1,
    sunburn: 8.0,
    sunscreen: 45.5,
  },
  {
    group: "Boomers",
    fullLabel: "65+ years",
    suntan: 3.3,
    sunburn: 2.0,
    sunscreen: 27.4,
  },
];

const awarenessLegend = [
  { label: "Attempted to suntan", color: "#F28E2B" },
  { label: "Experienced sunburn", color: "#D94F70" },
  { label: "Used sunscreen regularly", color: "#4E79A7" },
];

const mythFacts = [
  {
    title: "You only need sunscreen on sunny days",
    type: "Myth",
    content:
      "UV can still be strong on cloudy days. Daily protection matters even when the weather looks mild.",
  },
  {
    title: "Darker skin tones can still be affected by UV damage",
    type: "Fact",
    content:
      "All skin tones can experience UV damage, pigmentation changes, and long-term skin risks. Protection is still important.",
  },
  {
    title: "Reapplying sunscreen matters during long outdoor periods",
    type: "Fact",
    content:
      "Sweat, water, and time reduce sunscreen effectiveness. Reapplication helps maintain protection throughout the day.",
  },
  {
    title: "A hat alone is enough for full UV protection",
    type: "Myth",
    content:
      "A hat helps, but the best protection combines sunscreen, shade, sunglasses, and suitable clothing.",
  },
  {
    title: "SPF 30 and SPF 50+ make no real difference",
    type: "Myth",
    content:
      "SPF 50+ blocks significantly more UV radiation than SPF 30. For Australian UV conditions, higher SPF is consistently recommended.",
  },
  {
    title: "Windows block UV rays completely",
    type: "Myth",
    content:
      "Standard glass blocks UVB rays but lets UVA rays through. Prolonged time near windows — in cars or offices — can still expose skin to UV damage.",
  },
];

const skinToneOptions = [
  {
    id: "fair",
    name: "Very Fair",
    description: "Burns very easily, rarely tans",
    sensitivity: "Very high UV sensitivity",
    advice: "Use SPF 50+, reapply every 2 hours, wear a hat and seek shade during peak UV.",
    swatch: "#F7D9C7",
  },
  {
    id: "light",
    name: "Light",
    description: "Burns easily, tans slightly",
    sensitivity: "High UV sensitivity",
    advice: "Use SPF 50+, sunglasses, and protective clothing when UV is high or extreme.",
    swatch: "#EAC3A2",
  },
  {
    id: "medium",
    name: "Medium",
    description: "Sometimes burns, gradually tans",
    sensitivity: "Moderate UV sensitivity",
    advice: "Use sunscreen consistently and add clothing protection on high UV days.",
    swatch: "#C98B62",
  },
  {
    id: "olive",
    name: "Olive",
    description: "Rarely burns, tans easily",
    sensitivity: "Moderate UV sensitivity",
    advice: "Protection is still important during prolonged exposure, especially in the Australian sun.",
    swatch: "#A96B46",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Rarely burns",
    sensitivity: "Lower visible burn risk, but UV damage still matters",
    advice: "Use sunscreen for extended outdoor time and support protection with shade and clothing.",
    swatch: "#6E4228",
  },
];

const clothingByRisk = {
  Low: ["Cap or sunglasses optional", "Lightweight short sleeves", "Stay aware if outside for long periods"],
  Moderate: ["Sunglasses recommended", "Light breathable layers", "Use sunscreen on exposed skin"],
  High: ["Wide-brim hat", "Long-sleeve breathable top", "Sunglasses + shade breaks"],
  Extreme: ["Wide-brim hat", "Long sleeves and covered shoulders", "Minimise direct sun and stay in shade"],
};

const sunscreenByRisk = {
  Low: "Light daily coverage is usually enough for shorter exposure.",
  Moderate: "Apply a standard full-face and exposed-skin layer before going out.",
  High: "Use generous SPF 50+ coverage on all exposed skin and reapply on schedule.",
  Extreme: "Apply SPF 50+ generously, reapply carefully, and combine with clothing and shade.",
};

function getUvMeta(uv) {
  if (uv <= 2) {
    return {
      level: "Low",
      message: "You're not at immediate risk of UV damage, but basic protection is still a good habit.",
      badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
      ring: "from-emerald-400 to-lime-300",
    };
  }
  if (uv <= 5) {
    return {
      level: "Moderate",
      message: "Be cautious outdoors and protect exposed skin if you're staying outside for longer.",
      badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
      ring: "from-yellow-400 to-amber-300",
    };
  }
  if (uv <= 7) {
    return {
      level: "High",
      message: "Warning: Your skin is at risk of UV damage. Use sunscreen, clothing protection, and shade.",
      badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
      ring: "from-orange-500 to-amber-400",
    };
  }
  return {
    level: "Extreme",
    message: "Warning: Your skin is at risk of UV damage. Limit direct sun exposure and use maximum protection.",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    ring: "from-rose-500 to-fuchsia-500",
  };
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 min-w-[130px]">
      <div className="flex items-center gap-1.5 text-slate-500">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1 text-base font-semibold text-slate-900 leading-snug">{value}</div>
    </div>
  );
}

function getIntervalMs(intervalValue, intervalUnit) {
  const value = Number(intervalValue) || 1;
  if (intervalUnit === "minutes") return value * 60 * 1000;
  if (intervalUnit === "days") return value * 24 * 60 * 60 * 1000;
  return value * 60 * 60 * 1000;
}

function formatClockTime(date) {
  return date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function MainApp() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [uvIndex, setUvIndex] = useState(null);
  const [myLocation, setMyLocation] = useState("Your location");
  const [searchedLocation, setSearchedLocation] = useState("Melbourne, VIC");
  const [latitude, setLatitude] = useState(-37.8136);
  const [longitude, setLongitude] = useState(144.9631);
  const [locationTimezone, setLocationTimezone] = useState(null);
  const { uvIndex: realUV, loading: uvLoading } = useUVData(latitude, longitude, locationTimezone);

  const isNightTime = realUV === 0;
  const displayUV = realUV !== null && realUV !== undefined ? realUV : uvIndex;
  const uvReady = !uvLoading && displayUV !== null;

  const [skinTone, setSkinTone] = useState(skinToneOptions[1]);
  const [email, setEmail] = useState("student@monash.edu");
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [intervalValue, setIntervalValue] = useState(2);
  const [intervalUnit, setIntervalUnit] = useState("hours");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const reminderRef = React.useRef(null);
  const alertedRef = React.useRef(false);

  const uvMeta = useMemo(() => getUvMeta(displayUV), [displayUV]);
  const clothingTips = clothingByRisk[uvMeta.level];
  const sunscreenTip = sunscreenByRisk[uvMeta.level];
  const nextReminderPreview = useMemo(() => {
    const [hours, minutes] = startTime.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    const initial = new Date();
    initial.setHours(hours, minutes, 0, 0);

    const next = new Date(initial.getTime() + getIntervalMs(intervalValue, intervalUnit));

    return {
      initialLabel: formatClockTime(initial),
      nextLabel: formatClockTime(next),
    };
  }, [startTime, intervalValue, intervalUnit]);



  useEffect(() => {
    if (displayUV >= 3 && !alertedRef.current && Notification.permission === "granted") {
      alertedRef.current = true;
      new Notification("⚠️ UV Alert - SunSmart", {
        body: `UV index is now ${displayUV} (${uvMeta.level}) in ${searchedLocation}. Apply sunscreen before going outside!`,
        icon: "/favicon.ico",
      });
    }
  }, [displayUV, uvMeta.level, searchedLocation]);

  const handleEnableReminder = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Please allow notifications to enable reminders.");
      return;
    }

    if (reminderRef.current) clearInterval(reminderRef.current);

    const unitMs =
      intervalUnit === "minutes"
        ? 60 * 1000
        : intervalUnit === "hours"
        ? 60 * 60 * 1000
        : 24 * 60 * 60 * 1000;

    const intervalMs = Number(intervalValue) * unitMs;

    const [hours, minutes] = startTime.split(":").map(Number);
    const firstReminder = new Date();
    firstReminder.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const delayMs = firstReminder > now ? firstReminder - now : 0;

    const fireNotification = () => {
      new Notification("☀️ SunSmart Reminder", {
        body: `Reminder for ${email} — UV is ${displayUV} (${uvMeta.level}) in ${searchedLocation}. Time to reapply!`,
        icon: "/favicon.ico",
      });
    };

    if (delayMs === 0) {
      fireNotification();
      reminderRef.current = window.setInterval(fireNotification, intervalMs);
    } else {
      setTimeout(() => {
        fireNotification();
        reminderRef.current = window.setInterval(fireNotification, intervalMs);
      }, delayMs);
    }

    setReminderEnabled(true);
    const fireTimeStr = delayMs === 0 ? "now" : startTime;
    alert(`Reminder set! First notification ${fireTimeStr === "now" ? "firing now" : "at " + startTime}, then every ${intervalValue} ${intervalUnit}.`);
  };

  const handleDisableReminder = () => {
    if (reminderRef.current) {
      clearInterval(reminderRef.current);
      reminderRef.current = null;
    }
    setReminderEnabled(false);
    alert("Reminder disabled.");
  };

  const handleDownloadInfo = () => {
    const canvas = document.createElement("canvas");
    const scale = 2;
    const W = 480, H = 600;
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);

    const level = uvMeta.level;
    const gradients = {
      Low: ["#34d399", "#6ee7b7"],
      Moderate: ["#fbbf24", "#fde68a"],
      High: ["#f97316", "#fbbf24"],
      Extreme: ["#f43f5e", "#a855f7"],
    };
    const textColors = { Low: "#065f46", Moderate: "#78350f", High: "#fff", Extreme: "#fff" };
    const [g1, g2] = gradients[level] || gradients.Low;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#ffffff";
    roundRect(ctx, 24, 24, W - 48, H - 48, 20);
    ctx.fill();

    const grad = ctx.createLinearGradient(24, 24, W - 24, 24);
    grad.addColorStop(0, g1);
    grad.addColorStop(1, g2);
    ctx.fillStyle = grad;
    roundRectTop(ctx, 24, 24, W - 48, 140, 20);
    ctx.fill();

    ctx.fillStyle = textColors[level];
    ctx.font = "bold 72px system-ui, sans-serif";
    ctx.fillText(String(displayUV), 44, 110); // decimal value

    ctx.font = "bold 15px system-ui, sans-serif";
    const badgeW = ctx.measureText(level + " Risk").width + 24;
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    roundRect(ctx, 44, 120, badgeW, 28, 14);
    ctx.fill();
    ctx.fillStyle = textColors[level];
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillText(level + " Risk", 56, 139);

    const date = new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
    ctx.fillStyle = "#64748b";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText("📍 " + searchedLocation + "  ·  " + date, 44, 192);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 15px system-ui, sans-serif";
    ctx.fillText("UV Alert", 44, 222);
    ctx.fillStyle = "#475569";
    ctx.font = "13px system-ui, sans-serif";
    wrapText(ctx, uvMeta.message, 44, 242, W - 88, 20);

    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(44, 295);
    ctx.lineTo(W - 44, 295);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText("🧴  SUNSCREEN", 44, 322);
    ctx.fillStyle = "#475569";
    ctx.font = "13px system-ui, sans-serif";
    wrapText(ctx, sunscreenTip, 44, 342, W - 88, 20);

    ctx.strokeStyle = "#f1f5f9";
    ctx.beginPath();
    ctx.moveTo(44, 385);
    ctx.lineTo(W - 44, 385);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText("👕  CLOTHING", 44, 410);
    ctx.fillStyle = "#475569";
    ctx.font = "13px system-ui, sans-serif";
    clothingTips.forEach((tip, i) => {
      ctx.fillText("• " + tip, 44, 432 + i * 22);
    });

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText("Generated by SunSmart UV Awareness App", 44, H - 38);

    const link = document.createElement("a");
    link.download = "sunsmart-uv-" + searchedLocation.replace(/[^a-z0-9]/gi, "-").toLowerCase() + ".png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function roundRectTop(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxW, lineH) {
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line.trim(), x, y);
        y += lineH;
        line = word + " ";
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), x, y);
  }

  const [gpsLoading, setGpsLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = React.useRef(null);

  // AU-specific search state
  const [auSearch, setAuSearch] = useState("");
  const [auSuggestions, setAuSuggestions] = useState([]);
  const [auSuggestionsLoading, setAuSuggestionsLoading] = useState(false);
  const [showAuSuggestions, setShowAuSuggestions] = useState(false);
  const auSearchRef = React.useRef(null);
  const auDebounceRef = React.useRef(null);
  const debounceRef = React.useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (auSearchRef.current && !auSearchRef.current.contains(e.target)) {
        setShowAuSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCityInput = (value) => {
    setCitySearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=6&addressdetails=1`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 350);
  };

  const handleSelectSuggestion = async (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setLatitude(lat);
    setLongitude(lon);

    const a = item.address || {};
    const nameParts = [
      a.road || a.pedestrian || a.neighbourhood || a.suburb || a.quarter,
      a.suburb || a.city_district || a.town || a.city || a.village || a.county,
      a.state_code || a.state,
      a.country_code ? a.country_code.toUpperCase() : null,
    ].filter(Boolean);

    const cleanName =
      nameParts.length >= 2
        ? nameParts.slice(0, 3).join(", ")
        : item.display_name.split(",").slice(0, 2).join(",").trim();

    setSearchedLocation(cleanName);
    setCitySearch("");
    setSuggestions([]);
    setShowSuggestions(false);

    try {
      const tzRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=uv_index&timezone=auto&forecast_days=1`
      );
      const tzData = await tzRes.json();
      if (tzData.timezone) setLocationTimezone(tzData.timezone);
    } catch {}
  };

  const handleAuInput = (value) => {
    setAuSearch(value);
    if (auDebounceRef.current) clearTimeout(auDebounceRef.current);
    if (value.trim().length < 2) {
      setAuSuggestions([]);
      setShowAuSuggestions(false);
      return;
    }
    auDebounceRef.current = setTimeout(async () => {
      setAuSuggestionsLoading(true);
      try {
        // countrycodes=au restricts to Australia only
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=7&addressdetails=1&countrycodes=au`
        );
        const data = await res.json();
        setAuSuggestions(data);
        setShowAuSuggestions(true);
      } catch {
        setAuSuggestions([]);
      } finally {
        setAuSuggestionsLoading(false);
      }
    }, 300);
  };

  const handleSelectAuSuggestion = async (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setLatitude(lat);
    setLongitude(lon);
    const a = item.address || {};
    const nameParts = [
      a.road || a.pedestrian || a.neighbourhood || a.suburb || a.quarter,
      a.suburb || a.city_district || a.town || a.city || a.village,
      a.state_code || a.state,
    ].filter(Boolean);
    const cleanName = nameParts.length >= 2
      ? nameParts.slice(0, 3).join(", ")
      : item.display_name.split(",").slice(0, 2).join(",").trim();
    setSearchedLocation(cleanName);
    setAuSearch("");
    setAuSuggestions([]);
    setShowAuSuggestions(false);
    try {
      const tzRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=uv_index&timezone=auto&forecast_days=1`
      );
      const tzData = await tzRes.json();
      if (tzData.timezone) setLocationTimezone(tzData.timezone);
    } catch {}
  };

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support GPS.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16&addressdetails=1`
          );
          const geoData = await geoRes.json();
          const suburb =
            geoData.address.quarter ||
            geoData.address.neighbourhood ||
            geoData.address.suburb ||
            geoData.address.city_district ||
            geoData.address.city ||
            geoData.address.town ||
            geoData.address.village ||
            geoData.address.state;
          const state = geoData.address.state_code || geoData.address.state;
          setMyLocation(`${suburb}, ${state}`);
          setSearchedLocation(`${suburb}, ${state}`);
        } catch {
          setMyLocation(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
          setSearchedLocation(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
        }
        setLocationTimezone(null);
        setGpsLoading(false);
      },
      () => {
        alert("Could not get your location. Please allow location access.");
        setGpsLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eff6ff_0%,#f8fafc_38%,#eefdf6_100%)] text-slate-900" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {/* Logo row — always visible */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <Sun className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight leading-tight">SunSmart</h1>
                  <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-slate-900">
                    UV Awareness
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 truncate max-w-[180px] sm:max-w-none">
                  SunSmart
                </p>
              </div>
            </div>
            {/* Desktop nav */}
            <div className="hidden sm:flex flex-wrap gap-2 items-center">
              {[["dashboard","Dashboard"],["awareness","Awareness"],["skin","Skin Tone"]].map(([value,label]) => (
                <Button key={value} variant={selectedTab===value?"default":"outline"}
                  className={`rounded-full text-sm ${selectedTab===value?"bg-slate-900 text-white hover:bg-slate-800":"bg-white"}`}
                  onClick={() => setSelectedTab(value)}>{label}</Button>
              ))}

            </div>
            {/* Mobile logout icon */}

          </div>
          {/* Mobile tab row */}
          <div className="sm:hidden mt-3 flex gap-2 overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
            {[["dashboard","Dashboard"],["awareness","Awareness"],["skin","Skin Tone"]].map(([value,label]) => (
              <Button key={value} variant={selectedTab===value?"default":"outline"}
                className={`rounded-full text-sm shrink-0 ${selectedTab===value?"bg-slate-900 text-white":"bg-white"}`}
                onClick={() => setSelectedTab(value)}>{label}</Button>
            ))}
          </div>
        </header>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="hidden" />

          <TabsContent value="dashboard" className="mt-0 space-y-6">
                        <section className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
              <div>
                <Card className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-visible">
                  <CardContent className="p-0">
                        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                          <div className="p-6 sm:p-8">
                            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                              
                            </div>
                            <h2 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
                              Real-time UV guidance.
                            </h2>
                            <p className="mt-4 max-w-2xl text-slate-600">
                              Real-time UV index for your location — know when to cover up.
                            </p>

                            <div className="mt-5 flex gap-3 flex-wrap">
                              <StatPill icon={MapPin} label="Location" value={searchedLocation} />
                              <StatPill icon={TriangleAlert} label="Risk level" value={uvReady ? uvMeta.level : "—"} />
                            </div>
                          </div>

                          <div className="relative flex items-center justify-center bg-slate-950 p-6 text-white sm:p-8 rounded-b-[28px] lg:rounded-b-none lg:rounded-r-[28px]">
                            <div className={`absolute inset-0 bg-gradient-to-br ${uvMeta.ring} opacity-85`} />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.24),transparent_35%)]" />
                            <div className="relative w-full rounded-[28px] border border-white/20 bg-white/10 p-6">
                              <div className="mb-3 flex items-center justify-between">
                                    <span className="text-sm text-white/80">Current UV Index</span>
                                    <CloudSun className="h-5 w-5 text-white/90" />
                              </div>
                              {uvReady ? (
                                <>
                                  <div className="flex items-end gap-3">
                                    <span className="text-6xl font-bold leading-none">{displayUV}</span>
                                    <Badge className="mb-2 rounded-full border-0 bg-white/15 px-3 py-1 text-white shadow-none">
                                      {uvMeta.level}
                                    </Badge>
                                  </div>
                                  <p className="mt-4 text-sm leading-6 text-white/90">{uvMeta.message}</p>
                                </>
                              ) : (
                                <div className="flex flex-col gap-3 mt-1">
                                  <div className="h-16 w-16 rounded-2xl bg-white/15 animate-pulse" />
                                  <div className="h-4 w-48 rounded-xl bg-white/15 animate-pulse" />
                                  <p className="text-sm text-white/60">Fetching UV data...</p>
                                </div>
                              )}
                              {isNightTime && (
                                    <p className="mt-2 text-xs text-white/60 flex items-center gap-1">
                                      🌙 UV is 0
                                    </p>
                              )}
                            </div>
                          </div>
                        </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="h-full rounded-[28px] border border-slate-200 bg-white shadow-sm">
                  <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sparkles className="h-5 w-5" /> Use your Location
                        </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 overflow-visible">
                        <div className="space-y-2">
                          <Label>Current location</Label>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {myLocation}
                          </div>
                        </div>

                        {/* ── AU-specific search ── */}
                        <div className="space-y-2" ref={auSearchRef}>
                          <div className="flex items-center justify-between">
                            <Label>Search in Australia</Label>
                            <span className="text-xs text-slate-400 flex items-center gap-1">🇦🇺 AU only</span>
                          </div>
                          <div className="relative">
                            <div className="flex items-center rounded-xl border-2 border-emerald-400 bg-white px-3 gap-2 focus-within:border-emerald-500 transition-all">
                              <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                              <input
                                value={auSearch}
                                onChange={(e) => handleAuInput(e.target.value)}
                                onFocus={() => auSuggestions.length > 0 && setShowAuSuggestions(true)}
                                placeholder="Suburb, street or landmark..."
                                className="flex-1 py-2.5 text-sm bg-transparent outline-none placeholder:text-slate-400"
                                autoComplete="off"
                              />
                              {auSuggestionsLoading && (
                                <span className="text-xs text-slate-400 shrink-0">searching…</span>
                              )}
                              {auSearch && !auSuggestionsLoading && (
                                <button onClick={() => { setAuSearch(""); setAuSuggestions([]); setShowAuSuggestions(false); }}
                                  className="text-slate-300 hover:text-slate-500 shrink-0 text-lg leading-none">✕</button>
                              )}
                            </div>
                            {showAuSuggestions && auSuggestions.length > 0 && (
                              <div className="absolute z-50 mt-1 w-full rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-y-auto" style={{ maxHeight: "280px" }}>
                                {auSuggestions.map((item, idx) => {
                                  const a = item.address || {};
                                  const primary = a.road || a.pedestrian || a.neighbourhood || a.suburb || a.city || a.town || a.village || item.display_name.split(",")[0];
                                  const suburb = a.suburb || a.city_district || "";
                                  const state = a.state_code || a.state || "";
                                  const secondary = [suburb, state].filter(Boolean).join(", ") || item.display_name.split(",").slice(1, 3).join(",").trim();
                                  const isStreet = item.class === "highway" || item.class === "railway";
                                  const isPlace = item.type === "administrative" || item.class === "place" || item.class === "boundary";
                                  const icon = isStreet ? "📍" : isPlace ? "🏙️" : item.class === "amenity" ? "📌" : "📍";
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleSelectAuSuggestion(item)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-50 border-b border-slate-100 last:border-0 transition-colors touch-manipulation"
                                    >
                                      <span className="text-base shrink-0">{icon}</span>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{primary}</p>
                                        <p className="text-xs text-slate-500 truncate">{secondary}</p>
                                      </div>
                                      <span className="text-xs text-emerald-600 font-medium shrink-0">AU</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ── Global search (divider) ── */}
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-slate-200" />
                          <span className="text-xs text-slate-400 font-medium">or search globally</span>
                          <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="space-y-2" ref={searchRef}>
                          <div className="relative">
                            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 gap-2 focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all">
                              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                              <input
                                value={citySearch}
                                onChange={(e) => handleCityInput(e.target.value)}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                placeholder="Search any city worldwide..."
                                className="flex-1 py-2.5 text-sm bg-transparent outline-none placeholder:text-slate-400"
                                autoComplete="off"
                              />
                              {suggestionsLoading && (
                                <span className="text-xs text-slate-400 shrink-0">searching…</span>
                              )}
                              {citySearch && !suggestionsLoading && (
                                <button onClick={() => { setCitySearch(""); setSuggestions([]); setShowSuggestions(false); }}
                                  className="text-slate-300 hover:text-slate-500 shrink-0 text-lg leading-none">✕</button>
                              )}
                            </div>
                            {showSuggestions && suggestions.length > 0 && (
                              <div className="absolute z-50 mt-1 w-full rounded-2xl border border-slate-200 bg-white shadow-xl overflow-y-auto" style={{ maxHeight: "280px" }}>
                                {suggestions.map((item, idx) => {
                                  const a = item.address || {};
                                  const primary = a.road || a.pedestrian || a.neighbourhood || a.suburb || a.city || a.town || a.village || item.display_name.split(",")[0];
                                  const secondary = item.display_name.split(",").slice(1, 3).join(",").trim();
                                  const typeIcon = item.type === "administrative" || item.class === "place" ? "🏙️" : item.class === "railway" || item.class === "highway" ? "📍" : item.class === "amenity" ? "📌" : "📍";
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleSelectSuggestion(item)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors touch-manipulation"
                                    >
                                      <span className="text-base shrink-0">{typeIcon}</span>
                                      <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{primary}</p>
                                        <p className="text-xs text-slate-500 truncate">{secondary}</p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800" onClick={handleGetGPS}>
                          <MapPin className="mr-2 h-4 w-4" /> {gpsLoading ? "Detecting location..." : "Use current GPS"}
                        </Button>

                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
                          Use your current location or select a different location to check the UV level of that place.
                        </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <ExpandablePanel
                icon={<Shirt className="h-5 w-5" />}
                title="Today's UV Protection Plan"
                badge={<Badge className={`rounded-full border text-xs ${uvMeta.badgeClass}`}>{uvMeta.level}</Badge>}
                summary={`${uvMeta.level} risk · ${clothingTips[0]}`}
              >
                <div className="mt-4 space-y-4">
                  {/* Header label — pic 3 style */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Recommended for today</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xl font-semibold">{uvMeta.level} UV outfit guidance</p>
                      <Badge className={`rounded-full border ${uvMeta.badgeClass}`}>{uvMeta.level}</Badge>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {clothingTips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Head / Eyes / Body grid */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { title: "Head", text: "Hat or cap for direct sun" },
                      { title: "Eyes", text: "Sunglasses for bright exposure" },
                      { title: "Body", text: "Breathable long-sleeve protection" },
                    ].map((item) => (
                      <div key={item.title} className="rounded-2xl border border-slate-100 p-4">
                        <p className="font-semibold text-slate-800">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Share card */}
                  <div id="uv-info-card" className="rounded-2xl bg-slate-950 p-5 text-white">
                    <p className="text-sm text-white/70">☀️ SunSmart UV Info — {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}</p>
                    <p className="mt-1 text-sm text-white/60">📍 {searchedLocation}</p>
                    <p className="mt-3 text-4xl font-bold">{displayUV} <span className="text-lg font-normal text-white/70">UV Index</span></p>
                    <p className="mt-1 text-base font-semibold">{uvMeta.level} Risk</p>
                    <p className="mt-2 text-sm text-white/80">{uvMeta.message}</p>
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">Sunscreen</p>
                      <p className="text-sm text-white/80">{sunscreenTip}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">Clothing</p>
                      {clothingTips.map((tip) => (
                        <p key={tip} className="text-sm text-white/80">• {tip}</p>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-white/30">Generated by SunSmart UV Awareness App</p>
                  </div>

                  {/* Share buttons */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      className="rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:opacity-90"
                      onClick={() => {
                        const caption = `☀️ UV Index: ${displayUV} (${uvMeta.level}) in ${searchedLocation}
${uvMeta.message}

Stay sun smart! #SunSmart #UVAlert #SunProtection`;
                        navigator.clipboard.writeText(caption).then(() => {
                          handleDownloadInfo();
                          alert("📸 Caption copied & image downloading! Open Instagram and paste the caption.");
                        });
                      }}
                    >📸 Instagram</Button>
                    <Button
                      className="rounded-xl bg-[#1877F2] text-white hover:bg-[#1665d8]"
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        const text = encodeURIComponent(`UV Index: ${displayUV} (${uvMeta.level}) in ${searchedLocation}. ${uvMeta.message} Stay sun smart!`);
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, "_blank");
                      }}
                    >👍 Facebook</Button>
                    <Button
                      className="rounded-xl bg-slate-900 text-white hover:bg-slate-700"
                      onClick={() => {
                        const text = encodeURIComponent(`☀️ UV Index: ${displayUV} (${uvMeta.level}) in ${searchedLocation}.
${uvMeta.message}

Stay sun smart! #SunSmart #UVAlert`);
                        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
                      }}
                    >𝕏 Twitter</Button>
                    <Button variant="outline" className="rounded-xl bg-white" onClick={handleDownloadInfo}>⬇️ Download</Button>
                  </div>
                </div>
              </ExpandablePanel>

              <ExpandablePanel
                icon={<Bell className="h-5 w-5" />}
                title="Sunscreen Reminder"
                badge={reminderEnabled
                  ? <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 font-semibold">On ✓</span>
                  : <span className="rounded-full bg-slate-100 text-slate-500 text-xs px-2 py-0.5">Off</span>}
                summary={reminderEnabled
                  ? `Reminding you every ${intervalValue} ${intervalUnit} · next at ${nextReminderPreview?.nextLabel || startTime}`
                  : "Set a reminder to reapply sunscreen"}
              >
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Initial application time</Label>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reminder interval</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={99}
                          value={intervalValue}
                          onChange={(e) => setIntervalValue(Number(e.target.value))}
                          className="rounded-xl w-24"
                          placeholder="e.g. 2"
                        />
                        <select
                          value={intervalUnit}
                          onChange={(e) => setIntervalUnit(e.target.value)}
                          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Reminder email <span className="text-xs text-slate-400 font-normal">(used in notification message)</span></Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="rounded-xl"
                    />
                    <p className="text-xs text-slate-400">This appears in your browser notification so you know which account it's for.</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="rounded-xl bg-slate-900 hover:bg-slate-800"
                      onClick={reminderEnabled ? handleDisableReminder : handleEnableReminder}
                    >
                      {reminderEnabled ? "Reminder On ✓ (click to disable)" : "Enable reminder"}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl bg-white"
                      onClick={async () => {
                        const perm = Notification.permission === "granted"
                          ? "granted"
                          : await Notification.requestPermission();
                        if (perm === "granted") {
                          new Notification("☀️ SunSmart Preview", {
                            body: `Reminder for ${email} — UV is ${displayUV} (${uvMeta.level}) in ${searchedLocation}. Time to reapply sunscreen!`,
                            icon: "/favicon.ico",
                          });
                        } else {
                          alert("Notifications are blocked. Please allow them in your browser settings.");
                        }
                      }}
                    >
                      Preview notification
                    </Button>
                  </div>


                  <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">
                    Next: <span className="font-semibold text-slate-800">{nextReminderPreview?.nextLabel || startTime}</span> → every <span className="font-semibold text-slate-800">{intervalValue} {intervalUnit}</span>
                  </div>
                </div>
              </ExpandablePanel>
            </div>
          </TabsContent>

          <TabsContent value="awareness" className="mt-0 space-y-6">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="rounded-[28px] border-white/60 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle>Young adult melanoma trends</CardTitle>
                  <CardDescription>
                    A long-term trend view helps connect sun-safety behaviour with real melanoma burden in Australians aged 15 to 39.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full text-slate-700">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={melanomaTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" tickLine={false} axisLine={false} interval={5} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip
                          formatter={(value, name) => {
                            const labels = {
                              males: "Males",
                              females: "Females",
                              persons: "Persons",
                            };
                            return [`${value}`, labels[name] || name];
                          }}
                          labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="males"
                          name="Males"
                          stroke="#2563EB"
                          strokeWidth={3}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="females"
                          name="Females"
                          stroke="#D946EF"
                          strokeWidth={3}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="persons"
                          name="Persons"
                          stroke="#0F172A"
                          strokeWidth={3}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    The chart shows how melanoma cases in young adults rose through the late 1980s and 1990s, then generally trended lower in later years while still remaining substantial.
                  </p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Source: AIHW Australian Cancer Database and National Mortality Database.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-white/60 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle>Generational sun-safety snapshot</CardTitle>
                  <CardDescription>
                    This compares tanning, sunburn, and sunscreen habits across age groups so the awareness feature tells a clearer story.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full text-slate-700">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={generationalAwarenessData} barGap={10}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="group" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} domain={[0, 50]} />
                        <Tooltip
                          formatter={(value) => [`${value}%`, ""]}
                          labelFormatter={(label, payload) => {
                            const item = payload?.[0]?.payload;
                            return item ? `${label} (${item.fullLabel})` : label;
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="suntan"
                          name="Attempted to suntan"
                          fill="#F28E2B"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="sunburn"
                          name="Experienced sunburn"
                          fill="#D94F70"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="sunscreen"
                          name="Used sunscreen regularly"
                          fill="#4E79A7"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {awarenessLegend.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Gen Z shows the highest tanning and sunburn rates, while Millennials report the strongest regular sunscreen use. That contrast gives the awareness tab a stronger educational message.
                  </p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Source:
                    {" "}
                    <a
                      href="https://www.abs.gov.au/statistics/health/health-conditions-and-risks/sun-protection-behaviours/latest-release"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2"
                    >
                      ABS Sun Protection Behaviours
                    </a>
                    {" "}
                    latest release.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">

                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-[28px] border-white/60 bg-white/75 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Info className="h-5 w-5" /> Know Your Facts
                </CardTitle>
                <CardDescription>
                  Tap any card to find out whether the statement is a myth or a fact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mythFacts.map((item) => (
                    <FlipCard key={item.title} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skin" className="mt-0 space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
              <Card className="rounded-[28px] border-white/60 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle>Skin tone and UV sensitivity</CardTitle>
                  <CardDescription>
                    Click on any skin type to view related information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {skinToneOptions.map((option) => {
                      const active = skinTone.id === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setSkinTone(option)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <span
                              className="h-8 w-8 rounded-full border border-black/10"
                              style={{ backgroundColor: option.swatch }}
                            />
                            <div>
                              <p className="font-semibold">{option.name}</p>
                              <p className={`text-xs ${active ? "text-white/70" : "text-slate-500"}`}>{option.description}</p>
                            </div>
                          </div>
                          <p className={`text-sm leading-6 ${active ? "text-white/85" : "text-slate-600"}`}>{option.sensitivity}</p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-white/60 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle>Selected protection guidance</CardTitle>
                  <CardDescription>Here are some recommendation from us based on your skin type!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="h-10 w-10 rounded-full border border-black/10" style={{ backgroundColor: skinTone.swatch }} />
                      <div>
                        <p className="text-lg font-semibold">{skinTone.name}</p>
                        <p className="text-sm text-slate-500">{skinTone.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full bg-white">
                      {skinTone.sensitivity}
                    </Badge>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{skinTone.advice}</p>
                  </div>


                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>

        <footer className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>This is a prototype for the full application. Stay tuned!</p>
            <p>SunSmart ©</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ExpandablePanel({ icon, title, badge, summary, children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left transition-colors touch-manipulation"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-900 text-white shrink-0">
            {icon}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900">{title}</span>
              {badge}
            </div>
            {!open && <p className="text-xs text-slate-500 truncate mt-0.5">{summary}</p>}
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Flip Card Component ──────────────────────────────────────────────────────
function FlipCard({ item }) {
  const [flipped, setFlipped] = React.useState(false);
  const isFact = item.type === "Fact";
  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      style={{ perspective: "1000px", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
      className="h-44"
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.45, 0.05, 0.55, 0.95)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-center p-5 text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-shadow"
        >
          <p className="text-sm font-medium text-slate-800 leading-6">{item.title}</p>
          <p className="mt-3 text-xs text-slate-400">Tap to reveal →</p>
        </div>
        {/* BACK */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className={`absolute inset-0 rounded-2xl flex flex-col justify-between p-5 shadow-sm ${
            isFact
              ? "bg-emerald-50 border border-emerald-200"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          <div>
            <span
              className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold tracking-wide mb-2 ${
                isFact ? "bg-emerald-200 text-emerald-800" : "bg-amber-200 text-amber-900"
              }`}
            >
              {item.type.toUpperCase()}
            </span>
            <p className="text-xs leading-5 text-slate-700">{item.content}</p>
          </div>
          <p className="text-xs text-slate-400 mt-2">Tap to flip back ↩</p>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function SunSmartUIMockup() {
  return <MainApp />;
}
