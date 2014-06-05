/**
 * Serializa os dados de um formulario em um dicionario
 * @param form O formulario a ser serializado (como elemento jQuery)
**/
function form_to_dict(form) {

    var array = jQuery(form).serializeArray(), dict = {};

    jQuery.each(array, function () {
        dict[this.name] = this.value || '';
    });

    return dict;
}

// funcoes de template
var template = {
    /**
     * Funcao que retorna um template .mustache
     * @param url Nome do template (obs. URI)
    **/
    get: function(url) {

        var url = url, template = "";

        $.ajax({
            url: url,
            type: 'GET',
            async: false,
            success: function (data) {
                template = data;
            }
        });

        Mustache.parse(template);

        return template;
    },
    
    /**
     * Renderiza um template com os dados fornecidos
     * @param template Conteudo do template
     * @param data Dados a serem renderizados no template
    **/
    render: function(template, data) {
        return Mustache.render(template, data);
    }, 
    
    /**
     * Renderiza um template com os dados (em json) fornecidos
     * @param template_name Nome do template
     * @param data Dados a serem renderizados no template
    **/
    render_from: function(template_name, data) {
        var template = this.get(template_name);
        return Mustache.render(template, data);
    },   

}

/**
 * Gerenciador de API RESTFUL basico assincrono.
**/
BaseManager = Class.extend ({

    /**
     * Inicializa o gerenciador
     * @param root_path URL principal da API
     * @param async (default === true) Se for true, as chamadas a api (requisoes) serao assincronas, caso for false serao sincronas.
    **/
    init: function(args) {        
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
    * Chama uma url da API
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

        if (typeof(url) === "undefined"){
            url = "";
        } else if (url.charAt(0) === "/"){
            url = url.substring(1, url.length);
        }
        
        url = this.root_path + url;
        
        if (typeof(type) === "undefined") {
            type = "get";
        }

        if (typeof(data) === "undefined") {
            data = null;
        } else {
            data = JSON.stringify(data);
        }

        var request = {
            url: url,
            type: type,
            async: this.async,
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
                
            if (typeof(callback) !== "undefined"){
                callback(reponse);
            }

        }); 
        
        // observacao: resultado so existira se a assincronizacao estiver desativada, ou seja, this.async === false
        return r;

    },

    /**
    * Factory Method Partner para o objeto gerenciador
    **/
    _factory: function(args){
        var method = args.method;
        var data = args.data;
        var callback = args.callback;
        
        if(method == null || typeof(method) === "undefined") {
            method = "get"; // default method
        }
        
        if(data === null || typeof(data) === "undefined") {
            data = {};
        }
    
        this[method](data, callback);

    }

});

/**
 * Classe abstrata que define contratos para criar uma view
**/
var BaseView = Class.extend({
    
    /**
    * Construtor/inicializador
    **/
    init: null,
    
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
    after: null 
});

// funcoes de utilidade para views
var view = {
 
    /**
    * Renderiza uma view
    * @param view_class A classe (que extende de BaseView) da view
    * @param args Argumentos que seram passadas ao construtor da view para ser inicializada
    * @param manager API manager de onde a view ira requisitar/chamar por dados necessarios para sua renderizacao
    **/
    render: function (view_class, args, manager) {
        obj = new view_class(args); // instanciando objeto do tipo BaseView

        var before_result = true;
        
        // funcao que eh executada antes do metodo da api ser executado
        if (obj.before !== null && typeof(obj.before) !== "undefined"){
            before_result = obj.before();
        }

        // se for true, metodo da api eh executado
        if(before_result === true){
            manager._factory({
                method: obj.api,
                data: obj.data,
                callback: obj.callback
            });

            // funcao que eh executada apos o metodo da api
            if (obj.after !== null && typeof(obj.after) !== "undefined"){
                obj.after();
            }
        }

    },
    
    /**
     * Renderiza a view de um container de views
     * @param views O container
     * @param view_name Nome da view a ser renderizada
     * @param args Argumentos que seram passadas ao construtor da view para ser inicializada
    **/
    render_from: function(views, view_name, args) {
    
        if (args === null || typeof(args) === "undefined"){
            args = {};
        }

        var manager = views.manager;
        var view_class = views[view_name];        
        
        view.render(view_class, args, manager);
        
    }

}