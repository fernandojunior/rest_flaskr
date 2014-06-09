from flask import Flask, g # http://flask.pocoo.org/
from flask.ext.sqlalchemy import SQLAlchemy
from db import DatabaseConnection

# instanciando nova aplicacao Flask
app = Flask(__name__)

# carregando configuracoes do arquivo config.py
app.config.from_object('config')

def objects(entity):
    """
	Factory method para recuperar os gerenciadores de [modelos] entidades que estao armazenados na variavel global do Flask 'g'
    """
    alias = entity.__name__.lower()
    if alias not in g.__objects:
        g.__objects[alias] = entity.objects(g.db)
    return g.__objects[alias]

def run():
    """
	Funcao que inicializa e roda a aplicacao
    """

    with app.app_context():
        # inicializando banco de dados
        g.db = DatabaseConnection(app.config['DATABASE_NAME'])
        # inicializando dicionario que armazenara gerenciadores de modelos de entidades
        g.__objects = {}
        # permitindo que a funcao objects seja acessada por meio da variavel 'g'
        g.objects = objects
        # rodando a aplicacao
        app.run(port=80)
        #app.run()

from app import views, models