import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: "SA", name: "السعودية", flag: "🇸🇦", dialCode: "+966" },
  { code: "AE", name: "الإمارات", flag: "🇦🇪", dialCode: "+971" },
  { code: "KW", name: "الكويت", flag: "🇰🇼", dialCode: "+965" },
  { code: "QA", name: "قطر", flag: "🇶🇦", dialCode: "+974" },
  { code: "BH", name: "البحرين", flag: "🇧🇭", dialCode: "+973" },
  { code: "OM", name: "عُمان", flag: "🇴🇲", dialCode: "+968" },
  { code: "JO", name: "الأردن", flag: "🇯🇴", dialCode: "+962" },
  { code: "LB", name: "لبنان", flag: "🇱🇧", dialCode: "+961" },
  { code: "SY", name: "سوريا", flag: "🇸🇾", dialCode: "+963" },
  { code: "IQ", name: "العراق", flag: "🇮🇶", dialCode: "+964" },
  { code: "EG", name: "مصر", flag: "🇪🇬", dialCode: "+20" },
  { code: "SD", name: "السودان", flag: "🇸🇩", dialCode: "+249" },
  { code: "MA", name: "المغرب", flag: "🇲🇦", dialCode: "+212" },
  { code: "DZ", name: "الجزائر", flag: "🇩🇿", dialCode: "+213" },
  { code: "TN", name: "تونس", flag: "🇹🇳", dialCode: "+216" },
  { code: "LY", name: "ليبيا", flag: "🇱🇾", dialCode: "+218" },
  { code: "US", name: "الولايات المتحدة", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "المملكة المتحدة", flag: "🇬🇧", dialCode: "+44" },
  { code: "FR", name: "فرنسا", flag: "🇫🇷", dialCode: "+33" },
  { code: "DE", name: "ألمانيا", flag: "🇩🇪", dialCode: "+49" },
];

interface CountryCodeSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const CountryCodeSelector = ({ 
  value = "+966", 
  onValueChange, 
  placeholder = "اختر مفتاح الدولة" 
}: CountryCodeSelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedCountry = countries.find(country => country.dialCode === value) || countries[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[140px] justify-between border-border hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>لم يتم العثور على دولة.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.dialCode}`}
                  onSelect={() => {
                    onValueChange(country.dialCode);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{country.name}</div>
                    <div className="text-sm text-muted-foreground">{country.dialCode}</div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === country.dialCode ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
