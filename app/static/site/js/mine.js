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
 * Funcao que retorna um template .mustache
 * @param template_name Nome do template (obs. URI)
**/
function get_template(template_name) {
    
    var url = template_name, template = "";
    
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
}

/**
 * Renderiza um template com os dados (em json) fornecidos
 * @param template_name Nome do template
 * @param data Dados a serem renderizados no template
**/
function render_template(template_name, data) {
    var template = get_template(template_name);
    return Mustache.render(template, data);
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
 * Gerenciador de objetos (RESTFUL)
**/
BaseManager = Class.extend ({

    /**
     * Inicializa o objeto
     * @param api_root_path URL principal da API REST
    **/
    init: function(api_root_path) {
        this.root_path = api_root_path;
    },
    
    get: function(id) {

        var result;

        if (typeof(id) === "undefined" || id == null) {

            ajax({url: this.root_path, type: "get", async: false})
                .done(function(data) {
                    result = data;
                });

        } else {

            ajax({url: this.root_path + id, type: "get", async: false})
                .done(function(data) {
                    result = data;
                });

        }
        
        return result;

    },

    post: function(data) {
        
        var result;
        
        ajax({url: this.root_path, type: "post", data: data, async: false})
            .done(function(data){
                result = data;
            });
        
        return result;
    },

    put: function(id, data) {
        
        var result;
        
        ajax({url: this.root_path + id, type: "put", data: data, async: false})
            .done(function(data){
                result = data;
            });
        
        return result;
    },

    delete: function(id) {

        var result;

        ajax({url: this.root_path + id, type: "delete", async: false})
            .done(function(data){
                result = data;
            });

        return result;
    }
    
});