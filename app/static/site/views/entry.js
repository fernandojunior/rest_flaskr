
// container
var EntryViews = {
    
    manager: new BaseManager({root_path: "http://127.0.0.1:5000/api/1.0/entries/", async: true}),
    
    /**
     * Renderiza uma view do container de views
     * @param view_name Nome da view a ser renderizada
     * @param args Argumentos que seram passadas ao construtor da view para ser inicializada
    **/
    render: function(view_name, args){

        container = this;
        
        if (args === null || typeof(args) === "undefined"){
            args = {};
        }
        
        var manager = container.manager;
        var view_class = container[view_name];        
        
        obj = new view_class(args); // instanciando objeto do tipo BaseView        
        obj.manager = manager;
        obj.render();
        
    },

    index: BaseView.extend({

        api: "get",

        callback: function(response){            
            $("#content").html(template.render_from("http://127.0.0.1:5000/static/site/templates/entries.mustache", response));
        }
    }),

    get: BaseView.extend({
        api: "get",

        init: function(args) {
            this.data = {id: args.id};
        },

        before: function(){

            if (typeof(this.data.id ) === "undefined"){
                EntryViews.render("index");
                return false;
            }

            return true;
        },

        callback: function(response){

            $("#content").html(template.render_from("http://127.0.0.1:5000/static/site/templates/entry.mustache", response));

            $("button#edit_entry").click(function(){
                location.href = location.href+"/edit";                
            });

            $("button#delete_entry").click(function(){
                location.href = location.href+"/delete";
            });
        }

    }),

    post: BaseView.extend({        
        api: "post",
        
        init: function(args){
            this.data = {data: args.data};
        }
        
    }),
    
    get_edit_form: BaseView.extend({
        api: "get",
        
        init: function(args){
            this.data = {id: args.id};
        },
        
        callback: function(response){
            $("#content").html(template.render_from("http://127.0.0.1:5000/static/site/templates/edit_entry.mustache", response));
        }    
    }),
    
    put: BaseView.extend({
        api: "put",
        
        init: function(args){
            this.data = {id: args.id, data: args.data};
        },
        
        callback: function(response){
            console.log("Entry atualizado com sucesso. RESULT: " + response.result);
        }
    }),

    delete: BaseView.extend({
        api: "delete",
    
        init: function(args){
            this.data = {id: args.id};
        },

        callback: function(response){
            console.log("Entry deletado com sucesso. RESULT: " + response.result);
        }

    })
}