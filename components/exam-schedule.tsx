import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin } from "lucide-react"

interface Course {
  id: string
  code: string
  name: string
  exam: {
    date: string
    startTime: string
    endTime: string
    location: string
  }
}

interface ExamScheduleProps {
  courses: Course[]
}

export default function ExamSchedule({ courses }: ExamScheduleProps) {
  // Sort exams by date
  const sortedCourses = [...courses].sort((a, b) => {
    return new Date(a.exam.date).getTime() - new Date(b.exam.date).getTime()
  })

  // Check for exam conflicts
  const hasConflicts = () => {
    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        const examA = courses[i].exam
        const examB = courses[j].exam

        if (examA.date === examB.date) {
          // Check if time ranges overlap
          const aStart = examA.startTime
          const aEnd = examA.endTime
          const bStart = examB.startTime
          const bEnd = examB.endTime

          if (
            (aStart >= bStart && aStart < bEnd) ||
            (aEnd > bStart && aEnd <= bEnd) ||
            (bStart >= aStart && bStart < aEnd) ||
            (bEnd > aStart && bEnd <= aEnd)
          ) {
            return true
          }
        }
      }
    }
    return false
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="bg-[#1A2238] text-white rounded-t-xl flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-16 w-5" />
          <h1 className="text-2xl font-bold">Exam Schedule</h1>
        </CardTitle>
        {hasConflicts() && <Badge className="bg-[#FF6B6B]">Conflicts Detected</Badge>}
      </CardHeader>
      <CardContent className="p-4">
        {courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No exams scheduled yet. Add courses to see their exam dates.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCourses.map((course) => (
              <Card
                key={course.id}
                className={`
                  border-l-4 
                  ${
                    hasConflicts() &&
                    courses.some(
                      (c) =>
                        c.id !== course.id &&
                        c.exam.date === course.exam.date &&
                        ((c.exam.startTime >= course.exam.startTime && c.exam.startTime < course.exam.endTime) ||
                          (c.exam.endTime > course.exam.startTime && c.exam.endTime <= course.exam.endTime)),
                    )
                      ? "border-l-[#FF6B6B]"
                      : "border-l-[#76C893]"
                  }
                `}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-[#1A2238]/10">
                          {course.code}
                        </Badge>
                        <h4 className="font-medium">{course.name}</h4>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-[#4ECDC4]" />
                          <span>{formatDate(course.exam.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-[#4ECDC4]" />
                          <span>
                            {course.exam.startTime} - {course.exam.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-[#4ECDC4]" />
                          <span>{course.exam.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

