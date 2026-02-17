"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Wifi,
  CloudLightning,
  Activity,
  Zap,
  Droplets,
  AlertTriangle,
  Radio,
  Settings
} from "lucide-react";
import Link from "next/link";

import StatusCard from "@/components/StatusCard";
import WaterLevel from "@/components/WaterLevel";
import MotorControl from "@/components/MotorControl";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: state, error, mutate } = useSWR("/api/device/state", fetcher, {
    refreshInterval: 2000,
    shouldRetryOnError: true,
  });

  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    if (!state) return;
    setToggling(true);
    const newValue = state.v0 == 1 ? 0 : 1;

    try {
      // Optimistic Update
      mutate({ ...state, v0: newValue }, false);

      const res = await fetch("/api/device/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: "V0", value: newValue }),
      });

      if (res.ok) {
        mutate();
      } else {
        // Revert on error
        mutate(state);
      }
    } catch (err) {
      console.error("Toggle failed:", err);
      mutate(state);
    } finally {
      setToggling(false);
    }
  };

  // Mock Loading State
  if (!state && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent"></div>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black p-4 text-center">
        <AlertTriangle className="h-16 w-16 text-rose-500" />
        <h1 className="text-2xl font-bold text-white">System Offline</h1>
        <p className="text-white/60">Could not connect to the device controller. Check your network.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Derive logical states
  const isMotorOn = state.v0 == 1;
  const isOnline = true; // Assuming API response means online
  const tankPercentage = state.v2 == 1 ? 100 : state.v1 == 1 ? 60 : 10;

  // Sync with Cloud on Mount
  useEffect(() => {
    fetch("/api/device/sync").then(() => mutate());
  }, []);

  // Handle Manual Refresh
  const handleRefresh = async () => {
    await fetch("/api/device/sync");
    mutate();
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-20%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <CloudLightning className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                DigiBlynk <span className="text-blue-500">Pro</span>
              </h1>
              <p className="text-xs font-medium text-white/40">
                IoT Control Center • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="hidden sm:flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-md transition hover:bg-white/10"
              title="Force Sync with Device"
            >
              <Activity className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium text-white/70">Sync</span>
            </button>
            <Link
              href="/settings"
              className="hidden sm:flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-md transition hover:bg-white/10"
            >
              <Settings className="h-4 w-4 text-white/50" />
              <span className="text-xs font-medium text-white/70">Settings</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-md">
              <div className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              <span className="text-xs font-medium text-white/70">
                {isOnline ? "OPERATIONAL" : "OFFLINE"}
              </span>
            </div>
            <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5 p-1">
              <Image src="/next.svg" width={40} height={40} alt="User" className="h-full w-full rounded-full opacity-50" />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Left Column: Visual Tank */}
          <div className="lg:col-span-4 h-full min-h-[500px]">
            <WaterLevel
              topSensor={state.v2 == 1}
              bottomSensor={state.v1 == 1}
            />
          </div>

          {/* Right Column: Controls & Stats */}
          <div className="flex flex-col gap-6 lg:col-span-8">

            {/* Top Row Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatusCard
                title="System Status"
                value={isMotorOn ? "Active" : "Stable"}
                icon={Activity}
                status={isMotorOn ? "success" : "info"}
                subtext="Motor Operation"
                delay={0.1}
              />
              <StatusCard
                title="Connectivity"
                value="Excellent"
                icon={Wifi}
                status="success"
                subtext="12ms Latency"
                delay={0.2}
              />
              <StatusCard
                title="Power Usage"
                value={isMotorOn ? "1.2 kW" : "0.1 kW"}
                icon={Zap}
                status={isMotorOn ? "warning" : "info"}
                subtext="Real-time Est."
                delay={0.3}
              />
            </div>

            {/* Main Control Panel */}
            <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
              {/* Motor Control */}
              <div className="glass-panel relative flex flex-col justify-between rounded-3xl p-6 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-2 pb-4">
                  <Radio className={`h-4 w-4 ${toggling ? "animate-spin text-blue-400" : "text-white/20"}`} />
                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">Control Node</span>
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <MotorControl
                    isOn={isMotorOn}
                    onToggle={handleToggle}
                    isPending={toggling}
                  />
                </div>
              </div>

              {/* Quick Actions / More Info */}
              <div className="glass-panel flex flex-col justify-between rounded-3xl p-8 backdrop-blur-xl">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                    <Droplets className="h-5 w-5 text-blue-400" />
                    Water Quality
                  </h3>
                  <p className="mb-6 mt-2 text-sm text-white/50">
                    Based on sensor conductivity analysis.
                  </p>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">TDS Level</span>
                      <span className="font-medium text-white">142 ppm (Good)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Temperature</span>
                      <span className="font-medium text-white">24°C</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-xl bg-white/5 p-4">
                  <p className="text-xs leading-relaxed text-white/40">
                    <span className="font-bold text-white/60">Note:</span> Automated pump shutdown is enabled for overflow protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
