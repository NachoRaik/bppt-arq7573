from flask import Flask
from flask_api import status

application = Flask(__name__)

@application.route("/")
def ping():
    return "OK", status.HTTP_200_OK