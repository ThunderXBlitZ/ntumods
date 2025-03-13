interface Course {
    id: string
    code: string
    name: string
    description: string
    modules: {
      id: string
      name: string
      type: string
      day: string
      startTime: string
      endTime: string
      location: string
    }[]
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
    day: string
    startTime: string
    endTime: string
    location: string
    type: string
  }
  
  