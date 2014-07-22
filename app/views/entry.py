from flask import g, request, jsonify, abort # http://flask.pocoo.org/
from flask.ext.classy import FlaskView # http://pythonhosted.org/Flask-Classy/
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
	
    @property
    def _objects(self):
        return g.objects(Entry)

    def index(self):
        data = self._objects.all()
        result = [d.__dict__ for d in data]
        return jsonify(entries=result)

    def get(self, id):
        if not self._objects.has(id):
            abort(404)

        result = self._objects.get(id).__dict__
        return jsonify(entry=result)
	
    def post(self):
	
        if not request.json:
            abort(400)

        if not 'title' in request.json:
            abort(400)

        if not 'text' in request.json:
            abort(400)

        e = Entry(request.json['title'], request.json['text'])
        id = self._objects.save(e)

        self._objects.commit()

        return jsonify(result=id)

    def put(self, id):
        
        if not self._objects.has(id):
            abort(404)

        e = self._objects.get(id)

        if 'title' in request.json:
            e.title = request.json['title']
			
        if 'text' in request.json:
            e.text = request.json['text']
			
        #for key, value in request.json:
        #    setattr(e, key, value)

        self._objects.update(e)
        self._objects.commit()

        return jsonify(result='True'), 200
		
    def delete(self, id):
        
        if not self._objects.has(id):
            abort(404)

        self._objects.delete(id)
        self._objects.commit()

        return jsonify(result='True'), 200