"use client"

import { useDrag } from "react-dnd"
import { Card, CardContent } from "@/components/ui/card"

interface TimetableModule {
  id: string
  courseCode: string
  name: string
  day: string
  startTime: string
  endTime: string
}

interface TimetableModuleProps {
  module: TimetableModule
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

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className="cursor-move">
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

