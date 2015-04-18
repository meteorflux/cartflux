// UserStore Creator
var UserStore = function () {
  var self = this;

  // UserStore Reactive Vars
  var userIsSigning = new ReactiveVar(false);
  var loginOrCreate = new ReactiveVar('login');
  var createError   = new ReactiveVar('');
  var loginError    = new ReactiveVar('');

  // Callbacks
  self.on = {
    userWantsToLogin: function(){
      userIsSigning.set(true);
      loginOrCreate.set('login');
    },
    userWantsToCreateAccount: function(){
      userIsSigning.set(true);
      loginOrCreate.set('create');
    },
    userCanceled: function(){
      userIsSigning.set(false);
    },
    loginFailed: function(error){
      loginError.set(error);
    },
    createAccountFailed: function(error){
      createError.set(error);
    },
    loginOrCreateSucceed: function(){
      loginError.set('');
      createError.set('');
      userIsSigning.set(false);
    }
  };

  // Getters
  self.get = {
    userIsSigning: function(){
      return userIsSigning.get();
    },
    loginOrCreate: function(){
      return loginOrCreate.get();
    },
    loginError: function(){
      return loginError.get();
    },
    createAccountError: function(){
      return createError.get();
    }
  };

  self.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "USER_WANTS_TO_LOGIN":
        self.on.userWantsToLogin();
        break;
      case "USER_WANTS_TO_CREATE_ACCOUNT":
        self.on.userWantsToCreateAccount();
        break;
      case "USER_CANCELED":
        self.on.userCanceled();
        break;
      case "CREATE_ACCOUNT_FAILED":
        self.on.createAccountFailed(payload.error);
        break;
      case "LOGIN_FAILED":
        self.on.loginFailed(payload.error);
        break;
      case "LOGIN_SUCCEED":
        self.on.loginOrCreateSucceed();
        break;
      case "CREATE_ACCOUNT_SUCCEED":
        self.on.loginOrCreateSucceed();
        break;
    }
  });

  return self;
};

// Create the instance
Dependency.add('UserStore', new UserStore());
