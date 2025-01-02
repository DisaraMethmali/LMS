from flask import Blueprint, jsonify
from app.models.student import Student
from app.models.course import Course

admin_routes = Blueprint('admin_routes', __name__)

@admin_routes.route('/dashboard', methods=['GET'])
def dashboard():
    # Fetch all students and courses with enrollment count
    students = Student.query.all()
    courses = Course.query.all()

    course_enrollments = []
    for course in courses:
        enrollment_count = len(course.enrollments)  # Get the number of students enrolled in the course
        course_enrollments.append({
            'course_id': course.course_id,
            'name': course.name,
            'description': course.description,
            'duration': course.duration,
            'enrollment_count': enrollment_count
        })

    # Prepare student data
    student_data = []
    for student in students:
        student_data.append({
            'name': student.name,
            'email': student.email,
            'age': student.age,
            'gender': student.gender,
            'phone': student.phone,
            'address': student.address
        })

    # Return data as JSON
    return jsonify({'students': student_data, 'courses': course_enrollments})


