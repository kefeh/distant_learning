import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, User, BlacklistToken
from flask_bcrypt import Bcrypt
import time

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
        self.assertTrue(User.decode_auth_token(
            auth_token.decode("utf-8")) == user.id)

    def test_registration(self):
        """ Test for user registration """
        user = User.query.filter_by(email='registerjoe@gmail.com').first()
        if user:
            user.delete()
        response = self.client().post(
            '/register',
            json={
                "email": 'registerjoe@gmail.com',
                "password": '098765'
            },
            content_type='application/json'
        )
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'success')
        self.assertTrue(data['message'] == 'Successfully registered.')
        self.assertTrue(data['auth_token'])
        self.assertTrue(response.content_type == 'application/json')
        self.assertEqual(response.status_code, 201)

    def test_registered_with_already_registered_user(self):
        """ Test registration with already registered email"""
        user = User.query.filter_by(email='registerjoe@gmail.com').first()
        if not user:
            user = User(
                email='registerjoe@gmail.com',
                password='098765'
            )
            user.insert()
        response = self.client().post(
            '/register',
            json={
                "email": 'registerjoe@gmail.com',
                "password": '098765'
            },
            content_type='application/json'
        )
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'fail')
        self.assertTrue(
            data['message'] == 'User already exists. Please Log in.')
        self.assertTrue(response.content_type == 'application/json')
        self.assertEqual(response.status_code, 202)

    def test_registered_user_login(self):
        """ Test for login of registered-user login """
        # user registration
        user = User.query.filter_by(email='registerjoe@gmail.com').first()
        if not user:
            response = self.client().post(
                '/register',
                json={
                    "email": 'registerjoe@gmail.com',
                    "password": '098765'
                },
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['message'] == 'Successfully registered.')
            self.assertTrue(data['auth_token'])
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 201)
        # registered user login
        response = self.client().post(
            '/login',
            json={
                "email": 'registerjoe@gmail.com',
                "password": '098765'
            },
            content_type='application/json'
        )
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'success')
        self.assertTrue(data['message'] == 'Successfully logged in.')
        self.assertTrue(data['auth_token'])
        self.assertTrue(response.content_type == 'application/json')
        self.assertEqual(response.status_code, 200)

    def test_non_registered_user_login(self):
        """ Test for login of non-registered user """
        response = self.client().post(
            '/login',
            json={
                "email": 'not-registerjoe@gmail.com',
                "password": '098765'
            },
            content_type='application/json'
        )
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'fail')
        self.assertTrue(data['message'] == 'User does not exist.')
        self.assertTrue(response.content_type == 'application/json')
        self.assertEqual(response.status_code, 404)

    def test_user_status(self):
        """ Test for user status """
        user = User.query.filter_by(email='statusjoe@gmail.com').first()
        if user:
            user.delete()
        resp_register = self.client().post(
            '/register',
            json={
                "email": 'statusjoe@gmail.com',
                "password": '123456'
            },
            content_type='application/json'
        )

        response = self.client().get(
            '/status',
            headers=dict(
                Authorization='Bearer ' + json.loads(
                    resp_register.data.decode()
                )['auth_token']
            )
        )
        data = json.loads(response.data.decode())

        self.assertTrue(data['status'] == 'success')
        self.assertTrue(data['data'] is not None)
        self.assertTrue(data['data']['email'] == 'statusjoe@gmail.com')
        self.assertTrue(data['data']['admin'] is 'true' or 'false')
        self.assertEqual(response.status_code, 200)

    def test_valid_logout(self):
        """ Test for logout before token expires """
        # user registration
        user = User.query.filter_by(email='logoutjoe@gmail.com').first()
        if user:
            user.delete()
        resp_register = self.client().post(
            '/register',
            json={
                "email": 'logoutjoe@gmail.com',
                "password": '123456'
            },
            content_type='application/json',
        )
        data_register = json.loads(resp_register.data.decode())
        self.assertTrue(data_register['status'] == 'success')
        self.assertTrue(
            data_register['message'] == 'Successfully registered.')
        self.assertTrue(data_register['auth_token'])
        self.assertTrue(resp_register.content_type == 'application/json')
        self.assertEqual(resp_register.status_code, 201)
        # user login
        resp_login = self.client().post(
            '/login',
            json={
                "email": 'logoutjoe@gmail.com',
                "password": '123456'
            },
            content_type='application/json'
        )
        data_login = json.loads(resp_login.data.decode())
        self.assertTrue(data_login['status'] == 'success')
        self.assertTrue(data_login['message'] == 'Successfully logged in.')
        self.assertTrue(data_login['auth_token'])
        self.assertTrue(resp_login.content_type == 'application/json')
        self.assertEqual(resp_login.status_code, 200)
        # valid token logout
        response = self.client().post(
            '/logout',
            headers=dict(
                Authorization='Bearer ' + json.loads(
                    resp_login.data.decode()
                )['auth_token']
            )
        )
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'success')
        self.assertTrue(data['message'] == 'Successfully logged out.')
        self.assertEqual(response.status_code, 200)

    def test_invalid_logout(self):
        """ Test for logout before token expires """
        # user registration
        user = User.query.filter_by(email='logoutjoe@gmail.com').first()
        if user:
            user.delete()
        resp_register = self.client().post(
            '/register',
            json={
                "email": 'logoutjoe@gmail.com',
                "password": '123456'
            },
            content_type='application/json',
        )
        data_register = json.loads(resp_register.data.decode())
        self.assertTrue(data_register['status'] == 'success')
        self.assertTrue(
            data_register['message'] == 'Successfully registered.')
        self.assertTrue(data_register['auth_token'])
        self.assertTrue(resp_register.content_type == 'application/json')
        self.assertEqual(resp_register.status_code, 201)
        # user login
        resp_login = self.client().post(
            '/login',
            json={
                "email": 'logoutjoe@gmail.com',
                "password": '123456'
            },
            content_type='application/json'
        )
        data_login = json.loads(resp_login.data.decode())
        self.assertTrue(data_login['status'] == 'success')
        self.assertTrue(data_login['message'] == 'Successfully logged in.')
        self.assertTrue(data_login['auth_token'])
        self.assertTrue(resp_login.content_type == 'application/json')
        self.assertEqual(resp_login.status_code, 200)
        # invalid token logout
        time.sleep(6)
        response = self.client().post(
            '/logout',
            headers=dict(
                Authorization='Bearer ' + json.loads(
                    resp_login.data.decode()
                )['auth_token']
            )
        )
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'fail')
        self.assertTrue(
            data['message'] == 'Signature expired. Please log in again.')
        self.assertEqual(response.status_code, 401)

    def test_valid_blacklisted_token_logout(self):
        """ Test for logout after a valid token gets blacklisted """
        # user registration
        user = User.query.filter_by(email='blacklistedjoe@gmail.com').first()
        if user:
            user.delete()
        resp_register = self.client().post(
            '/register',
            json={
                "email": 'blacklistedjoe@gmail.com',
                "password": '123456'
            },
            content_type='application/json',
        )
        data_register = json.loads(resp_register.data.decode())
        self.assertTrue(data_register['status'] == 'success')
        self.assertTrue(
            data_register['message'] == 'Successfully registered.')
        self.assertTrue(data_register['auth_token'])
        self.assertTrue(resp_register.content_type == 'application/json')
        self.assertEqual(resp_register.status_code, 201)
        # user login
        resp_login = self.client().post(
            '/login',
            json={
                "email": 'blacklistedjoe@gmail.com',
                "password": '123456'
            },
            content_type='application/json'
        )
        data_login = json.loads(resp_login.data.decode())
        self.assertTrue(data_login['status'] == 'success')
        self.assertTrue(data_login['message'] == 'Successfully logged in.')
        self.assertTrue(data_login['auth_token'])
        self.assertTrue(resp_login.content_type == 'application/json')
        self.assertEqual(resp_login.status_code, 200)
        # blacklist a valid token
        blacklist_token = BlacklistToken(
            token=json.loads(resp_login.data.decode())['auth_token'])
        blacklist_token.insert()
        # blacklisted valid token logout
        response = self.client().post(
            '/logout',
            headers=dict(
                Authorization='Bearer ' + json.loads(
                    resp_login.data.decode()
                )['auth_token']
            )
        )
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'fail')
        self.assertTrue(data['message'] ==
                        'Token blacklisted. Please log in again.')
        self.assertEqual(response.status_code, 401)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
