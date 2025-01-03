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
@admin_routes.route('/addcourse', methods=['POST'])
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

        return jsonify({"message": "Course added successfully", "course": {"name": new_course.name}}), 201

    except Exception as e:
        print(f"Error adding course: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
