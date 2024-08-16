import os
from src import app

if __name__ == '__main__':
    HOST = os.getenv("SERVER_HOST", "localhost")
    PORT = os.getenv("SERVER_PORT", 5000)
    app.run(host=HOST, port=PORT, debug=True)

