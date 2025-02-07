import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Generic type for the item shape
export interface SelectItem {
  value: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow additional properties
}

export interface AsyncSelectProps<T extends SelectItem> {
  // Value handling
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (item: T | undefined, value: string) => void;

  // Customization
  placeholder?: string;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  loadingMessage?: string;

  // Styling
  className?: string;
  dropdownClassName?: string;

  // Behavior
  defaultOpen?: boolean;
  disabled?: boolean;

  // Data fetching
  fetchOptions?: (query: string) => Promise<T[]>;
  debounceMs?: number;

  // Optional pre-loaded items
  defaultItems?: T[];

  // Optional item customization
  itemToString?: (item: T | undefined) => string;
  itemToValue?: (item: T) => string;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
}

function AsyncSelect<T extends SelectItem>({
  // Value handling
  value = "",
  onChange,
  onSelect,

  // Customization
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  noOptionsMessage = "No options found.",
  loadingMessage = "Loading options...",

  // Styling
  className,
  dropdownClassName,

  // Behavior
  defaultOpen = false,
  disabled = false,

  // Data fetching
  fetchOptions,
  debounceMs = 300,

  // Optional pre-loaded items
  defaultItems = [],

  // Optional item customization
  itemToString = (item: T | undefined) => item?.label ?? "",
  itemToValue = (item: T) => item.value,
  renderItem,
}: AsyncSelectProps<T>) {
  const [open, setOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<T[]>(defaultItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setItems(defaultItems);
  }, [defaultItems]);

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!fetchOptions) return;

    const newTimeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchOptions(search);
        setItems(results);
      } catch (error) {
        console.error("Error fetching options:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? "" : selectedValue;
    const selectedItem = items.find(
      (item) => itemToValue(item) === selectedValue
    );

    onChange?.(newValue);
    onSelect?.(selectedItem, newValue);

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          {value
            ? itemToString(items.find((item) => itemToValue(item) === value))
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", dropdownClassName)}>
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={handleSearchChange}
            disabled={disabled}
          />
          {loading ? (
            <CommandItem>{loadingMessage}</CommandItem>
          ) : (
            <>
              <CommandEmpty>{noOptionsMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={itemToValue(item)}
                    value={itemToValue(item)}
                    onSelect={handleSelect}
                    disabled={disabled}
                  >
                    {renderItem ? (
                      renderItem(item, value === itemToValue(item))
                    ) : (
                      <>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === itemToValue(item)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {itemToString(item)}
                      </>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default AsyncSelect;
