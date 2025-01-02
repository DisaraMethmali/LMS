from app import create_app
from app.utils.db import db  # Import db instance
from app.routes.student_routes import student_routes
from app.routes.admin_routes import admin_routes

# Create the Flask app
app = create_app()

# Register Blueprints with unique names (avoiding name conflicts)
app.register_blueprint(student_routes, url_prefix="/student", name="student_routes_unique")
app.register_blueprint(admin_routes, url_prefix="/admin", name="admin_routes_unique")

# Create tables inside the app context
with app.app_context():
    db.create_all()  # Create all tables after initializing the app

# Run the app
if __name__ == "__main__":
    app.run(debug=True)



