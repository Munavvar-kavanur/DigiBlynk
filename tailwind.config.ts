import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            animation: {
                wave: "wave 15s linear infinite",
            },
            keyframes: {
                wave: {
                    "0%": { transform: "translateX(0) translateZ(0) scaleY(1)" },
                    "50%": { transform: "translateX(-25%) translateZ(0) scaleY(0.55)" },
                    "100%": { transform: "translateX(-50%) translateZ(0) scaleY(1)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
