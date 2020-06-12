from functools import wraps
from flask import request, g, jsonify, current_app


def requires_auth(f):
    """
    Decorator function which verifies if browser token belong to that user in our databse
    i.e if that user has been authenticated
    :param f: function
    :return:
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        from models import User

        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                user = User.query.get(resp).format()
                # print(user)
                if user:
                    g.current_user = user
                    return f(*args, **kwargs)
            return jsonify(dict(message=resp, status='fail')), 401

        return jsonify(dict(message="Authentication is required to access this resource", status='fail')), 401

    return decorated


def requires_admin(f):
    """
    Decorated function which checks if the current user is the admin
    :param f: function
    :return:
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        from models import User

        # Get the currently logged in user.
        user_id = g.current_user['id']
        user = User.query.get(user_id).format()
        # Checking if the logged in user is the admin. If yes grant access.
        permission = user['admin']
        if not permission:
            resp = dict(message="You Don't have permission to access this resource!", status="fail")
            return jsonify(resp), 401
        return f(*args, **kwargs)
    return decorated