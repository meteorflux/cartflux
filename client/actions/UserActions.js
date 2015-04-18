var UserActions = function() {
  var self = this;

  // Dependencies
  var Validations;
  Dependency.autorun(function(){
    Validations = Dependency.get('Libraries.Validations');
  });

  _.extend(self,{
    login: function(user,password){
      Meteor.loginWithPassword(user, password, function(error){
        if (error) {
          Dispatcher.dispatch({ actionType: "LOGIN_FAILED", error: error });
        } else {
          Dispatcher.dispatch({ actionType: "LOGIN_SUCCEED" });
        }
      });
    },
    createAccount: function(user){
      var error = false;

      if ( !Validations.areValidPasswords(user.password, user.retry_password) )
        error = new Meteor.Error("password-doesnt-match", "It looks like the passwords don't match.");
      if ( !Validations.isEmail(user.email) )
        error = new Meteor.Error("email-not-valid", "Please enter a valid email address.");
      if ( !Validations.isValidPassword(user.password) )
        error = new Meteor.Error("password-not-valid", "Your password should be 6 characters or longer.");
      if ( !Validations.isNotEmpty(user.username) )
        error = new Meteor.Error("username-empty", "Your username can't be empty.");

      if (error !== false){
        Dispatcher.dispatch({ actionType: "CREATE_ACCOUNT_FAILED", error: error });
      } else {
        Accounts.createUser(user, function(error){
          if (error) {
            Dispatcher.dispatch({ actionType: "CREATE_ACCOUNT_FAILED", error: error });
          } else {
            Dispatcher.dispatch({ actionType: "CREATE_ACCOUNT_SUCCEED" }); // User is logged in, so we use the same action
          }
        });
      }
    },
    logout: function(){
      Meteor.logout(function(error){
        if (error)
          Dispatcher.dispatch({ actionType: "LOGOUT_FAILED", error: error });
        else
          Dispatcher.dispatch({ actionType: "LOGOUT_SUCCEED" });
      });
    }
  });

  return self;
};

Dependency.add('UserActions', new UserActions());
