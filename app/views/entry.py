from flask import g, request, jsonify, abort # http://flask.pocoo.org/
from flask.ext.classy import FlaskView # http://pythonhosted.org/Flask-Classy/
from app import db
from app.models import Entry

"""
    Modulo que contem views utilizando a extensao Flask-Classy (FlaskView)

    Metodo HTTP - Metodo View - Acao - Exemplo
    GET - index - Obtem informacoes sobre os recursos - http://<servername>/api/1.0/entries
    GET - get - Obtem informacoes sobre um recurso - http://<servername>/api/1.0/entries/3
    POST - post - Cria um novo recurso - http://<servername>/api/1.0/entries (cria uma nova entry, a partir dos dados fornecidos com a requisicao)
    PUT - put - Atualiza um recurso - http://<servername>/api/1.0/entries/123 (atualiza a entry #123, a partir dos dados fornecidos com a requisicao)
    DELETE - delete - Deleta um recurso - http://<servername>/api/1.0/entries/123 (deleta entry #123)
"""

class EntryView(FlaskView):
    """
    Classe que define restful views para a entidade Entry
    """
    
    route_base = '/entries/'

    route_prefix = '/api/1.0/'
	
    def index(self):        
        result = [i.serialize for i in Entry.query.all()]
        return jsonify(entries=result)
    
    def get(self, id):

        entry = Entry.query.get(id)

        if not entry:
            abort(404)           

        return jsonify(entry=entry.serialize)
	
    def post(self):
	
        if not request.json:
            abort(400)

        if not 'title' in request.json:
            abort(400)

        if not 'text' in request.json:
            abort(400)

        entry = Entry(request.json['title'], request.json['text'])
        db.session.add(e)
        db.session.commit()

        return jsonify(result=entry.id)

    def put(self, id):
        
        entry = Entry.query.get(id)
        
        if not entry:
            abort(404)

        if 'title' in request.json:
            entry.title = request.json['title']

        if 'text' in request.json:
            entry.text = request.json['text']
			
        #for key, value in request.json:
        #    setattr(e, key, value)

        db.session.commit()

        return jsonify(result='True'), 200
		
    def delete(self, id):
        
        entry = Entry.query.get(id)
        
        if not entry:
            abort(404)
            
        db.session.delete(entry)
        db.session.commit()

        return jsonify(result='True'), 200