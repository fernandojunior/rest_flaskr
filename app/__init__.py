from flask import Flask, g # http://flask.pocoo.org/
from app.models import db

"""
@refereces: http://stackoverflow.com/questions/9692962/flask-sqlalchemy-import-context-issue/9695045#9695045
"""

# instanciando nova aplicacao Flask
app = Flask(__name__)

# carregando configuracoes do arquivo config.py
app.config.from_object('config')

# iniciando db
db.init_app(app)

def run():
    """
	Funcao que inicializa e roda a aplicacao
    """

    # rodando a aplicacao
    #app.run(port=80)
    app.run()

from app import views