"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

interface TimePickerProps {
    value: string; // HH:mm
    onChange: (value: string) => void;
    className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
    const [hours, minutes] = value.split(":");

    const handleHourChange = (newHour: string) => {
        onChange(`${newHour}:${minutes}`);
    };

    const handleMinuteChange = (newMinute: string) => {
        onChange(`${hours}:${newMinute}`);
    };

    const hoursList = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
    );
    const minutesList = Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, "0")
    );

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Select value={hours} onValueChange={handleHourChange}>
                <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="h-[200px]">
                    {hoursList.map((h) => (
                        <SelectItem key={h} value={h}>
                            {h}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <span className="text-slate-400 font-bold">:</span>
            <Select value={minutes} onValueChange={handleMinuteChange}>
                <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="h-[200px]">
                    {minutesList.map((m) => (
                        <SelectItem key={m} value={m}>
                            {m}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
