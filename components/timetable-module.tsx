"use client"

import { useDrag } from "react-dnd"
import { Card, CardContent } from "@/components/ui/card"
import { useRef, useEffect } from "react"

export interface TimetableData {
  id: string
  courseId: string
  courseCode: string
  courseName: string
  name: string
  day: string
  startTime: string
  endTime: string
  location: string
  type: string
}

export interface TimetableModuleProps {
  module: TimetableData
  onRemoveModule: (moduleId: string) => void
}

export default function TimetableModule({ module, onRemoveModule }: TimetableModuleProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "timetable-module",
    item: { id: module.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (ref.current) {
      drag(ref)
    }
  }, [drag])

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="cursor-move">
      <Card className="bg-[#4ECDC4]/10 border-l-4 border-l-[#4ECDC4]">
        <CardContent className="p-3">
          <div className="text-sm font-medium">{module.courseCode}</div>
          <div className="text-xs">{module.name}</div>
          <div className="text-xs text-gray-500 mt-1">
            {module.day} {module.startTime}-{module.endTime}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
