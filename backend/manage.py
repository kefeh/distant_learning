from flask_script import Manager, Command
from flaskr import create_app
from models import setup_db, User, BlacklistToken, Classes
from flask_bcrypt import Bcrypt

SECRET_KEY = 'minesec_distance_learning'
BCRYPT_LOG_ROUNDS = 13

app = create_app()
bcrypt = Bcrypt(app)

def createAdmin():
    user = User.query.filter_by(email='admin@minesec-distancelearning.cm').first()
    if user:
        user.admin = True
        user.update()
    else:
        user = User(
            name="Admin",
            email='admin@minesec-distancelearning.cm',
            password=bcrypt.generate_password_hash(
                'educ2020distminesec', BCRYPT_LOG_ROUNDS).decode(),
            admin=True
        )
        user.insert()

    print("successfully inserted")
    print(user.id)

if __name__ == '__main__':
    manager = Manager(app)
    manager.add_command('creat_admin', Command(createAdmin))
    manager.run()