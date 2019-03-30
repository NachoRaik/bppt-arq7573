FROM python:3.6

WORKDIR /app

ADD requirements.txt /app

RUN pip install --trusted-host pypi.python.org -r requirements.txt

ADD . /app

CMD gunicorn -b 0.0.0.0:8000 app
