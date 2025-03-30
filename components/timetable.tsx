"use client"

import { useRef, useEffect } from "react"
import { useDrop } from "react-dnd"
import { X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TimetableData } from "./timetable-module" // Import the component with a different name

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

interface TimetableProps {
  modules: TimetableData[] // Use the imported type
  onRemoveModule: (moduleId: string) => void
  onModuleDrop: (moduleId: string, day: string, startTime: string) => void
}

export default function Timetable({ modules, onRemoveModule, onModuleDrop }: TimetableProps) {
  const getModulesForTimeSlot = (day: string, time: string) => {
    return modules.filter((module) => module.day === day && module.startTime === time)
  }

  return (
    <Card className="bg-white shadow-md overflow-hidden">
      <div className="bg-[#4ECDC4] text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Weekly Timetable</h2>
        <div className="flex gap-2">
          <Badge className="bg-[#1A2238]">Fall 2023</Badge>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header row with days */}
            <div className="grid grid-cols-6 border-b">
              <div className="p-4 font-medium text-center bg-[#F8F9FA]">Time</div>
              {days.map((day) => (
                <div key={day} className="p-4 font-medium text-center bg-[#F8F9FA]">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots */}
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-6 border-b">
                <div className="p-2 text-center border-r bg-[#F8F9FA] flex items-center justify-center">
                  <span className="text-sm font-medium">{time}</span>
                </div>

                {days.map((day) => {
                  const cellModules = getModulesForTimeSlot(day, time)

                  return (
                    <TimeSlotCell
                      key={`${day}-${time}`}
                      day={day}
                      time={time}
                      modules={cellModules}
                      onRemoveModule={onRemoveModule}
                      onModuleDrop={onModuleDrop}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TimeSlotCellProps {
  day: string
  time: string
  modules: TimetableData[]
  onRemoveModule: (moduleId: string) => void
  onModuleDrop: (moduleId: string, day: string, startTime: string) => void
}

function TimeSlotCell({ day, time, modules, onRemoveModule, onModuleDrop }: TimeSlotCellProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "timetable-module",
    drop: (item: { id: string }) => {
      onModuleDrop(item.id, day, time)
      return { day, time }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))
  
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (ref.current) {
      drop(ref)
    }
  }, [drop])

  return (
    <div ref={ref} className={`p-1 border-r min-h-[80px] relative ${isOver ? "bg-[#4ECDC4]/10" : ""}`}>
      {modules.map((module) => (
        <div key={module.id} className="mb-1 relative">
          <div
            className={`
              p-2 rounded text-xs
              ${module.type === "Lecture" ? "bg-[#FFD166]/80" : ""}
              ${module.type === "Lab" ? "bg-[#4ECDC4]/80" : ""}
              ${module.type === "Tutorial" ? "bg-[#FF6B6B]/80" : ""}
              ${module.type === "Seminar" ? "bg-[#76C893]/80" : ""}
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{module.courseCode}</div>
                <div>{module.name}</div>
                <div className="text-[10px] mt-1">{module.location}</div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 -mt-1 -mr-1"
                onClick={() => onRemoveModule(module.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

