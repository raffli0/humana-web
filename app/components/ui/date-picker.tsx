"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"


import { Button } from "./button"
import { Calendar } from "./calendar"
import { Input } from "./input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
    date?: Date
    setDate: (date?: Date) => void
    placeholder?: string
    className?: string
}

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

export function DatePicker({ date, setDate, placeholder = "Select date", className }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [month, setMonth] = React.useState<Date | undefined>(date)
    const [inputValue, setInputValue] = React.useState(formatDate(date))

    React.useEffect(() => {
        setInputValue(formatDate(date))
        setMonth(date)
    }, [date])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        const newDate = new Date(e.target.value)
        if (isValidDate(newDate)) {
            setDate(newDate)
            setMonth(newDate)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
        }
    }

    return (
        <div className={cn("relative flex gap-2 w-[240px]", className)}>
            <Input
                value={inputValue}
                placeholder={placeholder}
                className="bg-white pr-10"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 text-muted-foreground hover:bg-transparent"
                    >
                        <CalendarIcon className="h-4 w-4" />
                        <span className="sr-only">Select date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(newDate) => {
                            // If user clicks generic date, we set it.
                            // We must handle typescript undefined if Calendar allows it, but it typically returns Date.
                            if (newDate) {
                                setDate(newDate)
                                setOpen(false)
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
