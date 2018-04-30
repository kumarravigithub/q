Template.loginTwo.rendered = function () {

};

Template.loginTwo.events({
    'submit form': function (event) {   // also tried just 'submit'
        event.preventDefault();
        event.stopPropagation();
        let obj={}
        obj.email = $("input#email").val();
        obj.password = $("input#password").val();
        Meteor.loginWithPassword(obj.email, obj.password, function(err) {
            if(err) {
                alert(err.message)
            } else {
                FlowRouter.go('/dashboard1')
            }
        });
        return false;
    }
});