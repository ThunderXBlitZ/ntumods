export interface Course {
  id: string
  code: string
  name: string
  description: string
  modules: Module[]
  exam: Exam
}

export interface Module {
  id: string
  name: string
  type: string
  day: string
  startTime: string
  endTime: string
  location: string
  courseId: string
  courseName: string
  courseCode: string
}

export interface Exam {
  date: string
  startTime: string
  endTime: string
  location: string
}