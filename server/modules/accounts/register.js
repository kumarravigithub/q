Meteor.methods({
    'createUserServer':function(usrobj) {
        // TODO: sanitise the user object
        console.log(usrobj);
        Accounts.createUser({
            email: usrobj.email,
            password: usrobj.password,
            profile: {
                name:usrobj.name
            }
        });
    }
});
