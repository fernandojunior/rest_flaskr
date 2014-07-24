from flask.ext.sqlalchemy import SQLAlchemy

db = SQLAlchemy()

"""
Modelos de Entidades da aplicacao
"""

class Entry(db.Model):
    
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(200))
    text = db.Column(db.String(200))

    def __init__(self, title, text, id=None):
        self.id = id
        self.title = title
        self.text = text
    
    def __repr__(self):
        return '<Entry %r>' % self.title
    
    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'text': self.text
        }