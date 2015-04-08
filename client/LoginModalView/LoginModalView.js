Template.LoginModalView.helpers({
  login: function(){
    return UserStore.get.loginOrCreate() === 'login';
  }
});

Template.CreateAccountForm.helpers({
  create_error: function(){
    return UserStore.get.createAccountError().reason;
  }
});

Template.LoginForm.helpers({
  login_error: function(){
    return UserStore.get.loginError().reason;
  }
});

Template.LoginModalView.events({
  'click .close': function(){
    Dispatcher.dispatch({actionType: "USER_CANCELED"});
  }
});

Template.LoginForm.events({
  'submit #login-form': function(event){
    event.preventDefault();
    UserActions.login(event.target.user.value, event.target.password.value);
  },
  'click .create-account': function(){
    Dispatcher.dispatch({actionType: "USER_WANTS_TO_CREATE_ACCOUNT"});
  }
});

Template.CreateAccountForm.events({
  'submit #create-form': function(event){
    event.preventDefault();
    var user = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
      retry_password: event.target.retry_password.value
    };
    UserActions.createAccount(user);
  },
  'click .login': function(){
    Dispatcher.dispatch({actionType: "USER_WANTS_TO_LOGIN"});
  }
});

Template.LoginModalView.onCreated(function(){
  this.autorun(function(){
    var user_is_signing = UserStore.get.userIsSigning();
    if (user_is_signing !== false) {
      $('#LoginModal').openModal({dismissible: false});
    } else if (user_is_signing === false) {
      $('#LoginModal').closeModal();
    }
    $('#lean-overlay').click(function(){
      Dispatcher.dispatch({actionType: "USER_CANCELED"});
    });
  });
});
