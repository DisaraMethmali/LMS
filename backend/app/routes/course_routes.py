from datetime import datetime

class Course(db.Model):
    __tablename__ = 'course'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.String(100), unique=True, nullable=False)  # Unique course ID
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    instructor = db.Column(db.String(100))
    
    # Duration: The number of days for the course
    duration = db.Column(db.Integer, nullable=False)  # Duration in days

    # Relationship with Enrollment model
    enrollments = db.relationship('Enrollment', backref='course', lazy=True)

    def __repr__(self):
        return f"<Course {self.name} (ID: {self.course_id})>"

