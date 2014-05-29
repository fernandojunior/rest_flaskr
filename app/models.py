from db import BaseEntity

"""
Modelos de Entidades da aplicacao
"""

class Entry(BaseEntity):

    def __init__(self, title, text, id=None):
        self.id = id
        self.title = title
        self.text = text
		
    @classmethod
    def schema(cls):
        return """
            drop table if exists entry;

            create table entry (
                id integer primary key autoincrement,
                title text not null,
                text text not null
            );
        """