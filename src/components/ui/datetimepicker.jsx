"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ChevronDownIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DateTimePicker({ currentValue, onChange, placeholder = "Select date and time" }) {
  const [open, setOpen] = React.useState(false)
  // Separate state for the selected value (what's displayed in the button)
  const [selectedValue, setSelectedValue] = React.useState(currentValue || null)
  // Separate state for the temporary value being edited in the popup
  const [tempDateTime, setTempDateTime] = React.useState(currentValue || new Date())

  React.useEffect(() => {
    if (currentValue) {
      setSelectedValue(currentValue)
      setTempDateTime(currentValue)
    }
  }, [currentValue])

  const today = new Date()

  const updateTempDateTime = ({ newDate, newHour, newMinute, amFlag }) => {
    setTempDateTime((prev) => {
      const updated = new Date(prev)

      if (newDate) {
        updated.setFullYear(
          newDate.getFullYear(),
          newDate.getMonth(),
          newDate.getDate()
        )
      }
      if (newHour !== undefined) {
        let h = parseInt(newHour, 10)
        if (!isNaN(h)) {
          const currentIsAM = updated.getHours() < 12
          if (currentIsAM && h === 12) h = 0
          if (!currentIsAM && h !== 12) h = h + 12
          updated.setHours(h)
        }
      }
      if (newMinute !== undefined) {
        let m = parseInt(newMinute, 10)
        if (!isNaN(m)) updated.setMinutes(m)
      }
      if (amFlag !== undefined) {
        let h = updated.getHours()
        if (amFlag && h >= 12) updated.setHours(h - 12)
        if (!amFlag && h < 12) updated.setHours(h + 12)
      }

      return updated
    })
  }

  // Derived values for tempDateTime
  const hours24 = tempDateTime.getHours()
  const isAM = hours24 < 12
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  const minute = tempDateTime.getMinutes().toString().padStart(2, "0")

  const formatHeader = (date) => {
    if (!date) return placeholder
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
    return date.toLocaleDateString("en-US", options)
  }

  // Calendar grid logic
  const [currentMonth, setCurrentMonth] = React.useState(tempDateTime.getMonth())
  const [currentYear, setCurrentYear] = React.useState(tempDateTime.getFullYear())

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const currentYearNum = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYearNum + i)

  const startOfMonth = new Date(currentYear, currentMonth, 1)
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const startDay = startOfMonth.getDay()
  const daysInMonth = endOfMonth.getDate()

  const weeks = []
  let day = 1 - startDay
  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const week = []
    for (let i = 0; i < 7; i++) {
      if (day < 1 || day > daysInMonth) {
        week.push(null)
      } else {
        week.push(day)
      }
      day++
    }
    weeks.push(week)
  }

  const handleOK = () => {
    setSelectedValue(tempDateTime)
    if (onChange) onChange(tempDateTime)
    setOpen(false)
  }

  const handleCancel = () => {
    // Reset tempDateTime to the current selected value
    setTempDateTime(selectedValue || new Date())
    setCurrentMonth((selectedValue || new Date()).getMonth())
    setCurrentYear((selectedValue || new Date()).getFullYear())
    setOpen(false)
  }

  const handleClear = () => {
    setSelectedValue(null)
    setTempDateTime(new Date())
    setCurrentMonth(new Date().getMonth())
    setCurrentYear(new Date().getFullYear())
    if (onChange) onChange(null)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-white border-0 text-gray-500"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedValue ? formatHeader(selectedValue) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[360px] p-0 rounded-2xl shadow-lg"
        align="start"
      >
        {/* Header */}
        <div className="px-4 pt-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Select Start Date & Time
          </h3>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {formatHeader(tempDateTime)}
          </div>
        </div>

        {/* Inline Calendar */}
        <div className="px-4 mt-4 border-t">
          <div className="flex items-center justify-between px-2 py-2 border-b">
            <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
              {/* Month Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 text-base font-semibold"
                  >
                    {months[currentMonth]} <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                  {months.map((m, idx) => (
                    <DropdownMenuItem
                      key={m}
                      onClick={() => setCurrentMonth(idx)}
                    >
                      {m}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Year Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 text-base font-semibold"
                  >
                    {currentYear} <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                  {years.map((y) => (
                    <DropdownMenuItem
                      key={y}
                      onClick={() => setCurrentYear(y)}
                    >
                      {y}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-purplePrimary/10"
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11)
                    setCurrentYear((y) => y - 1)
                  } else {
                    setCurrentMonth((m) => m - 1)
                  }
                }}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-purplePrimary/10"
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0)
                    setCurrentYear((y) => y + 1)
                  } else {
                    setCurrentMonth((m) => m + 1)
                  }
                }}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mt-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mt-1">
            {weeks.map((week, i) =>
              week.map((d, j) => {
                const thisDate = d
                  ? new Date(currentYear, currentMonth, d)
                  : null
                const isSelected =
                  thisDate &&
                  tempDateTime.toDateString() === thisDate.toDateString()
                const isToday =
                  thisDate && thisDate.toDateString() === today.toDateString()
                return (
                  <div key={i + "-" + j}>
                    {d ? (
                      <button
                        onClick={() =>
                          updateTempDateTime({ newDate: new Date(currentYear, currentMonth, d) })
                        }
                        className={`h-9 w-9 flex items-center justify-center rounded-full text-sm
                          ${isSelected ? "bg-purplePrimary text-white" : ""}
                          ${isToday && !isSelected ? "border-1 border-purplePrimary text-purplePrimary" : ""}
                          ${!isSelected && !isToday ? "hover:bg-purplePrimary/10 text-gray-700" : ""}
                        `}
                      >
                        {d}
                      </button>
                    ) : (
                      <div className="h-9 w-9" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Time Picker */}
        <div className="flex justify-center items-center gap-4 px-6 py-4 border-t">
          {/* Hour */}
          <div className="flex flex-col items-center">
            <Input
              type="number"
              min="1"
              max="12"
              value={hour12}
              onChange={(e) => updateTempDateTime({ newHour: e.target.value })}
              className="w-24 h-18 text-center !text-3xl font-bold bg-backgroundPrimary rounded-lg border border-gray-200"
              style={{ fontSize: '30px', color: '#4a5568' }}
            />
            <span className="text-xs text-gray-500 mt-1">Hour</span>
          </div>

          <span className="text-4xl font-bold text-gray-600 text-center mb-6">:</span>

          {/* Minute */}
          <div className="flex flex-col items-center">
            <Input
              type="number"
              min="0"
              max="59"
              value={minute}
              onChange={(e) => updateTempDateTime({ newMinute: e.target.value })}
              className="w-24 h-18 text-cente !text-3xl font-bold bg-backgroundPrimary rounded-lg border border-gray-200"
              style={{ fontSize: '30px', color: '#4a5568' }}
            />
            <span className="text-xs text-gray-500 mt-1">Minute</span>
          </div>

          {/* AM/PM */}
          <div className="flex flex-col border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-4 py-2 font-semibold ${
                isAM ? "bg-pinkPrimary text-gray-700" : "text-gray-700 bg-backgroundPrimary "
              }`}
              onClick={() => updateTempDateTime({ amFlag: true })}
            >
              AM
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-4 py-2 font-semibold border-t ${
                !isAM ? "bg-pinkPrimary text-gray-700" : "text-gray-700 bg-backgroundPrimary "
              }`}   
              onClick={() => updateTempDateTime({ amFlag: false })}
            >
              PM
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-3 border-t">
          <Button
            variant="ghost"
            className="text-grey-600 font-medium"
            onClick={handleClear}
          >
            Clear
          </Button>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="text-grey-600 font-medium"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              className="text-grey-600 font-medium"
              onClick={handleOK}
            >
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
