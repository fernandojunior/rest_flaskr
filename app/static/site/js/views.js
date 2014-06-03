
var EntryViews = {
    
    manager: new AsyncBaseManager({api_url: "http://127.0.0.1:5000/api/1.0/entries/", async: true}),

    index: BaseView.extend({

        api: "get",

        callback: function(response){
            $("#content").html(template.render("http://127.0.0.1:5000/static/site/templates/entries.mustache", response));

            $("form#add_entry").submit(function(e){
                e.preventDefault();
                view.render_from(EntryViews, "post", {data: form_to_dict(e.target)});
                return true;
            });
        }
    }),

    get: BaseView.extend({
        api: "get",

        init: function(args) {
            this.data = {id: args.id};
        },

        before: function(){

            if (typeof(this.data.id ) === "undefined"){
                view.render_from(EntryViews, "index"); // redirect?
                return false;
            }

            return true;
        },

        callback: function(response){

            $("#content").html(template.render("http://127.0.0.1:5000/static/site/templates/entry.mustache", response));

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
            $("#content").html(template.render("http://127.0.0.1:5000/static/site/templates/edit_entry.mustache", response));
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