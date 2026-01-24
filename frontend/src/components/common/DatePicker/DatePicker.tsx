import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DatePickerProps {
    value?: string; // YYYY-MM-DD format
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
    disabled = false,
    className,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    const selectedDate = React.useMemo(() => {
        if (!value) return undefined;
        try {
            const parsed = parse(value, "yyyy-MM-dd", new Date());
            return isValid(parsed) ? parsed : undefined;
        } catch {
            return undefined;
        }
    }, [value]);

    const handleSelect = (date: Date | undefined) => {
        if (date && isValid(date)) {
            const formatted = format(date, "yyyy-MM-dd");
            onChange(formatted);
            setOpen(false);
        }
    };

    const displayText = React.useMemo(() => {
        if (!selectedDate) return placeholder;
        try {
            return format(selectedDate, "dd/MM/yy");
        } catch {
            return placeholder;
        }
    }, [selectedDate, placeholder]);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{displayText}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0 z-[9999]"
                align="start"
                sideOffset={4}
            >
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                    className="rounded-md border"
                />
            </PopoverContent>
        </Popover>
    );
}
