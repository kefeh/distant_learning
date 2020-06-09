# Full Stack Trivia API Backend

## Getting Started

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.

##### Key Dependencies

- [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py. 

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server. 

## Database Setup
With Postgres running, restore a database using the trivia.psql file provided. From the backend folder in terminal run:
```bash
psql distantLearn < distantLearn.psql
```

## Running the server

From within the `backend` directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
export FLASK_APP=flaskr
export FLASK_ENV=development
flask run
```

Setting the `FLASK_ENV` variable to `development` will detect file changes and restart the server automatically.

Setting the `FLASK_APP` variable to `flaskr` directs flask to use the `flaskr` directory and the `__init__.py` file to find the application. 


Endpoints
GET '/categories'
GET '/questions'
GET '/categories/<int:category_id>/questions'
POST '/questions'
POST '/quizzes'
POST '/questions/search'
DELETE '/questions/<int:question_id>'

GET '/categories'
- Fetches a dictionary of categories in which the keys are the ids and the value is the corresponding string of the category
- Request Arguments: None
- Returns: An object with a single key, categories, that contains a object of id: category_string key:value pairs. 
```
{'1' : "Science",
'2' : "Art",
'3' : "Geography",
'4' : "History",
'5' : "Entertainment",
'6' : "Sports"}
```


GET '/questions'
- Fetches a dictionary of result, (including pagination (every 10 questions)) list of questions, number of total questions, current category, categories
- Request Arguments: None
- Request Parameters: page (integer indicating the page number for pagination)
- Returns: A list of objects, categories, that contains a object of questions: list of question objects, total_questions: number of returned, questions. current_category: category, categories: an object of categories, that contains a object of id: category_string key:value pairs
```
{
  "categories": {
    "1": "Science", 
    "2": "Art", 
    "3": "Geography", 
    "4": "History", 
    "5": "Entertainment", 
    "6": "Sports"
  }, 
  "current_category": " ", 
  "questions": [
    {
      "answer": "Tom Cruise", 
      "category": 5, 
      "difficulty": 4, 
      "id": 4, 
      "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
    }, 
    {
      "answer": "Edward Scissorhands", 
      "category": 5, 
      "difficulty": 3, 
      "id": 6, 
      "question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
    }], 
  "total_questions": 2
  ```

GET '/categories/<int:category_id>/questions'
- Fetches a dictionary of result for a particular category, (including pagination (every 10 questions)) list of questions, number of total questions, current category, categories
- Request Arguments: None
- Returns: A list of objects, categories, that contains a object of questions: list of question objects, total_questions: number of returned, questions. current_category: category, categories: an object of categories, that contains a object of id: category_string key:value pairs
```
{
  "categories": {
    "1": "Science", 
    "2": "Art", 
    "3": "Geography", 
    "4": "History", 
    "5": "Entertainment", 
    "6": "Sports"
  }, 
  "current_category": " ", 
  "questions": [
    {
      "answer": "Tom Cruise", 
      "category": 5, 
      "difficulty": 4, 
      "id": 4, 
      "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
    }, 
    {
      "answer": "Edward Scissorhands", 
      "category": 5, 
      "difficulty": 3, 
      "id": 6, 
      "question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
    }], 
  "total_questions": 2
  ```

POST '/questions'
- Creates a new question
- Request Arguments: question: (string)the question body, answer: (string)the answer, category: (int) the id of category it belongs to, difficulty: (int) level of dificulty
- Returns success message
```{'message': 'success'}```


POST '/questions/search'
- Fetches questions that matches a term
- Request Arguments: searchTerm [string term to be searched]
- Returns: A list of objects, categories, that contains a object of questions: list of question objects, total_questions: number of returned, questions. current_category: category, categories: an object of categories, that contains a object of id: category_string key:value pairs
```
{
  "categories": {
    "1": "Science", 
    "2": "Art", 
    "3": "Geography", 
    "4": "History", 
    "5": "Entertainment", 
    "6": "Sports"
  }, 
  "current_category": " ", 
  "questions": [
    {
      "answer": "Tom Cruise", 
      "category": 5, 
      "difficulty": 4, 
      "id": 4, 
      "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
    }, 
    {
      "answer": "Edward Scissorhands", 
      "category": 5, 
      "difficulty": 3, 
      "id": 6, 
      "question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
    }], 
  "total_questions": 2
```

POST '/quizzes'
- get questions to play the quiz
- Request Arguments:
    previous_questions: list of question ids
    quiz_category: category object
- Returns: A question object
```
  {
      'id': 1,
      'question': what is H20,
      'answer': water,
      'category': 3,
      'difficulty': 5
    }
```

# Error Handling

Errors are returned as JSON objects in the following format:
```
{
    "error": 400,
    "message": "bad request"
}
```
- 422: Unprocessable
- 400: Bad Request
- 404: Not Found
- 500: Sever Error 

## Testing
To run the tests, run
```
sudo -u postgres dropdb distantLearn_test
sudo -u postgres createdb distantLearn_test
python test_flaskr.py
```