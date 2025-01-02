from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from .utils.db import db

def create_app():
    # Create Flask app instance
    app = Flask(__name__)

    # Enable CORS to allow requests from React app
    CORS(app, origins=["http://localhost:3000"])  # Allow requests from React app

    # Configuration for the database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://Meth:2001@DESKTOP-4S69NUF\\SQLEXPRESS/lms_db?driver=ODBC+Driver+17+for+SQL+Server'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)

    # Import and register blueprints
    from app.routes.student_routes import student_routes
    from .routes.admin_routes import admin_routes
   
    app.register_blueprint(student_routes, url_prefix="/student")
    app.register_blueprint(admin_routes, url_prefix="/admin")

    # Return the app instance
    return app


