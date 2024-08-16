from flask import Blueprint, request, jsonify
from src.utils.connect import connect_to_database


message_blueprint = Blueprint('messages', __name__, url_prefix="/messages")
connection = connect_to_database()

@message_blueprint.route('/', methods=['POST'])
def add_message():
    if connection:
        data = request.json
        session_id = data['session_id']
        question = data['question']
        answer = data['answer']
        question_time = data['question_time']
        answer_time = data['answer_time']
        comment = data.get('comment', '')
        message_summary=data.get('message_summary','')

        cursor = connection.cursor()
        sql = "INSERT INTO message (session_id, question, answer, question_time, answer_time, comment, message_summary) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        # Loại bỏ hoặc cung cấp giá trị mặc định cho message_summary trong dữ liệu JSON
        values = (session_id, question, answer, question_time, answer_time, comment, message_summary)
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()

        # Lấy qa_id của phần tử vừa thêm
        qa_id = cursor.lastrowid


        # Trả về câu trả lời JSON bao gồm qa_id
        return jsonify({"message": "Message added successfully", "qa_id": qa_id}), 201
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Lấy thông tin tất cả các tin nhắn
@message_blueprint.route('/', methods=['GET'])
def get_all_messages():
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM message")
        messages = cursor.fetchall()
        cursor.close()
        return jsonify(messages), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

@message_blueprint.route('/<int:messages_id>', methods=['GET'])
def get_session(messages_id):
    if connection:
        cursor = connection.cursor(dictionary=True)
        sql = "SELECT * FROM message WHERE messages_id = %s"
        cursor.execute(sql, (messages_id,))
        messages = cursor.fetchone()
        cursor.close()
        if messages:
            return jsonify(messages), 200
        else:
            return jsonify({"error": "messages not found"}), 404
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Cập nhật thông tin của một tin nhắn
@message_blueprint.route('/<int:qa_id>', methods=['PUT'])
def update_message(qa_id):
    if connection:
        data = request.json
        session_id = data['session_id']
        question = data['question']
        answer = data['answer']
        question_time = data['question_time']
        answer_time = data['answer_time']
        comment = data.get('comment', '')
        star = data.get('star', '')


        cursor = connection.cursor()
        sql = "UPDATE message SET session_id=%s, question=%s, answer=%s, question_time=%s, answer_time=%s, comment=%s, star = %s WHERE qa_id=%s"
        values = (session_id, question, answer, question_time, answer_time, comment,star, qa_id)
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        return jsonify({"message": "Message updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Xóa một tin nhắn
@message_blueprint.route('/<int:qa_id>', methods=['DELETE'])
def delete_message(qa_id):
    if connection:
        cursor = connection.cursor()
        sql = "DELETE FROM message WHERE qa_id=%s"
        values = (qa_id,)
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        return jsonify({"message": "Message deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500

# Lấy thông tin tất cả session của một user dựa trên session_id
@message_blueprint.route('/session/<int:session_id>', methods=['GET'])
def get_sessions_by_user_id(session_id):
    if connection:
        cursor = connection.cursor(dictionary=True)
        sql = "SELECT * FROM message WHERE session_id = %s ORDER BY qa_id"
        cursor.execute(sql, (session_id,))
        sessions = cursor.fetchall()
        cursor.close()
        return jsonify(sessions), 200
    else:
        return jsonify({"error": "Failed to connect to database"}), 500
