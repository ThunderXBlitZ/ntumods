class Course:
    def __init__(self, index: str, type: str, group: str, day: str, time: str, venue: str, remarks: str):
        self.index = index
        self.type = type
        self.group = group
        self.day = day
        self.time = time
        self.venue = venue
        self.remarks = remarks

    def to_dict(self):
        return {
            'index': self.index,
            'type': self.type,
            'group': self.group,
            'day': self.day,
            'time': self.time,
            'venue': self.venue,
            'remarks': self.remarks
        }