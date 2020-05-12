import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, Question, Category


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "trivia_test"
        self.database_path = "postgres://{}/{}".format(
            'localhost:5432', self.database_name)
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

    def test_get_categories(self):
        res = self.client().get('/categories')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['categories'])

    def test_get_questions(self):
        res = self.client().get('/questions?page=1')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['total_questions'])
        self.assertTrue(len(data['questions']))

    def test_404_beyond_valid_page(self):
        res = self.client().get('/questions?page=100')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['message'], 'Not Found')

    def test_delete_questions(self):
        res = self.client().delete('/questions/2')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['message'])
        self.assertEqual(data['message'], 'Delete Successful')

    def test_404_no_question_to_delete(self):
        res = self.client().delete('/questions/4000')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['message'], 'Not Found')

    def test_create_questions(self):
        json_data = {
            'question': 'test_question',
            'answer': 'test_answer',
            'difficulty': 1,
            'category': 1
        }
        res = self.client().post('/questions', json=json_data)
        data = json.loads(res.data)

        self.assertTrue(data['message'])
        self.assertEqual(data['message'], 'success')

    def test_422_create_question(self):
        json_data = {
            'question': '',
            'answer': 'test_answer',
            'difficulty': 1,
            'category': 1
        }
        res = self.client().post('/questions', json=json_data)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 422)
        self.assertEqual(data['message'], 'Unprocessable')

    def test_quizzes(self):
        json_data = {
            'previous_questions': [],
            'quiz_category': {"type": "Geography", "id": "3"},
        }
        res = self.client().post('/quizzes', json=json_data)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['question'])

    def test_422_quizzes(self):
        json_data = {
            'previous_questions': [],
            'quiz_category': {},
        }
        res = self.client().post('/quizzes', json=json_data)

        data = json.loads(res.data)
        self.assertEqual(res.status_code, 422)
        self.assertEqual(data['message'], 'Unprocessable')

    def test_get_questions_per_category(self):
        res = self.client().get('/categories/1/questions')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(data['questions']))
        self.assertTrue(data['total_questions'])

    def test_404_beyond_valid_category(self):
        res = self.client().get('/categories/1000/questions')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['message'], 'Not Found')

    def test_get_questions_per_search(self):
        json_data = {
            'searchTerm': 'what'
        }
        res = self.client().post('/questions/search', json=json_data)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(data['questions']))
        self.assertTrue(data['total_questions'])

    def test_404_beyond_valid_search(self):
        json_data = {
            'searchTerm': 'muuuuuuuuuuuuu'
        }
        res = self.client().post('/questions/search', json=json_data)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['message'], 'Not Found')


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
