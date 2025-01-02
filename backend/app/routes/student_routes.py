from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash  # Import for password hashing
from app.models.student import Student  # Ensure this is the correct import for your Student model
from app.utils.db import db  # Ensure this is the correct import for your database setup

student_routes = Blueprint("student_routes", __name__)

@student_routes.route("/register", methods=["POST"])
def register():
    try:
        data = request.json

        # Validate required fields
        if not data.get("name") or not data.get("email") or not data.get("password"):
            return jsonify({"message": "Name, email, and password are required"}), 400

        # Hash the password before storing
        hashed_password = generate_password_hash(data["password"])

        # Create a new student object
        student = Student(
            name=data["name"],
            email=data["email"],
            password=hashed_password,  # Store hashed password
            age=data.get("age"),
            gender=data.get("gender"),
            phone=data.get("phone"),
            address=data.get("address")
        )

        # Add the student to the database and commit the changes
        db.session.add(student)
        db.session.commit()

        return jsonify({"message": "Student registered successfully"}), 201

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"message": f"Error: {str(e)}"}), 500

@student_routes.route("/login", methods=["POST"])
def login():
    try:
        data = request.json

        # Validate required fields
        if not data.get("email") or not data.get("password"):
            return jsonify({"message": "Email and password are required"}), 400

        # Retrieve the student by email
        student = Student.query.filter_by(email=data["email"]).first()

        if student and check_password_hash(student.password, data["password"]):  # Compare hashed password
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"message": f"Error: {str(e)}"}), 500
