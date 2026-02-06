import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    iconOnly?: boolean;
    className?: string;
    showText?: boolean;
}

export const Logo = ({ className = "", iconOnly = false, showText = true, ...props }: LogoProps) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 flex-shrink-0"
                {...props}
            >
                {/* 
                   Concept: Abstract "H" Shield 
                   - Strong vertical pillars for stability (HR/Corporate)
                   - Connected by a dynamic bridge (Human connection)
                   - Subtle shield shape implied
                */}
                <rect x="2" y="4" width="8" height="24" rx="3" fill="currentColor" />
                <rect x="22" y="4" width="8" height="24" rx="3" fill="currentColor" />

                {/* The crossbar - slightly angled visually or stylized */}
                <path
                    d="M10 16H22"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                {/* Accent: A small dot or 'head' implying a person or 'check' */}
                <circle cx="26" cy="6" r="3" className="text-blue-500" fill="currentColor" />
            </svg>

            {showText && !iconOnly && (
                <span className="font-bold text-xl tracking-tight text-[#0C212F] dark:text-white">
                    Humana
                </span>
            )}
        </div>
    );
};

export const LogoIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 4C6.34315 4 5 5.34315 5 7V25C5 26.6569 6.34315 28 8 28C9.65685 28 11 26.6569 11 25V19H21V25C21 26.6569 22.3431 28 24 28C25.6569 28 27 26.6569 27 25V7C27 5.34315 25.6569 4 24 4C22.3431 4 21 5.34315 21 7V13H11V7C11 5.34315 9.65685 4 8 4Z"
            fill="currentColor"
        />
        {/* Verification Checkmark accent overlay */}
        <path
            d="M23 7L25 9L29 5"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
