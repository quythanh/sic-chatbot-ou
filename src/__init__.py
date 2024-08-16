from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from src.utils.secret import generate_secret_key

from src.apiServer.user_api import user_blueprint
from src.apiServer.message_api import message_blueprint
from src.apiServer.session_api import session_blueprint
from src.apiServer.role_api import role_blueprint

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = generate_secret_key()
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)  # Token truy cập hết hạn sau 30 ngày
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=1) # Token làm mới hết hạn sau 60 ngày

jwt = JWTManager(app)
CORS(app)

app.register_blueprint(user_blueprint)
app.register_blueprint(message_blueprint)
app.register_blueprint(session_blueprint)
app.register_blueprint(role_blueprint)
