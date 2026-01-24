import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface TimePickerProps {
    value?: string; // HH:mm format (24h)
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function TimePicker({
    value,
    onChange,
    placeholder = "HH:MM",
    disabled = false,
    className,
}: TimePickerProps) {
    const [inputValue, setInputValue] = React.useState(value || "");

    React.useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value.replace(/[^0-9:]/g, "");

        // Auto-add colon after 2 digits
        if (newValue.length === 2 && !newValue.includes(":")) {
            newValue = newValue + ":";
        }

        // Limit to HH:MM format
        if (newValue.length > 5) {
            newValue = newValue.substring(0, 5);
        }

        setInputValue(newValue);
    };

    const handleBlur = () => {
        // Validate and format on blur
        const parts = inputValue.split(":");
        if (parts.length === 2) {
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);

            if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                const formatted = `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}`;
                setInputValue(formatted);
                onChange(formatted);
            } else {
                // Invalid time, clear
                setInputValue("");
                onChange("");
            }
        } else if (inputValue) {
            // Incomplete input
            setInputValue("");
            onChange("");
        }
    };

    return (
        <div className="relative">
            <Input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
                className={cn("pr-10", className)}
                maxLength={5}
                inputMode="numeric"
            />
            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
    );
}
