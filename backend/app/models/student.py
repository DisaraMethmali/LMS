from app.utils.db import db
from datetime import datetime

class Student(db.Model):
    __tablename__ = 'student'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(512), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(50))
    phone = db.Column(db.String(50))
    address = db.Column(db.String(255))

    # Relationship with Enrollment model (use string reference)
    enrollments = db.relationship('Enrollment', backref='student', lazy=True)

    def __repr__(self):
        return f"<Student {self.name}>"

