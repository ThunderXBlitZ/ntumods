"use client"

import { useState, useEffect } from "react"
import { Search, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Define the Course and TimetableModule interfaces
interface Course {
  id: string
  code: string
  name: string
  description: string
  modules: TimetableModule[]
  exam: {
    date: string
    startTime: string
    endTime: string
    location: string
  }
}

interface TimetableModule {
  id: string
  courseId: string
  name: string
  courseName: string
  courseCode: string
  type: string
  day: string
  startTime: string
  endTime: string
  location: string
}

// Mock data - in a real app, this would come from an API
const mockCourses: Course[] = [
  {
    id: "cs101",
    code: "CS101",
    name: "Introduction to Computer Science",
    description: "Fundamentals of programming and computer science concepts",
    modules: [
      {
        id: "cs101-lec",
        name: "Lecture",
        type: "Lecture",
        day: "Monday",
        startTime: "09:00",
        endTime: "11:00",
        location: "Hall A",
      },
      {
        id: "cs101-lab1",
        name: "Lab Group 1",
        type: "Lab",
        day: "Wednesday",
        startTime: "14:00",
        endTime: "16:00",
        location: "Lab 1",
      },
      {
        id: "cs101-lab2",
        name: "Lab Group 2",
        type: "Lab",
        day: "Thursday",
        startTime: "10:00",
        endTime: "12:00",
        location: "Lab 2",
      },
    ],
    exam: { date: "2023-12-15", startTime: "09:00", endTime: "12:00", location: "Main Hall" },
  },
  {
    id: "math201",
    code: "MATH201",
    name: "Calculus II",
    description: "Advanced calculus concepts including integration and series",
    modules: [
      {
        id: "math201-lec1",
        name: "Lecture 1",
        type: "Lecture",
        day: "Tuesday",
        startTime: "11:00",
        endTime: "13:00",
        location: "Hall B",
      },
      {
        id: "math201-lec2",
        name: "Lecture 2",
        type: "Lecture",
        day: "Thursday",
        startTime: "11:00",
        endTime: "13:00",
        location: "Hall B",
      },
      {
        id: "math201-tut",
        name: "Tutorial",
        type: "Tutorial",
        day: "Friday",
        startTime: "15:00",
        endTime: "16:00",
        location: "Room 105",
      },
    ],
    exam: { date: "2023-12-18", startTime: "14:00", endTime: "17:00", location: "Main Hall" },
  },
  {
    id: "phys101",
    code: "PHYS101",
    name: "Physics I",
    description: "Introduction to mechanics and thermodynamics",
    modules: [
      {
        id: "phys101-lec",
        name: "Lecture",
        type: "Lecture",
        day: "Monday",
        startTime: "14:00",
        endTime: "16:00",
        location: "Hall C",
      },
      {
        id: "phys101-lab",
        name: "Lab",
        type: "Lab",
        day: "Wednesday",
        startTime: "09:00",
        endTime: "11:00",
        location: "Physics Lab",
      },
    ],
    exam: { date: "2023-12-20", startTime: "09:00", endTime: "12:00", location: "Science Building" },
  },
  {
    id: "eng102",
    code: "ENG102",
    name: "Academic Writing",
    description: "Developing academic writing skills for university level",
    modules: [
      {
        id: "eng102-sem1",
        name: "Seminar Group 1",
        type: "Seminar",
        day: "Tuesday",
        startTime: "09:00",
        endTime: "11:00",
        location: "Room 201",
      },
      {
        id: "eng102-sem2",
        name: "Seminar Group 2",
        type: "Seminar",
        day: "Tuesday",
        startTime: "14:00",
        endTime: "16:00",
        location: "Room 201",
      },
    ],
    exam: { date: "2023-12-12", startTime: "14:00", endTime: "16:00", location: "Arts Building" },
  },
]

interface CourseSearchProps {
  onAddCourse: (course: Course) => void
  selectedCourses: Course[]
  onRemoveCourse: (courseId: string) => void
  onAddModule: (module: TimetableModule) => void
}

export default function CourseSearch({ onAddCourse, selectedCourses, onRemoveCourse, onAddModule }: CourseSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses)

  useEffect(() => {
    // In a real app, this would be an API call with debounce
    const results = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCourses(results)
  }, [searchTerm, courses])

  const handleAddModule = (course: Course, moduleId: string) => {
    const module = course.modules.find((m) => m.id === moduleId)
    if (module) {
      onAddModule({
        id: module.id,
        courseId: course.id,
        name: module.name,
        courseName: course.name,
        courseCode: course.code,
        day: module.day,
        startTime: module.startTime,
        endTime: module.endTime,
        location: module.location,
        type: module.type,
      })
    }
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="bg-[#4ECDC4] text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Course Search
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#4ECDC4] focus:ring-[#4ECDC4]"
            />
          </div>

          {selectedCourses.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Selected Courses</h3>
              <div className="space-y-3">
                {selectedCourses.map((course) => (
                  <Card key={course.id} className="bg-[#F8F9FA] border-l-4 border-l-[#4ECDC4]">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-[#4ECDC4]/10 text-[#1A2238]">
                              {course.code}
                            </Badge>
                            <h4 className="font-medium">{course.name}</h4>
                          </div>
                          <Accordion type="single" collapsible className="mt-2">
                            <AccordionItem value={course.id} className="border-none">
                              <AccordionTrigger className="py-1 text-sm text-[#4ECDC4]">View Modules</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2 mt-2">
                                  {course.modules.map((module) => (
                                    <div
                                      key={module.id}
                                      className="flex justify-between items-center p-2 bg-white rounded-md text-sm"
                                    >
                                      <div>
                                        <div>{module.name}</div>
                                        <div className="text-xs text-gray-500">
                                          {module.day} {module.startTime}-{module.endTime}
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-[#4ECDC4]"
                                        onClick={() => handleAddModule(course, module.id)}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-[#FF6B6B]"
                          onClick={() => onRemoveCourse(course.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-medium text-lg mb-2">Available Courses</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredCourses
                .filter((course) => !selectedCourses.some((c) => c.id === course.id))
                .map((course) => (
                  <Card key={course.id} className="bg-[#F8F9FA]">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-[#1A2238]/10">
                              {course.code}
                            </Badge>
                            <h4 className="font-medium">{course.name}</h4>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-[#4ECDC4]"
                          onClick={() => onAddCourse(course)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {filteredCourses.length === 0 && (
                <div className="text-center py-8 text-gray-500">No courses found matching "{searchTerm}"</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

