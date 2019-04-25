from flask import Flask
from flask_api import status
from time import sleep
import random

application = Flask(__name__)
num = random.random()

@application.route("/")
def ping():
    return "OK Python " + str(num), status.HTTP_200_OK


@application.route("/timeout")
def timeout():
    sleep(0.1)
    return "OK Python Timeout", status.HTTP_200_OK


@application.route("/intensive")
def intensive():
    for i in range(1000):
        number = 100*100
        for j in range(1000):
            number = 100*100
    return "OK Python intensive", status.HTTP_200_OK
