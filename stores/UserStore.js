// UserStore Creator
var newUserStore = function(){

  // UserStore Reactive Vars
  var user_is_signing = new ReactiveVar(false);
  var login_or_create = new ReactiveVar('login');
  var create_error    = new ReactiveVar('');
  var login_error     = new ReactiveVar('');

  // UserStore Object
  var UserStore = {
    // Callbacks
    onUserWantsToLogin: function(){
      user_is_signing.set(true);
      login_or_create.set('login');
    },
    onUserWantsToCreateAccount: function(){
      user_is_signing.set(true);
      login_or_create.set('create');
    },
    onUserCanceled: function(){
      user_is_signing.set(false);
    },
    onLoginFailed: function(error){
      login_error.set(error);
    },
    onLoginSucceed: function(){
      login_error.set('');
      create_error.set('');
      user_is_signing.set(false);
    },
    onCreateAccountFailed: function(error){
      create_error.set(error);
    },

    // Getters
    getUserIsSigning: function(){
      return user_is_signing.get();
    },
    getLoginOrCreate: function(){
      return login_or_create.get();
    },
    getLoginError: function(){
      return login_error.get();
    },
    getCreateAccountError: function(){
      return create_error.get();
    }
  };

  UserStore.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "USER_WANTS_TO_LOGIN":
        UserStore.onUserWantsToLogin();
        break;
      case "USER_WANTS_TO_CREATE_ACCOUNT":
        UserStore.onUserWantsToCreateAccount();
        break;
      case "USER_CANCELED":
        UserStore.onUserCanceled();
        break;
      case "LOGIN":
        UserStore.onLogin(payload.username_or_email, payload.password);
        break;
      case "CREATE_ACCOUNT_FAILED":
        UserStore.onCreateAccountFailed(payload.error);
        break;
      case "LOGIN_FAILED":
        UserStore.onLoginFailed(payload.error);
        break;
      case "LOGIN_SUCCEED":
        UserStore.onLoginSucceed();
        break;
    }
  });

  return UserStore;
};

// Create the instance
UserStore = newUserStore();
