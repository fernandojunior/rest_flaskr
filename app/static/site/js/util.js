var Util = {};
/**
 * Serializa os dados de um formulario em um dicionario
 * @param form O formulario a ser serializado (como elemento jQuery)
**/
Util.form_to_dict = function (form) {

    var array = jQuery(form).serializeArray(), dict = {};

    jQuery.each(array, function () {
        dict[this.name] = this.value || '';
    });

    return dict;
}

// funcoes de template
Util.template = {
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
     * @param template_url Url do template
     * @param data Dados a serem renderizados no template
    **/
    render_from: function(template_url, data) {
        var template = this.get(template_url);
        return Mustache.render(template, data);
    },   

}