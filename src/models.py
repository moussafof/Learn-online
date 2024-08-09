from flask_sqlalchemy import SQLAlchemy
from .student import app
from sqlalchemy import Column, Integer, String, ForeignKey 
from datetime import datetime
from flask_login import UserMixin
from flask_migrate import Migrate
from sqlalchemy.orm import relationship
db=SQLAlchemy(app)
migrate = Migrate(app, db)
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    courses = db.relationship('CourseList', backref='user', lazy=True)

    def __repr__(self):
        return '<User %r>' % self.username

class CourseList(db.Model):
    __tablename__ = 'CourseList'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    cours_id=db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    purchase_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    course = relationship("Course", back_populates="courselist")
    def __repr__(self):
        return '<CourseList %r>' % self.id

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(255))  # Chemin de l'image de présentation du cours
    videos = relationship("Video", back_populates="course")
    category_id = Column(Integer, ForeignKey('categories.id'))
    category = relationship("Category", back_populates="courses")
    courselist = db.relationship("CourseList", back_populates="course")
     
    def __repr__(self):
        return '<Course %r>' % self.title

class Category(db.Model):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    courses = relationship("Course", back_populates="category")
    def __repr__(self):
        return '<Category %r>' % self.id


class Video(db.Model):
    __tablename__ = 'videos'
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    url = Column(String(255), nullable=False)  # Stockez l'URL de la vidéo
    course_id = Column(Integer, ForeignKey('course.id'))
    course = relationship("Course", back_populates="videos")
with app.app_context():
    db.create_all()

def getAll():
    return Course.query.order_by(Course.title).all()
def getCate():
     return Category.query.all()
def getCateByID(cateID):
    category = Category.query.get(cateID)
    return category

def getCourseByID(courseId):
    course = Course.query.get(courseId)
    return course
def getCourseList(user_id):
    return CourseList.query.filter_by(user_id=user_id).all()

def getCoursePrice(course_id): 
    course = Course.query.get(course_id)
    return course.price
def getUsers():
    return User.query.all

def getVideosByCourseID(course_id):
    return Video.query.filter_by(cours_id=course_id).all()

def existence_cours(course_id, user_id):
    return CourseList.query.filter_by(cours_id=course_id, user_id=user_id).first() is not None
