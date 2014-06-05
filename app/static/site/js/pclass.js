    // With doc: https://gist.github.com/fernandojunior/d22df231c8dc5548a1c2
    // Full examples: https://gist.github.com/fernandojunior/25735d66f9f969359c3e
    // Author: http://fjacademic.wordpress.com
    var PrototypeClass = {
        
        prototype : {
            initialize: function (){
            },
        
            instanceof: function(cls){       
                return cls.prototype.isPrototypeOf(this);
            }
        },
        
        create : function(){
            var instance = Object.create(this.prototype);
            instance.initialize.apply(instance, arguments);
            return instance;
        },
        
        extend: function(propertyDescriptors){
            
            propertyDescriptors.prototype = {
                value : Object.create(this.prototype, propertyDescriptors.prototype),
            }
            
            return Object.create(this, propertyDescriptors);
            
        },
        
        invoke_member: function(obj, memberName, args){
            var member = this.prototype[memberName];
            return member.apply(obj, args);
        },
        
        invoke_class_member: function(memberName, args){
            var member = this[memberName];
            return member.apply(args);
        },
        
        super: function(obj, memberName, args){
            var super_class = Object.getPrototypeOf(this);
            return super_class.invoke_member(obj, memberName, args);
        },
        
        super_class_member: function(memberName, args){
            var super_class = Object.getPrototypeOf(this);
            return super_class.invoke_class_member(memberName, args);
        },
            
        isPrototypeOf: function(obj){
            return this.prototype.isPrototypeOf(obj);
        },
        
    };