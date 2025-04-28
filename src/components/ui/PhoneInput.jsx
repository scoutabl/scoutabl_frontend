import * as React from "react"
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import * as RPNInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const PhoneInput = React.forwardRef(
    ({ className, onChange, ...props }, ref) => {
        return (
            <RPNInput.default
                ref={ref}
                className={cn("flex", className)}
                flagComponent={FlagComponent}
                countrySelectComponent={CountrySelect}
                inputComponent={InputComponent}
                smartCaret={false}
                defaultCountry="IN"
                /**
                 * Handles the onChange event.
                 *
                 * react-phone-number-input might trigger the onChange event as undefined
                 * when a valid phone number is not entered. To prevent this,
                 * the value is coerced to an empty string.
                 *
                 * @param {E164Number | undefined} value - The entered value
                 */
                onChange={value => onChange?.(value || "")}
                {...props}
            />
        )
    }
)
PhoneInput.displayName = "PhoneInput"

const InputComponent = React.forwardRef(({ className, ...props }, ref) => (
    <Input
        className={cn("rounded-e-lg rounded-s-none", className)}
        {...props}
        ref={ref}
    />
))
InputComponent.displayName = "InputComponent"

const CountrySelect = ({
    disabled,
    value: selectedCountry,
    options: countryList,
    onChange
}) => {
    const scrollAreaRef = React.useRef(null)
    const [searchValue, setSearchValue] = React.useState("")
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 focus:z-10 bg-black h-[47px] px-3 min-w-[70px] hover:bg-black/80"
                    disabled={disabled}
                >
                    <span className="text-sm text-white">
                        {selectedCountry ? `+${RPNInput.getCountryCallingCode(selectedCountry)}` : ''}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput
                        value={searchValue}
                        onValueChange={value => {
                            setSearchValue(value)
                            setTimeout(() => {
                                if (scrollAreaRef.current) {
                                    const viewportElement = scrollAreaRef.current.querySelector(
                                        "[data-radix-scroll-area-viewport]"
                                    )
                                    if (viewportElement) {
                                        viewportElement.scrollTop = 0
                                    }
                                }
                            }, 0)
                        }}
                        placeholder="Search country..."
                    />
                    <CommandList>
                        <ScrollArea ref={scrollAreaRef} className="h-72">
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {countryList.map(({ value, label }) =>
                                    value ? (
                                        <CountrySelectOption
                                            key={value}
                                            country={value}
                                            countryName={label}
                                            selectedCountry={selectedCountry}
                                            onChange={onChange}
                                        />
                                    ) : null
                                )}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

const CountrySelectOption = ({
    country,
    countryName,
    selectedCountry,
    onChange
}) => {
    return (
        <CommandItem className="gap-2" onSelect={() => onChange(country)}>
            <span className="flex-1 text-sm " >{countryName}</span>
            <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(
                country
            )}`}</span>
            <CheckIcon
                className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"
                    }`}
            />
        </CommandItem>
    )
}

const FlagComponent = ({ country, countryName }) => {
    const Flag = flags[country]

    return (
        <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 ">
            {Flag && <Flag title={countryName} />}
        </span>
    )
}

export { PhoneInput }
