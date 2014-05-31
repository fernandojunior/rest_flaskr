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
