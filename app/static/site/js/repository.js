/**
 * Repositorio (partner) de API RESTFUL
**/
RESTRepository = PrototypeClass.extend ({
    
    prototype: {

        /**
         * Inicializa o repositorio
         * @param root_path URL principal da API
         * @param async (default === true) Se for true, as chamadas a API (requisoes) serao assincronas, caso for false serao sincronas.
        **/
        initialize: function(args) {        
            this.root_path = args.root_path;
            this.async = args.async;

            if (typeof(this.async) === "undefined"){
                this.async = true;
            }

            if(this.root_path.charAt(this.root_path.length -1) !== "/"){
                this.root_path += "/";
            }

        },

        get: function(args, callback) {
            var id = args.id;

            if (typeof(id) === "undefined") {
                return this.call({url: "/"}, callback);
            } else {
                return this.call({url: "/" + id}, callback);
            }

        },

        post: function(args, callback) {
            var data = args.data;

            return this.call({url: "/", type: "post", data: data}, callback);
        },

        put: function(args, callback) {        
            var id = args.id;
            var data = args.data;

            return this.call({url: "/" + id, type: "put", data: data}, callback);
        },

        delete: function(args, callback) {    
            var id = args.id;

            return this.call({url: "/" + id, type: "delete"}, callback);
        },

        /**
        * Chama (requisita) uma url da API
        * @param args.url (default === "") A url da api a ser chamada
        * @param args.type (default === get) Tipo (http method) da chamada: get, post, put, delete
        * @param args.data (opcional) Dicionario de dados a ser enviado pela chamada
        * @param callback (opcional) Funcao de callback a ser executada com a resposta da api
        * @return (if this.async === false) Retorna o resultado da chamada a api
        **/
        call: function(args, callback){
            var url = args.url;
            var type = args.type;
            var data = args.data;
            var async = args.async;

            if (typeof(url) === "undefined"){
                url = "";
            } else if (url.charAt(0) === "/"){
                url = url.substring(1, url.length);
            }

            if (typeof(type) === "undefined") {
                type = "get";
            }

            if (typeof(data) === "undefined") {
                data = null;
            } else {
                data = JSON.stringify(data);
            }
    
            if (async === "undefined"){
                async = this.async;
            }

            url = this.root_path + url;

            var request = {
                url: url,
                type: type,
                async: async,
                contentType: "application/json",
                accepts: "application/json",
                cache: false,
                dataType: 'json',
                data: data,
                error: function (jqXHR) {
                    console.log("ajax error " + jqXHR.status);
                }

            };

            var r;

            $.ajax(request).done(function(reponse){
                r = reponse;

                if (callback !== null && typeof(callback) !== "undefined"){
                    callback(reponse);
                }

            }); 

            // observacao: resultado so existira se a assincronizacao estiver desativada, ou seja, this.async === false
            return r;

        },

        /**
        * Factory Method (partner) para o objeto
        **/
        _factory: function(args){
            var method = args.method;
            var method_args = args.data;
            var callback = args.callback;
            
            if(method == null || typeof(method) === "undefined") {
                method = "get"; // default method
            }

            if(method_args === null || typeof(method_args) === "undefined") {
                method_args = {};
            }

            this[method](method_args, callback);

        }
    }

});

/**
 * Classe abstrata que define contratos para criar uma view
**/
var BaseView = PrototypeClass.extend({
    
    prototype: {
        
        /**
        * Nome do metodo da api a ser executado
        **/
        api: null,

        /**
        * Caso seja necessario, pode ser definido um dicionario em 'data' a ser passado como argumento ao metodo da api.
        **/
        data: null,

        /**
        * (opcional) Funcao que eh executada antes do metodo da api ser executado.
        * @return Se retornar true, metodo da api eh executado.
        **/
        before: null,

        /**
        * (opcional) Funcao callback do metodo da api
        * @param response Contem a resposta da execucao do metodo da api
        **/
        callback: null,

        /**
        * (opcional) Funcao que eh executada apos o metodo da api
        **/
        after: null,

        /**
        * Repository de onde a view ira requisitar/chamar por dados necessarios para sua renderizacao
        **/
        repository: null,

        /**
        * Renderiza a view
        **/
        render: function(){
            obj = this; // instancia do tipo BaseView

            var before_result = true;

            // funcao que eh executada antes do metodo da api ser executado
            if (obj.before !== null && typeof(obj.before) !== "undefined"){
                before_result = obj.before();
            }
            
            // se for true, metodo da api eh executado
            if(before_result === true){
                obj.repository._factory({
                    method: obj.api,
                    data: obj.data,
                    callback: obj.callback
                });

                // funcao que eh executada apos o metodo da api
                if (obj.after !== null && typeof(obj.after) !== "undefined"){
                    obj.after();
                }
            }
        }
    }
});

/**
* Container basico para armazenar views 
**/
var BaseViewContainer = PrototypeClass.extend({
    
    /**
    * Repository do container
    **/
    repository: null,
    
    /**
     * Renderiza uma view do container de views
     * @param view_name Nome da view a ser renderizada
     * @param args Argumentos que seram passadas ao construtor da view para ser inicializada
    **/
    render: function(view_name, args){

        if (args === null || typeof(args) === "undefined"){
            args = {};
        }

        var container = this;        
        var repository = container.repository;
        var view_class = container[view_name];

        obj = view_class.create(args); // instanciando objeto do tipo BaseView
        obj.repository = repository;
        obj.render();

    },
    
});