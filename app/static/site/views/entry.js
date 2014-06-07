// view container for entry
var EntryViews = BaseViewContainer.extend({
    
    repository: RESTRepository.create({root_path: "http://127.0.0.1:5000/api/1.0/entries/", async: true}),
    
    index: BaseView.extend({
        
        prototype: {
            api: "get",
            
            callback: function(response){            
                $("#content").html(template.render_from("http://127.0.0.1:5000/static/site/templates/entries.mustache", response));
            }
        }

    }),

    get: BaseView.extend({

        prototype: {
        
            api: "get",

            initialize: function(args) {
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
        }

    }),

    post: BaseView.extend({
        prototype: {
            api: "post",

            initialize: function(args){
                this.data = {data: args.data};
            }
        }
        
    }),
    
    get_edit_form: BaseView.extend({
        prototype: {
            api: "get",

            initialize: function(args){
                this.data = {id: args.id};
            },

            callback: function(response){
                $("#content").html(template.render_from("http://127.0.0.1:5000/static/site/templates/edit_entry.mustache", response));
            }    
        }
    }),
    
    put: BaseView.extend({
        prototype: {
            api: "put",

            initialize: function(args){
                this.data = {id: args.id, data: args.data};
            },

            callback: function(response){
                console.log("Entry atualizado com sucesso. RESULT: " + response.result);
            }
        }
    }),

    delete: BaseView.extend({
        prototype: {
            api: "delete",

            initialize: function(args){
                this.data = {id: args.id};
            },

            callback: function(response){
                console.log("Entry deletado com sucesso. RESULT: " + response.result);
            }
        }
    })
})