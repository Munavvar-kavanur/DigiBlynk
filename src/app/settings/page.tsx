"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Copy,
    Check,
    Globe,
    Server,
    Info
} from "lucide-react";
import Link from "next/link";

export default function Settings() {
    const [publicUrl, setPublicUrl] = useState("");
    const [copied, setCopied] = useState<string | null>(null);

    // Load saved URL from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("digiblynk_public_url");
        if (saved) setPublicUrl(saved);
    }, []);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setPublicUrl(url);
        localStorage.setItem("digiblynk_public_url", url);
    };

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const getWebhookUrl = (pin: string = "{PIN}", value: string = "{VALUE}") => {
        const baseUrl = publicUrl.replace(/\/$/, "") || "YOUR_PUBLIC_DOMAIN";
        return `${baseUrl}/api/webhook?pin=${pin}&value=${value}`;
    };

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-blue-500/30">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-20%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Navigation */}
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                <header className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        System Settings
                    </h1>
                    <p className="mt-2 text-white/50">
                        Configure integration endpoints and manage connection preferences.
                    </p>
                </header>

                <div className="space-y-8">

                    {/* Public URL Configuration */}
                    <section className="glass-panel rounded-3xl p-8 backdrop-blur-xl">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-blue-500/20 p-3 text-blue-400">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Public Domain Configuration</h2>
                                    <p className="text-sm text-white/50">
                                        Enter the public URL provided by ngrok or your hosting provider (e.g., https://xyz.ngrok-free.app).
                                    </p>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="https://your-domain.com"
                                        value={publicUrl}
                                        onChange={handleUrlChange}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/20 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Webhook Generator */}
                    <section className="glass-panel rounded-3xl p-8 backdrop-blur-xl">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-400">
                                <Server className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Blynk Webhook Setup</h2>
                                <p className="text-sm text-white/50">
                                    Use these URLs in your Blynk.console Webhook settings to sync data to this platform.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Main Template */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-medium uppercase tracking-wider text-white/40">Universal Pattern</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <code className="flex-1 overflow-x-auto rounded-lg bg-black/50 px-3 py-2 font-mono text-sm text-blue-300">
                                        {getWebhookUrl()}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(getWebhookUrl(), 'universal')}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition"
                                    >
                                        {copied === 'universal' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-white/70" />}
                                    </button>
                                </div>
                            </div>

                            {/* Individual Examples */}
                            <div className="mt-8">
                                <h3 className="mb-4 text-sm font-medium text-white/70">Example Configurations</h3>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                                    {/* V0 Motor */}
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs font-bold text-white/80">V0 - Motor Control</span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 truncate font-mono text-xs text-white/50">
                                                .../api/webhook?pin=V0&value={'{value}'}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(getWebhookUrl('V0', '{value}'), 'v0')}
                                                className="text-white/40 hover:text-white"
                                            >
                                                {copied === 'v0' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* V1 Sensor */}
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs font-bold text-white/80">V1 - Bottom Sensor</span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 truncate font-mono text-xs text-white/50">
                                                .../api/webhook?pin=V1&value={'{value}'}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(getWebhookUrl('V1', '{value}'), 'v1')}
                                                className="text-white/40 hover:text-white"
                                            >
                                                {copied === 'v1' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                            <Info className="h-5 w-5 shrink-0 text-amber-500" />
                            <p className="text-xs leading-relaxed text-amber-200/80">
                                <strong>Important:</strong> Ensure your 'RequestMethod' is set to <strong>GET</strong> in Blynk console. replace <code>{'{value}'}</code> checks with the actual datastream value parameter provided by Blynk's UI.
                            </p>
                        </div>

                    </section>

                </div>
            </div>
        </main>
    );
}
