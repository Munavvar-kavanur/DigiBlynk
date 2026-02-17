"use client";

import { motion } from "framer-motion";
import { Droplets, AlertTriangle, Waves } from "lucide-react";

interface WaterLevelProps {
    topSensor: boolean;
    bottomSensor: boolean;
}

export default function WaterLevel({ topSensor, bottomSensor }: WaterLevelProps) {
    let waterLevel = 0;
    let statusColor = "from-rose-500 to-rose-600";
    let statusText = "Critically Low";
    let glowColor = "rgba(244, 63, 94, 0.5)"; // Red

    if (topSensor) {
        waterLevel = 92; // Don't go 100% to keep waves visible
        statusColor = "from-emerald-400 to-emerald-600";
        statusText = "Full Capacity";
        glowColor = "rgba(52, 211, 153, 0.5)"; // Emerald
    } else if (bottomSensor) {
        waterLevel = 55;
        statusColor = "from-blue-400 to-blue-600";
        statusText = "Water Available";
        glowColor = "rgba(59, 130, 246, 0.5)"; // Blue
    } else {
        waterLevel = 8;
        statusText = "Tank Empty";
    }

    const waveVariants = {
        animate: (i: number) => ({
            x: ["0%", "-50%"],
            transition: {
                repeat: Infinity,
                ease: "linear" as const,
                duration: 8 + i * 4, // Variable speeds
                repeatType: "loop" as const,
            },
        }),
    };

    return (
        <div className="relative h-full min-h-[500px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0c0e] shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]">

            {/* 3D Container Shine/Reflection */}
            <div className="absolute inset-0 z-40 rounded-[2rem] shadow-[inset_0_0_40px_rgba(255,255,255,0.05),inset_10px_0_20px_rgba(255,255,255,0.02)] pointer-events-none" />

            {/* Background Depth Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

            {/* Stats Header */}
            <div className="absolute left-0 right-0 top-0 z-50 flex justify-between p-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Waves className="h-4 w-4 text-white/40" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Real-time Level</h2>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-5xl font-black tracking-tight text-white mb-1">
                            {waterLevel === 92 ? "100" : waterLevel === 8 ? "0" : waterLevel}%
                        </span>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md`}>
                            <div className={`h-1.5 w-1.5 rounded-full ${topSensor ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : bottomSensor ? "bg-blue-400 shadow-[0_0_8px_#60a5fa]" : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"}`} />
                            <span className={`text-xs font-semibold ${topSensor ? "text-emerald-400" : bottomSensor ? "text-blue-400" : "text-rose-400"}`}>
                                {statusText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Liquid Container */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end">
                <motion.div
                    initial={{ height: "0%" }}
                    animate={{ height: `${waterLevel}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 40 }}
                    className="relative w-full"
                    style={{ boxShadow: `0 -10px 40px ${glowColor}` }}
                >
                    {/* Surface Line (Meniscus) */}
                    <div className={`absolute -top-[1px] left-0 right-0 h-[2px] w-full bg-white/30 z-40 blur-[1px]`} />

                    {/* Wave Layer 1 (Back/Slow) */}
                    <motion.div
                        custom={1}
                        variants={waveVariants}
                        animate="animate"
                        className="absolute -top-[60px] left-0 h-[80px] w-[200%] opacity-30"
                        style={{
                            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 800 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50C150 50 250 0 400 0C550 0 650 50 800 50V100H0V50Z' fill='white'/%3E%3C/svg%3E") repeat-x`,
                            backgroundSize: "50% 100%",
                        }}
                    />

                    {/* Wave Layer 2 (Middle/Medium) */}
                    <motion.div
                        custom={0.5}
                        variants={waveVariants}
                        animate="animate"
                        className="absolute -top-[45px] left-0 h-[80px] w-[200%] opacity-40 mix-blend-overlay"
                        style={{
                            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 800 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30C200 80 300 0 400 0C500 0 600 80 800 30V100H0V30Z' fill='white'/%3E%3C/svg%3E") repeat-x`,
                            backgroundSize: "50% 100%",
                            scaleX: -1 // Flip for variety
                        }}
                    />

                    {/* Wave Layer 3 (Front/Fast) */}
                    <motion.div
                        custom={0.2}
                        variants={waveVariants}
                        animate="animate"
                        className={`absolute -top-[30px] left-0 h-[60px] w-[200%] bg-gradient-to-r ${statusColor} opacity-100`}
                        style={{
                            maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 800 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50C200 90 300 10 400 10C500 10 600 90 800 50V100H0V50Z' fill='black'/%3E%3C/svg%3E")`,
                            maskSize: "50% 100%",
                            WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 800 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50C200 90 300 10 400 10C500 10 600 90 800 50V100H0V50Z' fill='black'/%3E%3C/svg%3E")`,
                            WebkitMaskSize: "50% 100%",
                        }}
                    />

                    {/* Main Water Body Gradient */}
                    <div className={`h-full w-full bg-gradient-to-b ${statusColor} opacity-90 backdrop-blur-sm`} />

                    {/* Deep Water Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Bubbles / Particles */}
                    <div className="absolute inset-x-0 bottom-0 h-full overflow-hidden pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute bottom-[-20px] rounded-full bg-white/20 blur-[1px]"
                                style={{
                                    left: `${15 + i * 15}%`,
                                    width: 4 + (i % 3) * 4,
                                    height: 4 + (i % 3) * 4,
                                }}
                                animate={{
                                    y: [-20, -400],
                                    x: [0, (i % 2 === 0 ? 20 : -20)],
                                    opacity: [0, 0.5, 0],
                                }}
                                transition={{
                                    duration: 5 + Math.random() * 5,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                    delay: i * 1.5,
                                }}
                            />
                        ))}
                    </div>

                </motion.div>
            </div>

            {/* Sensor Indicators (Visual Only) */}
            <div className="absolute right-6 bottom-10 z-50 flex flex-col gap-8">
                {/* Top Sensor Mark */}
                <div className="relative group">
                    <div className={`absolute -left-12 top-1/2 -translate-y-1/2 h-[1px] w-8 ${topSensor ? "bg-emerald-500/50" : "bg-white/10"}`} />
                    <div className={`flex items-center justify-center p-2 rounded-xl backdrop-blur-md border border-white/5 bg-black/40 shadow-lg ${topSensor ? "border-emerald-500/50" : ""}`}>
                        <div className={`h-2 w-2 rounded-full ${topSensor ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-white/10"}`} />
                    </div>
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 text-[10px] font-medium text-white/30 uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Top Limit
                    </span>
                </div>

                {/* Bottom Sensor Mark */}
                <div className="relative group">
                    <div className={`absolute -left-12 top-1/2 -translate-y-1/2 h-[1px] w-8 ${bottomSensor ? "bg-blue-500/50" : "bg-white/10"}`} />
                    <div className={`flex items-center justify-center p-2 rounded-xl backdrop-blur-md border border-white/5 bg-black/40 shadow-lg ${bottomSensor ? "border-blue-500/50" : ""}`}>
                        <div className={`h-2 w-2 rounded-full ${bottomSensor ? "bg-blue-400 shadow-[0_0_10px_#60a5fa]" : "bg-white/10"}`} />
                    </div>
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 text-[10px] font-medium text-white/30 uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Btm Limit
                    </span>
                </div>
            </div>

            {/* Critical Alert Overlay */}
            {!bottomSensor && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="flex flex-col items-center gap-3 animate-pulse">
                        <div className="p-4 rounded-full bg-rose-500/20 backdrop-blur-xl border border-rose-500/30">
                            <AlertTriangle className="h-10 w-10 text-rose-500 shadow-[0_0_20px_#f43f5e]" />
                        </div>
                        <span className="text-rose-400 font-bold tracking-widest uppercase text-sm drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                            Refill Required
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
