import os
import mysql.connector

# Kết nối đến cơ sở dữ liệu MySQL
def connect_to_database():
    return mysql.connector.connect(
        host=os.environ["DB_HOST"],
        port=os.environ["DB_PORT"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
        charset="utf8mb4",
        collation="utf8mb4_general_ci",
    )

# Thêm một người dùng mới vào bảng 'user'
def add_user(connection, username, password, full_name, email, status, img, role_id):
    cursor = connection.cursor()
    sql = "INSERT INTO user (username, password, full_name, email, status, img, role_id) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    values = (username, password, full_name, email, status, img, role_id)
    cursor.execute(sql, values)
    connection.commit()
    print("User added successfully!")

# Sửa thông tin của một người dùng trong bảng 'user'
def update_user(connection, user_id, username, password, full_name, email, status, img, role_id):
    cursor = connection.cursor()
    sql = "UPDATE user SET username=%s, password=%s, full_name=%s, email=%s, status=%s, img=%s, role_id=%s WHERE user_id=%s"
    values = (username, password, full_name, email, status, img, role_id, user_id)
    cursor.execute(sql, values)
    connection.commit()
    print("User updated successfully!")

# Xóa một người dùng từ bảng 'user' dựa trên user_id
def delete_user(connection, user_id):
    cursor = connection.cursor()
    sql = "DELETE FROM user WHERE user_id=%s"
    values = (user_id,)
    cursor.execute(sql, values)
    connection.commit()
    print("User deleted successfully!")

# Truy vấn tất cả các người dùng từ bảng 'user'
def get_all_users(connection):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM user")
    users = cursor.fetchall()
    return users

# Đóng kết nối đến cơ sở dữ liệu
def close_connection(connection):
    if connection:
        connection.close()
        print("Connection to MySQL database closed.")

# Ví dụ sử dụng các hàm trên:
# connection = connect_to_database()
# if connection:
#     # Thêm người dùng mới
#     add_user(connection, "john_doe", "password123", "John Doe", "john@example.com", 1, "avatar.jpg", 1)

#     # Cập nhật thông tin của người dùng
#     update_user(connection, 1, "john_smith", "newpassword", "John Smith", "john@example.com", 1, "avatar.jpg", 1)

#     # Xóa người dùng
#     delete_user(connection, 1)

#     # Truy vấn tất cả người dùng
#     all_users = get_all_users(connection)
#     print("All users:")
#     for user in all_users:
#         print(user)

#     # Đóng kết nối
#     close_connection(connection)
