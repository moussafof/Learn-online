import os

DEBUG=1

APP_NAME = "E-Learning"

basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir,"learn.sqlite")

SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY = "HereIsMySecretKey"

