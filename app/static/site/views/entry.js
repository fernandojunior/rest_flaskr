
var EntryViews = {
    
    manager: new BaseManager({root_path: "http://127.0.0.1:5000/api/1.0/entries/", async: true}),
    
    render: function(view_name, args){
        view.render_from(this, view_name, args);
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