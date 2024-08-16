from data.connect import connect_to_database

connection = connect_to_database()
mycursor = connection.cursor()

with open('src/data/dump.sql', 'r') as file:
    sql_script = file.read()

commands = sql_script.split(';')

for command in commands:
    try:
        mycursor.execute(command)
        connection.commit()
    except Exception as e:
        print("Error:", e)

print("Tables and data have been created successfully")
