"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    status: "success" | "warning" | "error" | "info";
    subtext?: string;
    delay?: number;
}

export default function StatusCard({
    title,
    value,
    icon: Icon,
    status,
    subtext,
    delay = 0,
}: StatusCardProps) {
    const colors = {
        success: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
        warning: "text-amber-400 border-amber-500/20 bg-amber-500/10",
        error: "text-rose-400 border-rose-500/20 bg-rose-500/10",
        info: "text-blue-400 border-blue-500/20 bg-blue-500/10",
    };

    const statusColor = colors[status] || colors.info;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={`relative overflow-hidden rounded-2xl border bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 ${statusColor.split(" ")[1]}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-white/50">{title}</p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        {value}
                    </h3>
                    {subtext && (
                        <p className={`mt-1 text-xs font-medium ${statusColor.split(" ")[0]}`}>
                            {subtext}
                        </p>
                    )}
                </div>
                <div className={`rounded-xl p-3 ${statusColor}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            {/* Decorative background glow */}
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl opacity-20 ${statusColor.split(" ")[2].replace("bg-", "bg-")}`} />
        </motion.div>
    );
}
