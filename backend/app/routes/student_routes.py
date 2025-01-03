from flask import Blueprint, request, jsonify, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.student import Student
from app.utils.db import db

# Blueprint for student routes
student_routes = Blueprint("student_routes", __name__)

# Register endpoint
@student_routes.route("/register", methods=["POST"])
def register():
    try:
        data = request.json

        if not data.get("name") or not data.get("email") or not data.get("password"):
            return jsonify({"message": "Name, email, and password are required"}), 400

        # Check if student already exists
        existing_student = Student.query.filter_by(email=data["email"]).first()
        if existing_student:
            return jsonify({"message": "Email already registered"}), 400

        hashed_password = generate_password_hash(data["password"])
        student = Student(
            name=data["name"],
            email=data["email"],
            password=hashed_password,
            age=data.get("age"),
            gender=data.get("gender"),
            phone=data.get("phone"),
            address=data.get("address")
        )

        db.session.add(student)
        db.session.commit()

        return jsonify({"message": "Student registered successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error: {str(e)}"}), 500

# Login endpoint
@student_routes.route("/login", methods=["POST"])
def login():
    try:
        data = request.json

        if not data.get("email") or not data.get("password"):
            return jsonify({"message": "Email and password are required"}), 400

        student = Student.query.filter_by(email=data["email"]).first()

        if student and check_password_hash(student.password, data["password"]):
            return jsonify({
                "message": "Login successful",
                "email": student.email
            }), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

# Profile endpoint
@student_routes.route("/profile/<email>", methods=["GET"])
def profile(email):
    try:
        student = Student.query.filter_by(email=email).first()

        if not student:
            return jsonify({"message": "Student not found"}), 404

        return jsonify({
            "name": student.name,
            "email": student.email,
            "age": student.age,
            "gender": student.gender,
            "phone": student.phone,
            "address": student.address
        })

    except Exception as e:
        return jsonify({"message": f"Error occurred: {str(e)}"}), 500

# Get enrollments endpoint
@student_routes.route("/student/enrollments/<email>", methods=["GET"])
def get_enrollments(email):
    try:
        student = Student.query.filter_by(email=email).first()

        if not student:
            return jsonify({"message": "Student not found"}), 404

        # Assuming you have an enrollments relationship set up in your Student model
        enrollments = [
            {
                "course_name": enrollment.course.name,
                "enrollment_date": enrollment.enrollment_date.strftime("%Y-%m-%d")
            }
            for enrollment in student.enrollments
        ]
        return jsonify(enrollments), 200

    except Exception as e:
        return jsonify({"message": f"Error occurred: {str(e)}"}), 500
