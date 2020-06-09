import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, User
from flask_bcrypt import Bcrypt

SECRET_KEY = 'minesec_distance_learning'
BCRYPT_LOG_ROUNDS = 13

class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "distantLearn"
        self.database_path = "postgres:///{}".format(self.database_name)
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()

    def tearDown(self):
        """Executed after reach test"""
        pass

    def test_encode_auth_token(self):
        bcrypt = Bcrypt(self.app)
        user = User(
            email='test@test.com',
            password=bcrypt.generate_password_hash(
            'test', BCRYPT_LOG_ROUNDS).decode()
        )
        user.insert()
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))

    def test_decode_auth_token(self):
        bcrypt = Bcrypt(self.app)
        user = User(
            email='test@test.com',
            password=bcrypt.generate_password_hash(
            'test', BCRYPT_LOG_ROUNDS).decode()
        )
        user.insert()
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertTrue(User.decode_auth_token(auth_token) == user.id)



# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
