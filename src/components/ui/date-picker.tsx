import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar, CalendarProps } from "./calendar";

type DatePickerProps = {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  type?: "date" | "datetime";
} & CalendarProps;

export function DatePicker({
  selected,
  onSelect,
  type = "date",
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onSelect?.(newDate);
  };

  const handleTimeChange = (timeString: string) => {
    if (!date) return;
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onSelect?.(newDate);
    setDate(newDate);
  };

  const formatDate = () => {
    if (!date) return "Pick a date";
    return format(date, type === "datetime" ? "PPP HH:mm" : "PPP");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left px-4 font-normal bg-[#F8F9FF] border-gray-300 rounded-2xl",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          {...props}
          mode="single"
          selected={date}
          onSelect={handleSelect}
        />
        {type === "datetime" && date && (
          <div className="p-3 border-t flex items-center gap-2">
            <Clock className="w-full max-w-4" />
            <Select
              value={format(date, "HH")}
              onValueChange={(value) =>
                handleTimeChange(`${value}:${format(date, "mm")}`)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                    {i.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>:</span>
            <Select
              value={format(date, "mm")}
              onValueChange={(value) =>
                handleTimeChange(`${format(date, "HH")}:${value}`)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem
                    key={i * 5}
                    value={(i * 5).toString().padStart(2, "0")}
                  >
                    {(i * 5).toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
