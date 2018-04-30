Template.register.rendered = function () {

};

Template.register.events({
    'submit form': function (event) {   // also tried just 'submit'
        let obj={}
        obj.name = $("input#name").val();
        obj.email = $("input#email").val();
        obj.password = $("input#password").val();
        Meteor.call('createUserServer', obj);
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
});

Template.register.helpers({

});