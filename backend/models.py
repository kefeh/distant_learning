import os
from sqlalchemy import Column, String, Integer, create_engine, ForeignKey, DateTime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import json

database_name = "distantLearn"
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
    education_list = relationship("Education", cascade="all,delete", backref="system")

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
            'education_list': self.education_list
        }


'''
education

'''


class Education(db.Model):
    __tablename__ = 'educations'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    system_id = Column(Integer, ForeignKey('systems.id', ondelete='cascade'))

    category_list = relationship('Category', cascade="all,delete", backref='education')
    # classes = relationship('Classes', backref='education')

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
            'category_list': self.category_list
        }



'''
category

'''


class Category(db.Model):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    education_id = Column(Integer, ForeignKey('educations.id', ondelete='cascade'))

    sub_categories = relationship('SubCategory', cascade="all,delete", backref='categories')
    classes = relationship('Classes', cascade="all,delete", backref='categories')

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
            'sub_categories': self.sub_categories,
            'classes': self.classes
        }


'''
sub_category

'''


class SubCategory(db.Model):
    __tablename__ = 'sub_categories'

    id = Column(Integer, primary_key=True)
    name = Column(String)
# It can either be a parent of a sub_category or a class
    # sub_categories = relationship('SubCategories', remote_side=[id], backref='categories')
    classes = relationship('Classes', cascade="all,delete", backref='sub_categories')

# the subcategory can be a child of a category or of a sub_category
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='cascade'), nullable=True)
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
            'classes': self.classes
        }


'''
classes

'''


class Classes(db.Model):
    __tablename__ = 'classes'

    id = Column(Integer, primary_key=True)
    name = Column(String)

    subjects = relationship('Subject', cascade="all,delete", backref='classes')

    sub_category_id = Column(Integer, ForeignKey('sub_categories.id', ondelete='cascade'), nullable=True)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='cascade'), nullable=True)
    # education_id = Column(Integer, ForeignKey('educations.id', ondelete='cascade'), nullable=True)

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
            'subjects': self.subjects
        }


'''
subject

'''


class Subject(db.Model):
    __tablename__ = 'subjects'

    id = Column(Integer, primary_key=True)
    name = Column(String)

    videos = relationship('Video', cascade="all,delete", backref='subject')

    class_id = Column(Integer, ForeignKey('classes.id', ondelete='cascade'))

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
            'videos': self.videos
        }


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

    subject_id = Column(Integer, ForeignKey('subjects.id', ondelete='cascade'))

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