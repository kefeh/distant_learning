import os
from flask import Flask, request, abort, jsonify
from flask import send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, desc, update, asc
from flask_cors import CORS
from datetime import datetime
from flask_bcrypt import Bcrypt
import random

from models import setup_db, System, Category, Education, Classes, Video, SubCategory, Question, Answer, User
from video_util import upload_video

QUESTIONS_PER_PAGE = 10
SECRET_KEY = 'minesec_distance_learning'
BCRYPT_LOG_ROUNDS = 13


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, static_folder="../../frontend/build",
                static_url_path="")
    setup_db(app)
    bcrypt = Bcrypt(app)

    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    @app.after_request
    def add_cors_headers(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET, PUT, POST, PATCH, DELETE, OPTIONS')
        return response

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def index(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            file_name = path.split("/")[-1]
            dir_name = os.path.join(
                app.static_folder, "/".join(path.split("/")[:-1]))
            return send_from_directory(dir_name, file_name)
        return send_from_directory(app.static_folder, 'index.html')


# Add endpoints
# Register User


    @app.route('/register', methods=['POST'])
    def register_user():
        print("Registering a user")
        data = request.json
        if ((data.get('email') == '') or (data.get('password') == '')):
            abort(422)
        user = User.query.filter_by(email=data.get('email')).first()
        if not user:
            try:
                user = User(
                    email=data.get('email'),
                    password=bcrypt.generate_password_hash(
                        data.get('password'), BCRYPT_LOG_ROUNDS).decode()
                )

                # insert the user
                user.insert()
                # generate the auth token
                auth_token = user.encode_auth_token(user.id)
                responseObject = {
                    'status': 'success',
                    'message': 'Successfully registered.',
                    'auth_token': auth_token.decode()
                }
                return jsonify(responseObject), 201
            except Exception as e:
                responseObject = {
                    'status': 'fail',
                    'message': 'Some error occurred. Please try again.'
                }
                return jsonify(responseObject), 401
        else:
            responseObject = {
                'status': 'fail',
                'message': 'User already exists. Please Log in.',
            }
            return jsonify(responseObject), 202
    # except Exception:
    #     abort(422)

        return jsonify({'message': 'success', 'id': system.id})

# add system
    @app.route('/systems', methods=['POST'])
    def add_system():
        print("adding systems")
        data = request.json
        print(data)
        if ((data.get('name') == '')):
            abort(422)
    # try:
        system = System(name=data.get('name'))
        system.rank = data.get('rank')
        system.insert()
    # except Exception:
    #     abort(422)

        return jsonify({'message': 'success', 'id': system.id})

    @app.route('/systems', methods=['PUT'])
    def update_system():
        print("updating systems")
        data = request.json
        print(data)
        if ((data.get('name') == '') or (data.get('id') == '')):
            abort(422)
    # try:
        system = System.query.get(data.get('id'))
        system.name = data.get('name')
        system.rank = data.get('rank')
        system.update()
    # except Exception:
    #     abort(422)

        return jsonify({'message': 'success', 'id': system.id})


# Add Education level

    @app.route('/educations', methods=['POST'])
    def add_education():
        data = request.json
        print(data)
        if ((data.get('name', '') == '') or (data.get('system_id', '') == '')):
            abort(422)
        try:
            education = Education(name=data.get(
                'name'))
            education.system_id = data.get('system_id')
            education.rank = data.get('rank')
            education.insert()
        except Exception:
            abort(422)

        return jsonify({'message': 'success', 'id': education.id})

    @app.route('/educations', methods=['PUT'])
    def update_educations():
        print("updating educations")
        data = request.json
        print(data)
        if ((data.get('name') == '') or (data.get('id') == '')):
            abort(422)
    # try:
        education = Education.query.get(data.get('id'))
        education.name = data.get('name')
        education.rank = data.get('rank')
        education.update()
    # except Exception:
    #     abort(422)

        return jsonify({'message': 'success', 'id': education.id})


# Add Category level

    @app.route('/categories', methods=['POST'])
    def add_category():
        data = request.json
        if ((data.get('name', '') == '') or (
                data.get('class_id', '') == '')):
            abort(422)
        try:
            category = Category(name=data.get(
                'name'))
            category.class_id = data.get('class_id')
            category.rank = data.get('rank')
            category.insert()
        except Exception:
            abort(422)

        return jsonify({'message': 'success', 'id': category.id})

    @app.route('/categories', methods=['PUT'])
    def update_categories():
        print("updating categories")
        data = request.json
        print(data)
        if ((data.get('name') == '') or (data.get('id') == '')):
            abort(422)
    # try:
        category = Category.query.get(data.get('id'))
        category.name = data.get('name')
        category.rank = data.get('rank')
        category.update()
    # except Exception:
    #     abort(422)

        return jsonify({'message': 'success', 'id': category.id})

# Add Sub Category level

    @app.route('/sub_categories', methods=['POST'])
    def add_sub_category():
        data = request.json
        education_id = data.get('education_id', None)

        if ((data.get('name', '') == '') or (data.get('education_id', '') == '')):
            abort(422)
        try:
            sub_category = SubCategory(name=data.get(
                'name'))
            sub_category.education_id = data.get('education_id')
            sub_category.rank = data.get('rank')
            sub_category.insert()
        except Exception:
            abort(422)

        return jsonify({'message': 'success', 'id': sub_category.id})

    # Add Sub Category level

    @app.route('/sub_categories', methods=['PUT'])
    def update_subub_category():
        data = request.json

        if ((data.get('name', '') == '') or (data.get('id', '') == '')):
            abort(422)
        try:
            sub_category = SubCategory.query.get(data.get('id'))
            sub_category.name = data.get('name')
            sub_category.rank = data.get('rank')
            sub_category.update()
        except Exception:
            abort(422)

        return jsonify({'message': 'success', 'id': sub_category.id})


# Add Class level

    @app.route('/class', methods=['POST'])
    def add_class():
        data = request.json
        education_id = data.get('education_id', None)
        sub_category_id = data.get('sub_category_id', None)

        if ((data.get('name', '') == '')):
            abort(422)
        try:
            classes = Classes(name=data.get(
                'name'))
            classes.rank = data.get('rank')
            if education_id or sub_category_id:
                if education_id:
                    classes.education_id = int(data.get('education_id'))
                if sub_category_id:
                    classes.sub_category_id = int(data.get('sub_category_id'))
            else:
                abort(422)
        except Exception:
            abort(422)
        classes.insert()

        return jsonify({'message': 'success', 'id': classes.id})

    @app.route('/class', methods=['PUT'])
    def update_class():
        print("updating class")
        data = request.json
        print(data)
        if ((data.get('name') == '') or (data.get('id') == '')):
            abort(422)
    # try:
        classes = Classes.query.get(data.get('id'))
        classes.name = data.get('name')
        classes.rank = data.get('rank')
        classes.update()
    # except Exception:
    #     abort(422)

        return jsonify({'message': 'success', 'id': classes.id})

# Add Category level

    @app.route('/subject', methods=['POST'])
    def add_subject():
        data = request.json
        if ((data.get('name', '') == '') or (
                data.get('class_id', '') == '')):
            abort(422)
        try:
            subject = Subject(name=data.get(
                'name'))
            subject.class_id = data.get('class_id')
            subject.rank = data.get('rank')
            subject.insert()
        except Exception:
            abort(422)

        return jsonify({'message': 'success', 'id': subject.id})

    @app.route('/video', methods=['POST'])
    def add_video():
        from datetime import datetime
        data = request.form
        data = data.to_dict(flat=False)
        print(request.files)
        print(data)
        if ('file' not in request.files) and (data.get('link', '')[0] == ''):
            abort(400)
        link = data.get('link', '')
        if ((data.get('description', '')[0] == '')):
            abort(422)
        description = data.get('description', '')
        date = data.get('date', '')
        if 'file' in request.files:
            video = request.files['file']
            if video.filename == '':
                abort(400)
            file_name = video.filename
            resp = upload_video(video, file_name, description)
            link = resp
            print(link)
            from time import sleep
            sleep(5)
        link = link[0].replace("watch?v=", "embed/")
    # try:
        date = datetime.now()
        up_video = Video(name=data.get(
            'name')[0], link=link, description=description[0], date=date)
        if(data.get('class_id')[0] != '' and data.get('class_id')[0] != '0'):
            class_id = int(data.get('class_id')[0])
            up_class = Classes.query.filter(Classes.id == class_id).one()
            if up_class.categories and not (data.get('category_id')[
                    0] != '' and data.get('category_id')[0] != '0'):
                abort(422, description="Please select a level or Cycle")
        up_video.class_id = data.get('class_id')[0] if(
            data.get('class_id')[0] != '' and data.get('class_id')[0] != '0') else None
        up_video.category_id = data.get('category_id')[0] if (data.get('category_id')[
            0] != '' and data.get('category_id')[0] != '0') else None
        if up_video.class_id == None and up_video.category_id == None:
            abort(422, description="Please select a Class or level/Cycle")
        up_video.insert()
    # except Exception:
    #     abort(422)

        return jsonify({'message': 'success', 'id': up_video.id})

    def add_upload_video():
        if ('file' not in request.files):
            print('no file')
            abort(400)
        video = request.files['file']
        if video.filename == '':
            print('no file name')
            abort(400)
        file_name = video.filename
        resp = upload_video(video, file_name, description)
        link = resp
        if link:
            return jsonify({'url': link, 'message': 'success'})
        abort(422)


# Get endpoints

    @app.route('/educations', methods=['GET'])
    def get_education():
        system_id = request.args.get('system_id')
        if system_id:
            educations = Education.query.order_by(asc(Education.rank)).filter(
                Education.system_id == system_id)
        else:
            educations = Education.query.order_by(asc(Education.rank)).all()
        result = []
        # print(educations)
        for education in educations:
            sm_edu = education.format()
            category_lists = sm_edu.get('category_list')
            result.append(sm_edu)
            classes = sm_edu.get('class_list', [])
            class_list = []
            for s_class in classes:
                s_class = s_class.format()
                s_class.pop('categories')
                class_list.append(s_class)
            sub_categories = sm_edu.get('sub_categories', [])
            sub_categories = []
            for s_category in sub_categories:
                s_category = s_category.format()
                s_category.pop('class_list')
                sub_categories.append(s_category)
            sm_edu['class_list'] = class_list
            sm_edu['sub_categories'] = sub_categories
        from pprint import pprint
        pprint(educations)

        return jsonify({'data': result, 'message': 'success'})

    @app.route('/categories', methods=['GET'])
    def get_categories():
        class_id = request.args.get('class_id')
        if class_id:
            categories = Category.query.order_by(
                asc(Category.rank)).filter(Category.class_id == class_id)
        else:
            categories = Category.query.order_by(asc(Category.rank)).all()
        result = []
        for category in categories:
            category = category.format()
            videos = category.get('videos', [])
            videos = []
            for sub_cat in videos:
                sub_cat = sub_cat.format()
                videos.append(sub_cat)
            category['videos'] = videos
            result.append(category)
        return jsonify({'data': result, 'message': 'success'})

    @app.route('/sub_categories', methods=['GET'])
    def get_sub_categories():
        education_id = request.args.get('education_id')
        if education_id:
            categories = SubCategory.query.order_by(asc(SubCategory.rank)).filter(
                SubCategory.education_id == education_id)
        else:
            categories = SubCategory.query.order_by(
                asc(SubCategory.rank)).all()
        result = []
        for category in categories:
            category = category.format()
            classes = category.get('class_list', [])
            class_list = []
            for s_class in classes:
                s_class = s_class.format()
                s_class.pop('categories')
                class_list.append(s_class)
            category['class_list'] = class_list
            result.append(category)
            print(category)
        return jsonify({'data': result, 'message': 'success'})

    @app.route('/class', methods=['GET'])
    def get_classes():
        education_id = request.args.get('education_id')
        sub_category_id = request.args.get('sub_category_id')

        if sub_category_id:
            classes = Classes.query.order_by(asc(Classes.rank)).filter(
                Classes.sub_category_id == sub_category_id)
        elif education_id:
            classes = Classes.query.order_by(asc(Classes.rank)).filter(
                Classes.education_id == education_id)
        else:
            classes = Classes.query.order_by(asc(Classes.rank)).all()
        result = []
        for some_class in classes:
            some_class = some_class.format()
            categories = some_class.get('categories', [])
            cat_list = []
            vid_list = []
            for cat in categories:
                cat = cat.format()
                cat.pop('videos')
                cat_list.append(cat)
            some_class['categories'] = cat_list
            result.append(some_class)

        return jsonify({'data': result, 'message': 'success'})

    @app.route('/subject', methods=['GET'])
    def get_subject():
        class_id = request.args.get('class_id')

        if class_id:
            subjects = Subject.query.order_by(
                asc(Subject.name)).filter(Subject.class_id == class_id)
        else:
            subjects = Subject.query.all()
        result = []
        for some_subject in subjects:
            some_subject = some_subject.format()
            some_subject.pop('videos')
            result.append(some_subject)

        return jsonify({'data': result, 'message': 'success'})

    def get_videos_by_education_id(education_id):
        education = Education.query.get(education_id)
        video_list = []
        for a_class in education.class_list:
            videos = Video.query.filter(
                Video.class_id == a_class.id).order_by(asc(Video.date))
            video_list += videos
        video_list = video_list[:10] if len(video_list) > 10 else video_list
        return video_list

    @app.route('/videos', methods=['GET'])
    def get_video():
        class_id = request.args.get('class_id')
        category_id = request.args.get('category_id')
        # adding code that gets all videos based on a particular education id
        education_id = request.args.get('education_id')
        if education_id:
            videos = get_videos_by_education_id(education_id)
        elif category_id:
            videos = Video.query.filter(Video.category_id == category_id)
        elif class_id:
            videos = Video.query.filter(Video.class_id == class_id)
        else:
            videos = Video.query.all()
        result = []
        links = []
        for some_video in videos:
            some_video = some_video.format()
            if some_video.get('link') in links:
                continue
            from pprint import pprint
            links.append(some_video.get('link'))
            pprint(some_video)
            result.append(some_video)

        return jsonify({'data': result, 'message': 'success'})

    @app.route('/systems', methods=['GET'])
    def get_systems():
        systems = System.query.order_by(asc(System.rank)).all()
        from pprint import pprint
        result = []
        for system in systems:
            edu = []
            for ed in system.education_list:
                s_ed = ed.format()
                s = s_ed.pop('class_list')
                sub_cat = []
                for item in s_ed['sub_categories']:
                    t = item.format()
                    t.pop('class_list')
                    sub_cat.append(t)
                s_ed['sub_categories'] = sub_cat
                edu.append(s_ed)
            result.append({
                'name': system.name,
                'id': system.id,
                'rank': system.rank,
                'education_list': edu
            })

        return jsonify({'data': result, 'message': 'success'})

    @app.route('/systems/<int:system_id>', methods=['DELETE'])
    def delete_system(system_id):
        system = System.query.get(system_id)
        if not system:
            abort(404)
        try:
            system.delete()
        except Exception:
            abort(500)
        return jsonify({'success': True, "deleted": system_id})

    @app.route('/educations/<int:education_id>', methods=['DELETE'])
    def delete_education(education_id):
        education = Education.query.get(education_id)
        if not education:
            abort(404)
        try:
            education.delete()
        except Exception:
            abort(500)
        return jsonify({'success': True, 'deleted': education_id})

    @app.route('/categories/<int:category_id>', methods=['DELETE'])
    def delete_category(category_id):
        category = Category.query.get(category_id)
        if not category:
            abort(404)
        try:
            category.delete()
        except Exception:
            abort(500)
        return jsonify({'success': True, 'deleted': category_id})

    @app.route('/sub_categories/<int:sub_category_id>', methods=['DELETE'])
    def delete_sub_category(sub_category_id):
        sub_category = SubCategory.query.get(sub_category_id)
        if not sub_category:
            abort(404)
        try:
            sub_category.delete()
        except Exception:
            abort(500)
        return jsonify({'success': True, "deleted": sub_category_id})

    @app.route('/class/<int:class_id>', methods=['DELETE'])
    def delete_class(class_id):
        classes = Classes.query.get(class_id)
        if not classes:
            abort(404)
        try:
            classes.delete()
        except Exception:
            abort(500)
        return jsonify({'success': True, "deleted": class_id})

    @app.route('/subject/<int:subject_id>', methods=['DELETE'])
    def delete_subject(subject_id):
        subject = Subject.query.get(subject_id)
        if not subject:
            abort(404)
        try:
            subject.delete()
        except Exception:
            abort(500)
        return jsonify({'success': True, "deleted": subject_id})

    @app.route('/video/<int:video_id>', methods=['DELETE'])
    def delete_video(video_id):
        video = Video.query.get(video_id)
        if not video:
            abort(404)
        try:
            video.delete()
        except Exception:
            abort(500)
        return jsonify({'success': True, "deleted": video_id})
    # @app.route('/system', methods=['GET'])
    # def get_categories():
    #     categories = Category.query.all()
    #     result = {}
    #     for category in categories:
    #         result[category.id] = category.type

    #     return jsonify({'categories': result})

    # def question_get_return(page, category_id=None, search_term=None):
    #     """
    #     Generic question search and formatter, that always return the
    #     first page of the results if no page number is specified
    #     """
    #     num_quest = 10
    #     if category_id:
    #         # here we are handling the case where we need questions
    #         # on a particular category
    #         questions = Question.query.filter(
    #             Question.category == category_id).paginate(
    #             max_per_page=num_quest, page=page)
    #         category = Category.query.get(category_id)
    #         if not category:
    #             abort(404)
    #         category_type = category.type
    #     elif search_term:
    #         # Here we are handling the search for a question not
    #         # case sensitive search if the term is a substring of the question
    #         questions = Question.query.filter(
    #             func.lower(Question.question).contains(
    #                 search_term.lower())).paginate(
    #             max_per_page=num_quest, page=page)
    #         category_type = ' '
    #     else:
    #         questions = Question.query.paginate(
    #             max_per_page=num_quest, page=page)
    #         category_type = ' '

    #     questions = [dict(question.format()) for question in questions.items]
    #     categories = Category.query.all()
    #     category_result = {}
    #     for category in categories:
    #         category_result[category.id] = category.type

    #     result = {
    #         "questions": questions,
    #         "total_questions": len(questions),
    #         "current_category": category_type,
    #         'categories': category_result
    #     }

    #     return result

    @app.route('/questions', methods=['GET'])
    def get_questions():

        video_id = request.args.get('video_id', int)

        if not video_id:
            abort(422)

        result = Question.query.filter(
            Question.video_id == video_id).order_by(asc(Question.date)).all()

        result_list = []
        for question in result:
            question = question.format()
            answer_list = []
            for ans in question.pop('answers'):
                ans = ans.format()
                answer_list.append(ans)
            question['answers'] = answer_list
            result_list.append(question)

        print(result_list)

        return jsonify({'data': result_list, 'message': 'success'})

    @app.route('/questions/<int:question_id>', methods=['DELETE'])
    def delete_question(question_id):
        question = Question.query.get(question_id)
        if not question:
            abort(404)
        try:
            question.delete()
        except Exception:
            abort(500)
        return jsonify({'message': "Delete Successful"})

    @app.route('/questions', methods=['POST'])
    def add_question():
        data = request.json
        if (data.get('question') == '') or (data.get('video_id') == ''):
            abort(422)
    # try:
        date = datetime.now()
        question = Question(question=data.get('question', ''),
                            date=date, video_id=data.get('video_id'))
        question.insert()
    # except Exception:
    #     abort(422)

        return jsonify({'message': 'success'})

    @app.route('/answers', methods=['GET'])
    def get_answers():

        question_id = request.args.get('question_id', int)

        if not question_id:
            abort(422)

        result = Answer.query.order_by(asc(Answer.date)).all()

        result_list = []
        for answer in result:
            answer = answer.format()
            result_list.append(answer)

        return jsonify({'data': result_list, 'message': 'success'})

    @app.route('/answers/<int:answer_id>', methods=['DELETE'])
    def delete_answer(answer_id):
        answer = Answer.query.get(answer_id)
        if not answer:
            abort(404)
        try:
            answer.delete()
        except Exception:
            abort(500)
        return jsonify({'message': "Delete Successful"})

    @app.route('/answers', methods=['POST'])
    def add_answer():
        data = request.json
        if (data.get('answer') == '') or (data.get('question_id') == ''):
            abort(422)
    # try:
        date = datetime.now()
        answer = Answer(answer=data.get('answer', ''), date=date,
                        question_id=data.get('question_id'))
        answer.insert()
    # except Exception:
    #     abort(422)

        return jsonify({'message': 'success'})

    # @app.route('/questions/search', methods=['POST'])
    # def search_question():
    #     search_term = request.json.get('searchTerm', '')
    #     result = question_get_return(1, search_term=search_term)
    #     if not result.get('questions'):
    #         abort(404)

    #     return jsonify(result)

    # @app.route("/categories/<int:category_id>/questions", methods=['GET'])
    # def get_question_per_category(category_id):
    #     result = question_get_return(1, category_id=category_id)
    #     if not result:
    #         abort(404)

    #     return jsonify(result)

    # @app.route('/quizzes', methods=['POST'])
    # def quizes():
    #     data = request.json
    #     previous_questions_list = data.get('previous_questions')
    #     quiz_category = data.get('quiz_category')

    #     if not quiz_category:
    #         abort(422)

    #     question = Question.query.filter(
    #         Question.category == quiz_category.get('id')).filter(
    #         Question.id.notin_(previous_questions_list)).order_by(
    #         func.random()).limit(1).all()

    #     if question:
    #         question = dict(question[0].format())
    #     return jsonify({'question': question})

    @app.errorhandler(404)
    def not_found(error):
        if request.path.startswith("/api/"):
            return jsonify({
                'error': 404,
                'message': 'Not Found'
            }), 404
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({
            'error': 422,
            'message': f'Unprocessable {str(error)}'
        }), 422

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 400,
            'message': 'Bad Request'
        }), 400

    @app.errorhandler(500)
    def sever_error(error):
        return jsonify({
            'error': 500,
            'message': 'Sever Error'
        }), 500

    return app
