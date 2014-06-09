/**
* Repositorio de objetos do Parse.org 
* https://parse.com/docs/js_guide
**/
var ParseRepository = BaseRepository.extend({

   prototype: {
       
       /**
       * Repository initializer
       * @param args.class_name Parse class name or
       * @param args.class Parse class. If setted then class_name not needed
       **/
       initialize: function (args){
           this._class_name = args.class_name;
           this._class = args.class;
           
           if (typeof this._class_name !== "undefined"){
               this._class = Parse.Object.extend(this._class_name);
           }
           
       },
       
       /**
       * Parse query object for the class
       **/
       _query: function(){
           return new Parse.Query(this._class);
       },
       
       /**
       * Create a parse object
       **/
       _create: function(){
           return new this._class();
       },
       
       /**
       * Retrieve all objects
       **/
       getAll: function(callback, error_callback){
           
           return this.find(null, callback, error_callback);
           
       },
        
       /**
       * Retrieve only a object
       * @param args.id The object ID
       **/
       get: function(args, callback, error_callback){

           var id = args.id;
           this.first({objectId : id}, callback, error_callback);
           return;

       },
       
       /**
       * Update a parse object
       * @param args.id The object ID
       * @param args.data The new data of object
       **/
       put: function(args, callback, error_callback){
           var id = args.id;
           var data = args.data;

           function get_callback(response){
               response.save(data,  ParseRepository._handler("Updating a parse object.", callback, error_callback));                
           };

           this.get({id : args.id}, get_callback, error_callback);

           return;

       },

       /**
       * Create a parse object
       * @param data The data of the new object
       **/
       post: function(args, callback, error_callback) {
           var data = args;           
           var obj = this._create();           
           obj.save(data, ParseRepository._handler("Creating a parse object in cloud.", callback, error_callback));           
           return;
       },
       
       /**
       * Delete a parse object
       * @param args.id The ID of the object that will be deleted
       **/
       delete: function(args, callback, error_callback){

           function get_callback(response){       
               response.destroy(ParseRepository._handler("Deleting a parse object.", callback, error_callback));
           };

           this.get({id: args.id}, get_callback, error_callback);           
           
           return;
       },

        /**
        * Find objects
        * @param args The key : value sings
        **/        
       find: function(args, callback, error_callback){
           
           var query = this._query();

           for(var key in args){
               query.equalTo(key, args[key]);
           }
           
           query.find(ParseRepository._handler("Finding objects.", callback, error_callback));

           return;

       },
       
        /**
        * Find first object
        * @param args The key : value sings
        **/        
       first: function(args, callback, error_callback){
           
           var query = this._query();

           for(var key in args){
               query.equalTo(key, args[key]);
           }

           query.first(ParseRepository._handler("Retrieving first object", callback, error_callback));

           return;

       },
           
    },

    /**
    * Upload a file to parse
    * @param args.name filename
    * @param args.ext file extension
    * @param args.content_type The file content type
    * @param args.file_upload_control $("#id")[0] or document.getElementById("id")
    **/
    uploadFile: function(args, callback, error_callback){
 
        var name = args.name;
        var ext = args.ext;
        var content_type = args.content_type;
        var file_upload_control = args.file_upload_control;

        if (file_upload_control.files.length > 0) {

            var file = file_upload_control.files[0];
            var parseFile = new Parse.File(name + ext, file, content_type);
            
            parseFile.save().then(
                function(response){
                    console.log("The file was uploaded");
                    console.log(response.url());
                    if (callback !== null && typeof callback !== "undefined"){
                        callback();
                    }
                },
                function(error){
                    console.log("Error: The file was not uploaded");
                    if (error_callback !== null && typeof error_callback !== "undefined"){
                        error_callback(error);
                    }
                }
            );
        }

        return;

   },
       
   /**
   * Callback and error callback handler
   **/
   _handler : function (log, callback, error_callback){
       var calls = {
           success: function(response){

               console.log("Sucess: "+ log);

               if (callback !== null && typeof callback !== "undefined"){
                   callback(response);
               }

           },
           error: function (error){

               console.log("Error: "+ log);

               if (error_callback !== null && typeof error_callback !== "undefined"){
                   error_callback(error);
               }
           }
       }

       return calls;
   },
       
   /**
   * Repository dictionary for global use
   **/
   g: {},

   register: function(name){
       ParseRepository.g.name = this.create();
   }

});

var UserParseRepository = ParseRepository.extend({

    prototype: {

        initialize: function (args){
            this._class = Parse.User;
        },

        /**
        * Create a new user. Before it does this, it also checks to make sure that both the username and email are unique
        * @param username Username
        * @param args.password Encrypeted password
        * @param args.email User email
        * @param args... Any data do you want to save
        **/
        signup : function(args, callback, error_callback) {            
            var data = args;

            var user = this._create();

            user.signUp(data, {
                sucess: function(response){

                    console.log("The user was created");

                    if (callback !== null && typeof callback !== "undefined"){
                        callback(response);
                    }

                },

                error: function(user, error){
                    console.log("Error: The user was not created");

                    if (error_callback !== null && typeof error_callback !== "undefined"){
                        error_callback({user: user, error: error});
                    }

                }

            });

            return;

        },

        /**
        * Redirect to signup method
        **/
        post : function(args, callback, error_callback){
            return this.signUp(args, callback, error_callback);
        },

        /**
        * Log the user in the app
        * @param args.username Username
        * @param args.password Encrypted password
        **/
        login : function(args, callback, error_callback){

            this._class.logIn(args.username, args.password, {
                success: function(response){

                    console.log("The user was logged in.");

                    if (callback !== null && typeof callback !== "undefined"){
                        callback(response);
                    }

                },

                error: function(user, error){
                    console.log("Error. The user was not logged in.");

                    if (error_callback !== null && typeof error_callback !== "undefined"){
                        error_callback(error);
                    }

                }

            })

            return;

        },

        /**
        * Log out the current user
        **/
        logout: function (){            
            this._class.logOut();            
        },
        
        /**
        * Get the current user that is logged in the session (localStorage).
        **/
        current: function(callback, error_callback){
            var current_user = this._class.current();

            if (current_user) {

                console.log("getting current user");

                if (callback !== null && typeof callback !== "undefined"){
                    callback(current_user);
                }

            } else {

                console.log("User is not logged in.");

                if (error_callback !== null && typeof error_callback !== "undefined"){
                    error_callback();
                }
            }

        },

        /**
        * Request a password reset to parse.org
        * @param args.email The user email needed to reset the password
        **/
        reset_password : function(args, callback, error_callback){

            this._class.requestPasswordReset(args.email, {

                success: function(response) {

                    console.log("Password reset request was sent successfully");

                    if (callback !== null && typeof callback !== "undefined"){
                        callback(response);
                    }

                },
                error: function(error) {

                    console.log("Error: Password reset request was sent not successfully");

                    if (error_callback !== null && typeof error_callback !== "undefined"){
                        error_callback(error);
                    }

                }

            });


        },
        
        /**
        * Login or sign up a user using a facebook account
        * @param args.permisions Facebook permissions
        **/
        facebook_login: function(args, callback, error_callback){
            
            var permissions = args.permissions;
            
            if ( typeof scope === "undefined"){
                scope = "user_likes,email";
            }
        
            Parse.FacebookUtils.logIn(permissions, {
                success: function(user) {
                    
                    if (!user.existed()) {
                        console.log("User signed up and logged in through Facebook!");
                    } else {
                        console.log("User logged in through Facebook!");
                    }

                    this.facebook_link({user: user, permissions: permissions});

                    if (callback !== null && typeof callback !== "undefined"){
                        callback(user);
                    }

                },
                error: function(user, error) {
                    console.log("User cancelled the Facebook login or did not fully authorize.");
                    
                    if (error_callback !== null && typeof error_callback !== "undefined"){
                        error_callback(error);
                    }

                }
            });
        
        },
        
        /**
        * Associate an existing Parse.User to a Facebook account
        **/
        facebook_link: function(args){
            
            var user = args.user;
            var permissions = args.permissions;
        
            if (!Parse.FacebookUtils.isLinked(user)) {
                Parse.FacebookUtils.link(user, permissions, {
                    success: function(user) {
                        console.log("User was linked with facebook!");
                    },
                    error: function(user, error) {
                        console.log("User cancelled the Facebook login or did not fully authorize.");
                    }
                });
            }
        },

        /**
        * Unassociate an existing Parse.User to a Facebook account
        **/
        facebook_unlink: function(args, callback, error_callback){

            function get_callback(response){
                Parse.FacebookUtils.unlink(
                    response,
                    ParseRepository._handler("Unlinking parser user from facebook.", callback, error_callback)
                );

                return;

            }

            this.get({id: args.id}, get_callback, error_callback);

        }

    }

});

//UserParseRepository.register(ParseRepository);
ParseRepository.g.user = UserParseRepository.create();