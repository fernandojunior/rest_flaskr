Repository.register("entry", RESTRepository.create({root_path: "http://127.0.0.1:5000/api/1.0/entries/", async: true}));

/**
* View container for entry
**/
Views.register("entry" , {

    repository: Repository.get("entry"),

    template_path: "http://127.0.0.1:5000/static/site/templates/",

    index: View.extend("prototype", {
        
        method: "get",

        success: function(response){
            $("#content").html(Views.get("entry").render_template("entries", response));
        },

        error: function(r){
            $("#content").html("erro");
        }

    }),

    get: View.extend("prototype", {

        method: "get",

        before: function(){

            if (typeof(this.data.id ) === "undefined"){
                Views.get("entry").render("index");
                return false;
            }

            return true;
        },

        success: function(response){

            $("#content").html(Views.get("entry").render_template("entry", response));

            $("button#edit_entry").click(function(){
                location.href = location.href+"/edit";                
            });

            $("button#delete_entry").click(function(){
                location.href = location.href+"/delete";
            });
        }

    }),

    post: View.extend("prototype", {

        method: "post",

    }),

    get_edit_form: View.extend("prototype", {

        method: "get",

        success: function(response){
            $("#content").html(Views.get("entry").render_template("edit_entry", response));
        }

    }),

    put: View.extend("prototype", {

        method: "put",

        success: function(response){
            console.log("Entry atualizado com sucesso. RESULT: " + response.result);
        }

    }),

    delete: View.extend("prototype", {
    
        method: "delete",

        success: function(response){
            console.log("Entry deletado com sucesso. RESULT: " + response.result);
        }

    })
})