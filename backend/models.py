import os
from sqlalchemy import Column, String, Integer, create_engine
from flask_sqlalchemy import SQLAlchemy
import json

database_name = "trivia"
database_path = "postgres:///{}".format(database_name)

db = SQLAlchemy()

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
'''


def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()


'''
system

'''


class System(db.Model):
    __tablename__ = 'systems'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    answer = Column(String)

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
            'name': self.name
        }


'''
education

'''


class Education(db.Model):
    __tablename__ = 'educations'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    answer = Column(String)

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
            'name': self.name
        }



'''
category

'''


class Category(db.Model):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    answer = Column(String)

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
            'name': self.name
        }


'''
sub_category

'''


class SubCategory(db.Model):
    __tablename__ = 'sub_categories'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    answer = Column(String)

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
            'name': self.name
        }


'''
classes

'''


class Classes(db.Model):
    __tablename__ = 'classes'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    answer = Column(String)

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
            'name': self.name
        }


'''
subject

'''


class Subject(db.Model):
    __tablename__ = 'subjects'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    answer = Column(String)

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
            'name': self.name
        }


'''
video

'''


class Video(db.Model):
    __tablename__ = 'videos'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    answer = Column(String)
    link = Column(String)
    description = Column(String)
    date = Column(DateTime)

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
            'date': self.date
        }