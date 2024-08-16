import os

from flask import Flask, request
from flask_cors import CORS
from gradio_client import Client
from PIL import Image

from src.utils.response import Response
from src.utils.TextTableDetection import TextTableDetection

os.environ["TESSDATA_PREFIX"] = os.path.join(os.getcwd(), "src", "data", "weights", "tessdata")

bot = Client("ShynBui/Vector_db_v3")
app = Flask(__name__)
CORS(app)

model = TextTableDetection()

@app.route("/predict", methods=["POST"])
def predict():
    data = request.form
    files = request.files

    quote: str = data["quote"]
    history: str = ''
    if data['history'] != '[]':
        history = data['history']

    if 'file' in files:
        file = files['file']
        if file.filename != '':
            img = Image.open(file).convert("RGB")
            txt_from_img = model.predict(img)
            quote = txt_from_img + "\n" + quote

    print(quote)
    print(history)

    try:
        result = bot.predict(
            quote=quote,
            history=history,
            api_name="/predict"
        )
        data = {
            "new_question": result[0],
            "answer": result[1]
        }
        return Response.Ok(data=data)
    except Exception as e:
        print(e)
        return Response.Error(message="Failed to connect to server")
