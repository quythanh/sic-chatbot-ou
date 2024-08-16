# user_api.py
from flask import Blueprint, request, jsonify
from src.data.connect import connect_to_database
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/login', methods=['POST'])
# Endpoint xác thực và tạo token
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Kiểm tra xác thực trong cơ sở dữ liệu, ví dụ
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor(dictionary=True)
        sql = "SELECT user_id, username, full_name, email, status, img, role_id  FROM user WHERE username = %s AND password = %s"
        cursor.execute(sql, (username, password))
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            # Tạo token JWT nếu xác thực thành công
            access_token = create_access_token(identity=user['user_id'])
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"error": "Tên đăng nhập hoặc mật khẩu không đúng"}), 401
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# API để lấy thông tin từ token
@user_blueprint.route('/get_token_info', methods=['GET'])
@jwt_required()  # Bắt buộc token phải được gửi cùng với yêu cầu
def get_token_info():
    current_user = get_jwt_identity()  # Lấy thông tin từ token
    return jsonify(current_user), 200


# Thêm một người dùng mới
@user_blueprint.route('/users', methods=['POST'])
def add_user():
    connection = connect_to_database()
    if connection:
        data = request.json
        username = data['username']
        password = data['password']
        full_name = data.get('full_name', username)
        email = data.get('email', '')
        status = data.get('status', 1)
        img = data.get('img', '')
        role_id = 1  # Thực hiện phần quyền sau

        cursor = connection.cursor()

        # Kiểm tra xem username đã tồn tại chưa
        cursor.execute("SELECT user_id FROM user WHERE username = %s", (username,))
        existing_user = cursor.fetchone()

        if existing_user:
            cursor.close()
            connection.close()
            return jsonify({"error": "Username already exists"}), 400

        # Nếu username chưa tồn tại, tiến hành thêm người dùng mới
        sql = "INSERT INTO user (username, password, full_name, email, status, img, role_id) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (username, password, full_name, email, status, img, role_id)
        cursor.execute(sql, values)
        connection.commit()

        # Truy vấn lại cơ sở dữ liệu để lấy thông tin của người dùng vừa được thêm
        cursor.execute("SELECT * FROM user WHERE username = %s", (username,))
        user = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({"message": "User added successfully", "user": user}), 201
    else:
        return jsonify({"error": "Failed to connect to database"}), 500



# Lấy thông tin tất cả người dùng
@user_blueprint.route('/users', methods=['GET'])
def get_all_users():
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT user_id, username, full_name, email, status, img, role_id  FROM user")
        users = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(users), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Lấy thông tin của một người dùng dựa trên user_id
@user_blueprint.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor(dictionary=True)
        sql = "SELECT user_id, username, full_name, email, status, img, role_id  FROM user WHERE user_id = %s"
        cursor.execute(sql, (user_id,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Hàm kết hợp để lấy thông tin từ token và từ cơ sở dữ liệu
@user_blueprint.route('/get_user_info', methods=['GET'])
@jwt_required()
def get_user_info():
    current_user_id = get_jwt_identity()  # Lấy user_id từ token
    connection = connect_to_database()

    if connection:
        cursor = connection.cursor(dictionary=True)
        sql = "SELECT user_id, username, full_name, email, status, img, role_id  FROM user WHERE user_id = %s"
        cursor.execute(sql, (current_user_id,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

@user_blueprint.route('/users/getIDSession', methods=['GET'])
@jwt_required()
def get_user_session():
    current_user_id = get_jwt_identity()  # Lấy user_id từ token
    connection = connect_to_database()
    if not current_user_id:
    # Nếu không có giá trị user_id từ token
        return jsonify({"error": "User not authenticated"}), 401  # Trả về mã lỗi 401 - Unauthorized
    if connection:
        cursor = connection.cursor(dictionary=True)
        sql = """
        SELECT s.*
        FROM session s
        JOIN user u ON s.user_id = u.user_id
        WHERE u.user_id = %s
        ORDER by s.end_time DESC
        """
        cursor.execute(sql, (current_user_id,))
        user_session = cursor.fetchall()
        cursor.close()
        connection.close()


        return jsonify(user_session), 200

    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Cập nhật thông tin của một người dùng
@user_blueprint.route('/users/<int:user_id>', methods=['PUT'])
# @jwt_required()
def update_user(user_id):
    connection = connect_to_database()
    if connection:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        full_name = data.get('full_name', '')
        email = data.get('email', '')
        status = data.get('status', 1)
        img = data.get('img', '')
        role_id = data.get('role_id')

        cursor = connection.cursor()
        sql = "UPDATE user SET username=%s, password=%s, full_name=%s, email=%s, status=%s, img=%s, role_id=%s WHERE user_id=%s"
        values = (username, password, full_name, email, status, img, role_id, user_id)
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": email }), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500


# Xóa một người dùng
@user_blueprint.route('/users/<int:user_id>', methods=['DELETE'])
# @jwt_required()
def delete_user(user_id):
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor()
        sql = "DELETE FROM user WHERE user_id=%s"
        values = (user_id,)
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

@user_blueprint.route('/users/numberChat', methods=['GET'])
def get_number_chat():
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
                        SELECT
    u.user_id,
    u.username,
    u.full_name,
    u.email,
    u.img,
    u.role_id,
    COUNT(CASE WHEN cwe.status = 0 and cwe.emloyee = 0 THEN cwe.id ELSE NULL END) AS announcement,
    COUNT(CASE WHEN cwe.status = 0 and cwe.emloyee = 1 THEN cwe.id ELSE NULL END) AS announcement_user
FROM
    `user` u
LEFT JOIN
    `chat_with_emloyee` cwe ON u.user_id = cwe.user_id
GROUP BY
    u.user_id;

                       """)
        data  = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(data), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

@user_blueprint.route('/users/numberChat/<int:user_id>', methods=['GET'])
def get_number_chat_by_user(user_id):
    connection = connect_to_database()
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                u.user_id,
                u.username,
                u.full_name,
                u.email,
                u.img,
                u.role_id,
                COUNT(CASE WHEN cwe.status = 0 and cwe.emloyee = 0 THEN cwe.id ELSE NULL END) AS announcement,
                COUNT(CASE WHEN cwe.status = 0 and cwe.emloyee = 1 THEN cwe.id ELSE NULL END) AS announcement_user
            FROM
                `user` u
            LEFT JOIN
                `chat_with_emloyee` cwe ON u.user_id = cwe.user_id
            WHERE
                u.user_id = %s
            GROUP BY
                u.user_id;
        """, (user_id,))
        data = cursor.fetchone()
        cursor.close()
        connection.close()
        return jsonify(data), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500
