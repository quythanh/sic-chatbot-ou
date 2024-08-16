from flask import jsonify

from src.enums import StatusCode


class Response:
    @staticmethod
    def Ok(message: str = '', data = None):
        return jsonify(status=StatusCode.Ok, message=message, data=data), StatusCode.Ok

    @staticmethod
    def Error(message: str = ''):
        return jsonify(status=StatusCode.Error, message=message), StatusCode.Error

