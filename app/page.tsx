"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import Header from "@/components/header"
import CourseSearch from "@/components/course-search"
import Timetable from "@/components/timetable"
import ExamSchedule from "@/components/exam-schedule"

// Define the Course type
interface Course {
  id: string
  name: string
  code: string
  credits: number
}

// Define the TimetableModule type
interface TimetableModule {
  id: string
  courseId: string
  type: string
  day: string
  startTime: string
  endTime: string
  location: string
}

export default function TimetablePage() {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const [timetableModules, setTimetableModules] = useState<TimetableModule[]>([])

  const handleAddCourse = (course: Course) => {
    if (!selectedCourses.some((c) => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course])
    }
  }

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId))
    setTimetableModules(timetableModules.filter((m) => m.courseId !== courseId))
  }

  const handleAddModule = (module: TimetableModule) => {
    setTimetableModules([...timetableModules, module])
  }

  const handleRemoveModule = (moduleId: string) => {
    setTimetableModules(timetableModules.filter((m) => m.id !== moduleId))
  }

  const handleModuleDrop = (moduleId: string, day: string, startTime: string) => {
    setTimetableModules(
      timetableModules.map((module) => (module.id === moduleId ? { ...module, day, startTime } : module)),
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#EAF4D3]">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <CourseSearch
                onAddCourse={handleAddCourse}
                selectedCourses={selectedCourses}
                onRemoveCourse={handleRemoveCourse}
                onAddModule={handleAddModule}
              />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <Timetable
                modules={timetableModules}
                onRemoveModule={handleRemoveModule}
                onModuleDrop={handleModuleDrop}
              />
              <ExamSchedule courses={selectedCourses} />
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  )
}

