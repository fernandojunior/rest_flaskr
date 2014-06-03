// funcoes de utilidade

/**
* Verifica se o tipo de um objeto eh indefinido
**/
function utype(obj){
    if(typeof(obj) === "undefined"){
            return true;
    }
        return false;
}

/**
 * Roda uma funcao com os argumentos passados
**/
function run(func, args){
    if (typeof(func) !== "undefined"){
        func(args);                    
    }
}

/**
 * Retorna o valor de um parametro da url
 * @param name Nome do parametro
 * @ref http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
**/
function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}
    
/**
 * Retorna todos os parametros da url em um dicionario
 * @ref http://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
**/
function getParameters() {

    var transformToAssocArray = function(prmstr) {
        var params = {};
        var prmarr = prmstr.split("&");
        for ( var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        return params;
    }

    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}
    
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
     * Renderiza um template com os dados (em json) fornecidos
     * @param template_name Nome do template
     * @param data Dados a serem renderizados no template
    **/
    render: function(template_name, data) {
        var template = this.get(template_name);
        return Mustache.render(template, data);
    }, 
}

/**
 * Auxilia a fazer requisicoes assincronas
 * @param uri Recurso da requisicao
 * @param method Metodo HTTP da requisicao
 * @param data Dados a serem anexados na requisicao (que seram transformados em json)
**/
function ajax(dict) {

    if (typeof(dict.type) === "undefined") {
        dict.type = "get";
    }

    if (typeof(dict.data) === "undefined") {
        dict.data = null;
    } else {
        dict.data = JSON.stringify(dict.data);
    }

    if (typeof(dict.async) === "undefined") { 
        dict.async = true;
    }

    var request = {
        url: dict.url,
        type: dict.type,
        async: dict.async,
        contentType: "application/json",
        accepts: "application/json",
        cache: false,
        dataType: 'json',
        data: dict.data,
        error: function (jqXHR) {
            console.log("ajax error " + jqXHR.status);
        }

    };

    return $.ajax(request);

}

/**
 * Gerenciador de objetos REST Assincrono
**/
AsyncBaseManager = Class.extend ({
    
    /**
     * Inicializa o objeto
     * @param api_url URL principal da API REST
     * @param async Se for true, as requisoes seram assincronas, caso for false seram sincronas. Default = true
    **/
    init: function(args) {        
        this.api_url = args.api_url;
        this.async = args.async;
        
        if (typeof(this.async) === "undefined")
            this.async = true;
        
    },
    
    get: function(args, callback) {
        var id = args.id;
        
        console.log("initializing get manager function. api_url " + this.api_url);

        var result;

        if (typeof(id) === "undefined" || id === null) {

            console.log("json api_url " + this.api_url);

            ajax({url: this.api_url, type: "get", async: this.async})
                .done(function(data) {
                    result = data;                    
                    run(callback, data);
                });

        } else {

            ajax({url: this.api_url + id, type: "get", async: this.async})
                .done(function(data) {
                    result = data;
                    run(callback, data);
                });

        }

        if(this.async === false)
            return result;

    },

    post: function(args, callback) {
        var data = args.data;

        var result;

        ajax({url: this.api_url, type: "post", data: data, async: this.async})
            .done(function(data){
                result = data;
                run(callback, data);                
            });

        if(this.async === false)
            return result;
    },

    put: function(args, callback) {        
        var id = args.id;
        var data = args.data;
        
        var result;
        
        ajax({url: this.api_url + id, type: "put", data: data, async: this.async})
            .done(function(data){
                result = data;
                run(callback, data);                
            });
        
        if(this.async === false)
            return result;
    },

    delete: function(args, callback) {    
        var id = args.id;

        var result;

        ajax({url: this.api_url + id, type: "delete", async: false})
            .done(function(data){
                result = data;
                run(callback, data);
            });   

        if(this.async === false)
            return result;
    },

    _factory: function(args){
        var factory = args.factory;
        var data = args.data;
        var callback = args.callback;
        
        if(factory == null || typeof(factory) === "undefined") {
            factory = "get"; // default factory
        }
        
        if(data === null || typeof(data) === "undefined") {
            data = {};        
        }
    
        this[factory](data, callback);

    }

});

var BaseView = Class.extend({
    api: null, // nome do metodo da api a ser invocada
    init: null, // construtor/inicializador da view
    data: null, // dados a serem passados a api
    before: null, // funcao que roda antes de invocar o metodo. Se retornar true, metodo eh invocado.
    callback: null, // callback a ser invocado com a resposta da api como argumento    
    after: null // funcao que eh invocada logo apos o metodo
}); 

var view = {
 
    run: function (view_class, args, manager) {
        view = new view_class(args); // instanciando view

        var before_result = true;
        if (view.before !== null && typeof(view.before) !== "undefined"){
            console.log("running before function");
            before_result = view.before();
            console.log("before result " + before_result );
        }

        console.log("view data: " + JSON.stringify(view.data));

        if(before_result === true){        
            manager._factory({
                factory: view.api,
                data: view.data,
                callback: view.callback
            });

            if (view.after !== null && typeof(view.after) !== "undefined"){
                view.after();
            }
        }

    },
    
    run_from: function(views, view_name, args) {
    
        if (args === null || typeof(args) === "undefined"){
            args = {};
        }
        
        console.log("gettinng view: " + view_name);
        console.log("view args: " + JSON.stringify(args));
        
        obj_view = new views[view_name](args); // instanciando view

        var before_result = true;
        if (obj_view.before !== null && typeof(obj_view.before) !== "undefined"){
            console.log("running before function");
            before_result = obj_view.before();
            console.log("before result " + before_result );
        }

        console.log("view data: " + JSON.stringify(obj_view.data));

        if(before_result === true){        
            views.manager._factory({
                factory: obj_view.api,
                data: obj_view.data,
                callback: obj_view.callback
            });

            if (obj_view.after !== null && typeof(obj_view.after) !== "undefined"){
                obj_view.after();
            }
        }

    }

}