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
    on: {
      userWantsToLogin: function(){
        user_is_signing.set(true);
        login_or_create.set('login');
      },
      userWantsToCreateAccount: function(){
        user_is_signing.set(true);
        login_or_create.set('create');
      },
      userCanceled: function(){
        user_is_signing.set(false);
      },
      loginFailed: function(error){
        login_error.set(error);
      },
      createAccountFailed: function(error){
        create_error.set(error);
      },
      loginOrCreateSucceed: function(){
        login_error.set('');
        create_error.set('');
        user_is_signing.set(false);
      }
    },

    // Getters
    get: {
      userIsSigning: function(){
        return user_is_signing.get();
      },
      loginOrCreate: function(){
        return login_or_create.get();
      },
      loginError: function(){
        return login_error.get();
      },
      createAccountError: function(){
        return create_error.get();
      }
    }
  };

  UserStore.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "USER_WANTS_TO_LOGIN":
        UserStore.on.userWantsToLogin();
        break;
      case "USER_WANTS_TO_CREATE_ACCOUNT":
        UserStore.on.userWantsToCreateAccount();
        break;
      case "USER_CANCELED":
        UserStore.on.userCanceled();
        break;
      case "CREATE_ACCOUNT_FAILED":
        UserStore.on.createAccountFailed(payload.error);
        break;
      case "LOGIN_FAILED":
        UserStore.on.loginFailed(payload.error);
        break;
      case "LOGIN_SUCCEED":
        UserStore.on.loginOrCreateSucceed();
        break;
      case "CREATE_ACCOUNT_SUCCEED":
        UserStore.on.loginOrCreateSucceed();
        break;
    }
  });

  return UserStore;
};

// Create the instance
UserStore = newUserStore();
