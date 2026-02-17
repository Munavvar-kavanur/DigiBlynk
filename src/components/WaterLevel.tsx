"use client";

import { motion } from "framer-motion";
import { Droplets, AlertTriangle } from "lucide-react";

interface WaterLevelProps {
    topSensor: boolean;
    bottomSensor: boolean;
}

export default function WaterLevel({ topSensor, bottomSensor }: WaterLevelProps) {
    let waterLevel = 0;
    let statusColor = "bg-rose-500";
    let statusText = "Critically Low";
    let waveColor = "rgba(244, 63, 94, 0.4)"; // Red

    if (topSensor) {
        waterLevel = 100;
        statusColor = "bg-emerald-500";
        statusText = "Full Capacity";
        waveColor = "rgba(16, 185, 129, 0.4)"; // Emerald
    } else if (bottomSensor) {
        waterLevel = 60;
        statusColor = "bg-blue-500";
        statusText = "Water Available";
        waveColor = "rgba(59, 130, 246, 0.4)"; // Blue
    } else {
        waterLevel = 10;
        statusText = "Tank Empty";
    }

    return (
        <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl">
            {/* Container Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

            {/* Stats overlay */}
            <div className="absolute left-0 right-0 top-0 z-20 flex justify-between p-6">
                <div>
                    <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">Tank Level</h2>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{waterLevel}%</span>
                        <span className={`text-sm font-medium ${topSensor ? "text-emerald-400" : bottomSensor ? "text-blue-400" : "text-rose-400"}`}>
                            {statusText}
                        </span>
                    </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 ${waterLevel < 20 ? "animate-pulse" : ""}`}>
                    <Droplets className={`h-6 w-6 ${waterLevel > 80 ? "text-emerald-400" : "text-blue-400"}`} />
                </div>
            </div>

            {/* Water Fill Animation */}
            <div className="absolute bottom-0 left-0 right-0 z-10 w-full overflow-hidden rounded-b-3xl">
                <motion.div
                    initial={{ height: "0%" }}
                    animate={{ height: `${waterLevel}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 60 }}
                    className={`relative w-full ${statusColor} opacity-80 backdrop-blur-sm transition-all duration-700`}
                >
                    {/* Wave effect at top of water */}
                    <div className="absolute -top-4 w-[200%] h-8 animate-wave opacity-50 block"
                        style={{ background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23ffffff' fill-opacity='0.2'/%3E%3C/svg%3E") repeat-x` }}>
                    </div>
                </motion.div>
            </div>

            {/* Glass overlay highlight */}
            <div className="absolute inset-0 z-30 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />

            {/* Sensor Indicators on the side */}
            <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10">
                    <div className={`h-2 w-2 rounded-full ${topSensor ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-white/20"}`} />
                    <span className="text-xs font-medium text-white/70">Top Sensor</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10">
                    <div className={`h-2 w-2 rounded-full ${bottomSensor ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-white/20"}`} />
                    <span className="text-xs font-medium text-white/70">Btm Sensor</span>
                </div>
            </div>

            {/* Warning if Critical */}
            {!bottomSensor && (
                <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/40 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-6 backdrop-blur-xl animate-pulse">
                        <AlertTriangle className="h-8 w-8 text-rose-500" />
                        <span className="text-rose-200 font-bold">CRITICAL: EMPTY</span>
                    </div>
                </div>
            )}
        </div>
    );
}
