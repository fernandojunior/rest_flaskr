from flask import g, jsonify, make_response # http://flask.pocoo.org/
from app import app

@app.route('/')
def index():
    return 'Welcome'

@app.teardown_appcontext
def close_db(error):
    if g.db.connected: g.db.close()

@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify( { 'error': 'Not found' } ), 404)

from app.views.classy import EntriesView
EntriesView.register(app)