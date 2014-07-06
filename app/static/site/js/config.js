var TEMPLATE_PATH = "http://127.0.0.1:5000/static/site/templates/";

/**
* Registro de repositories
**/
Repository.register("entry", RESTRepository.create({root_path: "http://127.0.0.1:5000/api/1.0/entries/", async: true}));

/**
* Registro de views
**/
Views.register("entry" , EntryViews.create({repository: Repository.get("entry"), template_path: TEMPLATE_PATH}));