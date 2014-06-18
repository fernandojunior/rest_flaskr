/**
* View container for entry
**/
var EntryViews = BaseViewContainer.extend({

    repository: RESTRepository.create({root_path: "http://127.0.0.1:5000/api/1.0/entries/", async: true}),
    
    index: BaseView.extend({
        
        prototype: {
            method: "get",
            
            success: function(response){            
                $("#content").html(Util.template.render_from("http://127.0.0.1:5000/static/site/templates/entries.mustache", response));
            },
            
            error: function(r){
                $("#content").html("erro");
            }
        }

    }),

    get: BaseView.extend({

        prototype: {
        
            method: "get",

            before: function(){

                if (typeof(this.data.id ) === "undefined"){
                    EntryViews.render("index");
                    return false;
                }

                return true;
            },

            success: function(response){

                $("#content").html(Util.template.render_from("http://127.0.0.1:5000/static/site/templates/entry.mustache", response));

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
            method: "post",
        }
        
    }),
    
    get_edit_form: BaseView.extend({
        prototype: {
            method: "get",

            success: function(response){
                $("#content").html(Util.template.render_from("http://127.0.0.1:5000/static/site/templates/edit_entry.mustache", response));
            }    
        }
    }),
    
    put: BaseView.extend({
        prototype: {
            method: "put",

            success: function(response){
                console.log("Entry atualizado com sucesso. RESULT: " + response.result);
            }
        }
    }),

    delete: BaseView.extend({
        prototype: {
            method: "delete",

            success: function(response){
                console.log("Entry deletado com sucesso. RESULT: " + response.result);
            }
        }
    })
})