from flask import Blueprint, request, jsonify
from src.data.connect import connect_to_database

connection = connect_to_database()

session_blueprint = Blueprint('sessions', __name__, url_prefix="/sessions")

# Thêm một session mới
@session_blueprint.route('/', methods=['POST'])
def add_session():
    if connection:
        data = request.json
        name = data.get('name', '')
        start_time = data['start_time']
        end_time = data.get('end_time', None)
        user_id = data['user_id']

        cursor = connection.cursor()
        sql = "INSERT INTO session (name, start_time, end_time, user_id) VALUES (%s, %s, %s, %s)"
        values = (name, start_time, end_time, user_id)
        cursor.execute(sql, values)
        session_id = cursor.lastrowid  # Lấy ID của session vừa được thêm
        connection.commit()
        cursor.close()
        
        return jsonify({"message": "Session added successfully", "session_id": session_id}), 201
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Lấy thông tin tất cả session
@session_blueprint.route('/', methods=['GET'])
def get_all_sessions():
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM session")
        sessions = cursor.fetchall()
        cursor.close()
        
        return jsonify(sessions), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500


# Lấy thông tin của một session dựa trên session_id
@session_blueprint.route('/<int:session_id>', methods=['GET'])
def get_session(session_id):
    if connection:
        cursor = connection.cursor(dictionary=True)
        sql = "SELECT * FROM session WHERE session_id = %s"
        cursor.execute(sql, (session_id,))
        session = cursor.fetchone()
        cursor.close()
        
        if session:
            return jsonify(session), 200
        else:
            return jsonify({"error": "Session not found"}), 404
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Cập nhật thông tin của một session dựa trên session_id
@session_blueprint.route('/<int:session_id>', methods=['PUT'])
def update_session(session_id):
    if connection:
        data = request.json
        name = data.get('name', '')
        start_time = data.get('start_time', None)
        end_time = data.get('end_time', None)

        cursor = connection.cursor()
        sql = "UPDATE session SET name=%s, start_time=%s, end_time=%s WHERE session_id=%s"
        values = (name, start_time, end_time, session_id)
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        
        return jsonify({"message": "Session updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Xóa một session dựa trên session_id
@session_blueprint.route('/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    
    if connection:
        cursor = connection.cursor()
        sql = "DELETE FROM session WHERE session_id=%s"
        values = (session_id,)
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        
        return jsonify({"message": "Session deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500
    
# Lấy thông tin tất cả session của một user dựa trên user_id
@session_blueprint.route('/user/<int:user_id>', methods=['GET'])
def get_sessions_by_user_id(user_id):
    
    if connection:
        cursor = connection.cursor(dictionary=True)
        sql = "SELECT * FROM session WHERE user_id = %s ORDER BY end_time DESC"
        cursor.execute(sql, (user_id,))
        sessions = cursor.fetchall()
        cursor.close()
        
        return jsonify(sessions), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500
