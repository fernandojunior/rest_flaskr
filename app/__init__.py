from flask import Flask, g # http://flask.pocoo.org/
from flask.ext.sqlalchemy import SQLAlchemy
from db import DatabaseConnection

# instanciando nova aplicacao Flask
app = Flask(__name__)

# carregando configuracoes do arquivo config.py
app.config.from_object('config')

class ManagerCollection(object):
    """
    Armazena instancias de entity managers
    """

    def __init__(self, db):
        # database connection
        self.db = db

        # inicializando dicionario que armazenara entity managers
        self.objects = {}

    def get(self, entity):
        """
        Retorna o manager de uma determinada entidade. Caso nao exista, sera criado um para a entidade referenciada
        """
        alias = entity.__name__.lower()
        if alias not in self.objects:
            self.objects[alias] = entity.objects(self.db)
        return self.objects[alias]

def run():
    """
	Funcao que inicializa e roda a aplicacao
    """

    with app.app_context():
        # inicializando banco de dados
        g.db = DatabaseConnection(app.config['DATABASE_NAME'])
        
        # permitindo que o metodo get seja acessada diretamente pela variavel 'g'
        g.objects = ManagerCollection(g.db).get
        
        # rodando a aplicacao
        #app.run(port=80)
        app.run()

from app import views, models