/**
* View container for entry
**/
var EntryViews = Views.extend({scope: "prototype"}, {

    index: View.extend({

        prototype: {

            success: function(response){
                $("#content").html(Views.get("entry").render_template("entries", response));
            },

            error: function(r){
                $("#content").html("erro");
            }
        }

    }),

    get: View.extend({scope: "prototype"}, {

        before: function(){

            if (typeof this.data === "undefined" || typeof this.data.id === "undefined") {
                Views.get("entry").render("index");
                return false; // don't call the repository method
            }

            return true; // call the repository method
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

    post: View.extend({scope: "prototype"}, {

        method: "post",

    }),

    get_edit_form: View.extend({scope: "prototype"}, {

        success: function(response){
            $("#content").html(Views.get("entry").render_template("edit_entry", response));
        }

    }),

    put: View.extend({scope: "prototype"}, {

        method: "put",

        success: function(response){
            console.log("Entry atualizado com sucesso. RESULT: " + response.result);
        }

    }),

    delete: View.extend({scope: "prototype"}, {
    
        method: "delete",

        success: function(response){
            console.log("Entry deletado com sucesso. RESULT: " + response.result);
        }

    })
});