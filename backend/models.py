import os
from sqlalchemy import Column, String, Integer, create_engine, ForeignKey, DateTime, Boolean
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import jwt
import json

database_name = "distantLearn"
database_path = "postgres:///{}".format(database_name)

db = SQLAlchemy()

"""Production configuration."""
SECRET_KEY = 'minesec_distance_learning'
BCRYPT_LOG_ROUNDS = 13

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
'''


def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    migrate = Migrate(app, db)
    db.app = app
    db.init_app(app)
    db.create_all()


'''
system

'''

class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    admin = Column(Boolean, nullable=False, default=False)
    registered_on = Column(DateTime, nullable=False)

    timetable = relationship('TimeTable', cascade="all,delete", backref='users')

    def __init__(self, email, name, password, admin=False):
        self.name = name
        self.email = email
        # self.password = bcrypt.generate_password_hash(
        #     password, BCRYPT_LOG_ROUNDS).decode()
        self.password = password
        self.registered_on = datetime.now()
        self.admin = admin

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'email': self.email,
            'admin': self.admin,
            'name': self.name,
            'registered_on': self.registered_on
        }

    def encode_auth_token(self, user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(hours=3),
                'iat': datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                SECRET_KEY,
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Decodes the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            payload = jwt.decode(auth_token, SECRET_KEY, algorithms=['HS256'])
            is_blacklisted_token = BlacklistToken.check_blacklist(auth_token)
            if is_blacklisted_token:
                return 'Token blacklisted. Please log in again.'
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Session expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'


class BlacklistToken(db.Model):
    """
    Token Model for storing JWT tokens
    """
    __tablename__ = 'blacklist_tokens'

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String, unique=True, nullable=False)
    blacklisted_on = Column(DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.now()

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_blacklist(auth_token):
        # check whether auth token has been blacklisted
        res = BlacklistToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True  
        else:
            return False


class System(db.Model):
    __tablename__ = 'systems'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    rank = Column(Integer)
    education_list = relationship(
        "Education", cascade="all,delete", backref="system")

    def __init__(self, name):
        self.name = name

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'rank': self.rank,
            'education_list': self.education_list
        }


'''
education

'''


class Education(db.Model):
    __tablename__ = 'educations'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    rank = Column(Integer)
    system_id = Column(Integer, ForeignKey('systems.id', ondelete='cascade'))

    class_list = relationship(
        'Classes', cascade="all,delete", backref='education')
    sub_categories = relationship(
        'SubCategory', cascade="all,delete", backref='education')

    def __init__(self, name):
        self.name = name

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'class_list': self.class_list,
            'rank': self.rank,
            'sub_categories': self.sub_categories
        }


'''
category

'''


class Category(db.Model):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    rank = Column(Integer)
    class_id = Column(Integer, ForeignKey('classes.id', ondelete='cascade'))

    # sub_categories = relationship('SubCategory', cascade="all,delete", backref='categories')
    # classes = relationship('Classes', cascade="all,delete", backref='categories')
    timetable = relationship('TimeTable', cascade="all,delete", backref='categories')
    videos = relationship('Video', cascade='all,delete', backref='categories')

    def __init__(self, name):
        self.name = name

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'rank': self.rank,
            'videos': self.videos
        }


'''
sub_category

'''


class SubCategory(db.Model):
    __tablename__ = 'sub_categories'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    rank = Column(Integer)
# It can either be a parent of a sub_category or a class
    # sub_categories = relationship('SubCategories', remote_side=[id], backref='categories')
    classes = relationship(
        'Classes', cascade="all,delete", backref='sub_categories')

# the subcategory can be a child of a category or of a sub_category
    education_id = Column(Integer, ForeignKey(
        'educations.id', ondelete='cascade'))
    # sub_category_id = Column(Integer, ForeignKey('sub_categories.id', ondelete='cascade'), nullable=True)

    def __init__(self, name):
        self.name = name

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'rank': self.rank,
            'class_list': self.classes
        }


'''
classes

'''


class Classes(db.Model):
    __tablename__ = 'classes'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    rank = Column(Integer)

    categories = relationship(
        'Category', cascade="all,delete", backref='classes')
    videos = relationship('Video', cascade="all,delete", backref='classes')
    timetable = relationship('TimeTable', cascade="all,delete", backref='classes')

    education_id = Column(Integer, ForeignKey(
        'educations.id', ondelete='cascade'), nullable=True)
    sub_category_id = Column(Integer, ForeignKey(
        'sub_categories.id', ondelete='cascade'), nullable=True)

    def __init__(self, name):
        self.name = name

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'rank': self.rank,
            'categories': self.categories
        }


'''
subject

'''


# class Subject(db.Model):
#     __tablename__ = 'subjects'

#     id = Column(Integer, primary_key=True)
#     name = Column(String)

#     videos = relationship('Video', cascade="all,delete", backref='subject')

#     class_id = Column(Integer, ForeignKey('classes.id', ondelete='cascade'))

#     def __init__(self, name):
#         self.name = name

#     def insert(self):
#         db.session.add(self)
#         db.session.commit()

#     def update(self):
#         db.session.commit()

#     def delete(self):
#         db.session.delete(self)
#         db.session.commit()

#     def format(self):
#         return {
#             'id': self.id,
#             'name': self.name,
#             'videos': self.videos
#         }


'''
video

'''


class Video(db.Model):
    __tablename__ = 'videos'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    link = Column(String)
    description = Column(String)
    date = Column(DateTime)

    category_id = Column(Integer, ForeignKey(
        'categories.id', ondelete='cascade'), nullable=True)
    class_id = Column(Integer, ForeignKey(
        'classes.id', ondelete='cascade'), nullable=True)

    questions = relationship('Question', cascade="all,delete", backref='video')

    def __init__(self, name, link, description, date):
        self.name = name
        self.link = link
        self.description = description
        self.date = date

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'link': self.link,
            'description': self.description,
            'date': self.date.strftime('%Y/%m/%d')
        }


class Question(db.Model):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True)
    question = Column(String)
    date = Column(DateTime)

    answers = relationship('Answer', cascade="all,delete", backref='question')
    video_id = Column(Integer, ForeignKey('videos.id', ondelete='cascade'))

    def __init__(self, question, date, video_id):
        self.question = question
        self.date = date
        self.video_id = video_id

        db.session.commit()

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'question': self.question,
            'date': self.date.strftime('%Y-%m-%d %H:%M'),
            'video_id': self.video_id,
            'answers': self.answers
        }


class Answer(db.Model):
    __tablename__ = 'answers'

    id = Column(Integer, primary_key=True)
    answer = Column(String)
    date = Column(DateTime)

    question_id = Column(Integer, ForeignKey(
        'questions.id', ondelete='cascade'))

    def __init__(self, answer, date, question_id):
        self.answer = answer
        self.date = date
        self.question_id = question_id

        db.session.commit()

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'answer': self.answer,
            'date': self.date.strftime('%Y-%m-%d %H:%M'),
            'question_id': self.question_id
            # TODO: try to get the number of hours, day, weeks, months and years
        }
class TimeTable(db.Model):
    __tablename__ = 'timetable'

    id = Column(Integer, primary_key=True)
    link = Column(String)
    name = Column(String)
    time = Column(DateTime)
    accepted = Column(Boolean)
    teacher_id = Column(Integer, ForeignKey(
        'users.id', ondelete='cascade'), nullable=True)
    class_id = Column(Integer, ForeignKey(
        'classes.id', ondelete='cascade'), nullable=True)
    category_id = Column(Integer, ForeignKey(
        'categories.id', ondelete='cascade'), nullable=True)

    def __init__(self, name, time, link, teacher_id, class_id, category_id, accepted=False):
        self.link = link
        self.name = name
        self.time = time
        self.accepted = accepted
        self.teacher_id = teacher_id
        self.class_id = class_id
        self.category_id = category_id

        db.session.commit()

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def format(self):
        return {
            'link': self.link,
            'name': self.name,
            'accepted': self.accepted,
            'time': self.time,
            'teacher': self.users.name if self.users else 'No name'
        }


class Number(db.Model):
    __tablename__= 'number'

    number = Column(Integer, primary_key=True)

    def __init__(self, number):
        self.number = number

        db.session.commit()

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def format(self):
        return {
            'number': self.number
        }