import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STRATEGIES } from '@/constants/trade.constants';

interface StrategyComboboxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function StrategyCombobox({ value, onChange, placeholder }: StrategyComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync with external value changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Filter strategies based on input
    const filteredStrategies = STRATEGIES.filter((strategy) =>
        strategy.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
        setIsOpen(true);
    };

    const handleSelect = (strategy: string) => {
        setInputValue(strategy);
        onChange(strategy);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <Input
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder || 'Chọn hoặc nhập chiến lược...'}
            />

            {isOpen && filteredStrategies.length > 0 && (
                <div className="absolute z-50 w-full mt-1 rounded-md border border-border bg-popover shadow-md">
                    <div className="max-h-60 overflow-y-auto p-1">
                        {filteredStrategies.map((strategy) => (
                            <div
                                key={strategy}
                                onClick={() => handleSelect(strategy)}
                                className={cn(
                                    'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                                    'hover:bg-accent hover:text-accent-foreground',
                                    'transition-colors',
                                    inputValue === strategy && 'bg-accent text-accent-foreground'
                                )}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        inputValue === strategy ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                {strategy}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
