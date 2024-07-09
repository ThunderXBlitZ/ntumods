from typing import List, Optional

from .course import Course

class Module:
    def __init__(self, code: str, title: str, au: float, remarks: str, courses: List[Course] = None, additional_remarks: List[str] = None):
        self.code = code
        self.title = title
        self.au = au
        self.remarks = remarks
        self.courses = courses or []
        self.additional_remarks = additional_remarks or []

    def add_course(self, course: Course):
        self.courses.append(course)

    def add_additional_remark(self, remark: str):
        self.additional_remarks.append(remark)
        
    def to_dict(self):
        return {
            'code': self.code,
            'title': self.title,
            'au': self.au,
            'remarks': self.remarks,
            'courses': [course.to_dict() for course in self.courses],
            'additional_remarks': self.additional_remarks
        }