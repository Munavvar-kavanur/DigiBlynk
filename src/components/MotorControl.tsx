"use client";

import { motion } from "framer-motion";
import { Power, RotateCw } from "lucide-react";

interface MotorControlProps {
    isOn: boolean;
    onToggle: () => void;
    isPending: boolean;
}

export default function MotorControl({ isOn, onToggle, isPending }: MotorControlProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border bg-black/40 p-6 backdrop-blur-xl border-white/10 flex flex-col items-center justify-center gap-6 group">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="text-center z-10">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    Main Pump
                </h3>
                <p className="text-sm text-white/50 mt-1">Manual Override</p>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggle}
                disabled={isPending}
                className={`relative flex h-32 w-32 items-center justify-center rounded-full border-4 shadow-[0_0_40px_-10px] transition-all duration-500 ${isOn
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-emerald-500/30"
                        : "border-rose-500 bg-rose-500/10 text-rose-400 shadow-rose-500/10 grayscale opacity-80"
                    } ${isPending ? "cursor-wait opacity-80" : "cursor-pointer"}`}
            >
                {isPending ? (
                    <RotateCw className="h-12 w-12 animate-spin text-white/80" />
                ) : (
                    <Power className="h-12 w-12" strokeWidth={isOn ? 3 : 2} />
                )}

                {/* Glow ring */}
                <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${isOn ? "bg-emerald-500/40 opacity-100" : "opacity-0"}`} />
            </motion.button>

            <div className="z-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                <div className={`h-2 w-2 rounded-full ${isOn ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" : "bg-rose-500"}`} />
                <span className="text-xs font-semibold tracking-wide text-white/80">
                    {isPending ? "SYNCING..." : isOn ? "SYSTEM ACTIVE" : "SYSTEM IDLE"}
                </span>
            </div>
        </div>
    );
}
