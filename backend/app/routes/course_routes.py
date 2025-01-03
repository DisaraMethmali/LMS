from datetime import datetime

class Course(db.Model):
    __tablename__ = 'course'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.String(100), unique=True, nullable=False)  # Unique course ID
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    
    
    # Duration: The number of days for the course
    duration = db.Column(db.Integer, nullable=False)  # Duration in days

    # Relationship with Enrollment model
    enrollments = db.relationship('Enrollment', backref='course', lazy=True)

    def __repr__(self):
        return f"<Course {self.name} (ID: {self.course_id})>"

from flask import Blueprint, request, jsonify
from app.models.course import Course  # Ensure this is the correct import for your Course model
from app.models.student import Student  # Ensure this is the correct import for your Student model
from app.utils.db import db  # Ensure this is the correct import for your database setup
from datetime import datetime

# Create a blueprint for the courses
course_bp = Blueprint('course_bp', __name__)

# Route to add a new course
@course.route('/addcourse', methods=['POST'])
def addcourse():
    data = request.get_json()

    try:
        course_id = data.get('course_id')
        name = data.get('name')
        description = data.get('description', '')
        duration = data.get('duration')

        if not course_id or not name or not duration:
            return jsonify({"message": "Course ID, Name, and Duration are required"}), 400

        # Check if the course already exists
        existing_course = Course.query.filter_by(course_id=course_id).first()
        if existing_course:
            return jsonify({"message": "Course with this ID already exists"}), 400

        new_course = Course(course_id=course_id, name=name, description=description, duration=duration)
        db.session.add(new_course)
        db.session.commit()

        return jsonify({"message": "Course added successfully", "course": new_course.name}), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Route to get all courses
@course.route('/courses', methods=['GET'])
def get_courses():
    try:
        courses = Course.query.all()
        course_list = []
        for course in courses:
            course_list.append({
                "course_id": course.course_id,
                "name": course.name,
                "description": course.description,
                "duration": course.duration
            })

        return jsonify(course_list), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Route to enroll a student in a course
@course.route('/enroll', methods=['POST'])
def enroll_student():
    data = request.get_json()

    try:
        student_id = data.get('student_id')
        course_id = data.get('course_id')

        if not student_id or not course_id:
            return jsonify({"message": "Student ID and Course ID are required"}), 400

        student = Student.query.get(student_id)
        course = Course.query.filter_by(course_id=course_id).first()

        if not student:
            return jsonify({"message": "Student not found"}), 404
        if not course:
            return jsonify({"message": "Course not found"}), 404

        # Add student to the course (assuming Enrollment model exists and works properly)
        # enrollment = Enrollment(student_id=student_id, course_id=course.id)
        # db.session.add(enrollment)
        # db.session.commit()

        return jsonify({"message": f"Student {student.name} successfully enrolled in {course.name}"}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Optional: Add more routes as needed (e.g., get specific course, update course, delete course)
