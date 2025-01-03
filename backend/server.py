from flask import Flask
from flask_cors import CORS  # Import CORS
from app import create_app
from app.utils.db import db
from app.routes.student_routes import student_routes
from app.routes.admin_routes import admin_routes

# Create the Flask app
app = create_app()

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register Blueprints
app.register_blueprint(student_routes, url_prefix="/student", name="student_routes_unique")
app.register_blueprint(admin_routes, url_prefix="/admin", name="admin_routes_unique")

# Create tables inside the app context
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)


