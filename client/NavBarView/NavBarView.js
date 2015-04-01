Template.NavBarView.helpers({
  'user_wants_to_login': function(){
    return UserStore.getUserWantsToLogin();
  }
});

Template.NavBarView.events({
  'keyup #search': function(event){
    Dispatcher.dispatch({
      actionType: "USER_HAS_SEARCHED_PRODUCTS",
      search: event.target.value
    });
  },
  'click .navbar-login': function(){
    Dispatcher.dispatch({ actionType: "USER_WANTS_TO_LOGIN" });
  },
  'click .navbar-sign-up': function(){
    Dispatcher.dispatch({ actionType: "USER_WANTS_TO_CREATE_ACCOUNT" });
  },
  'click .navbar-logout': function(){
    UserActions.logout();
  }
});

Template.NavBarView.onRendered(function(){
  $(".dropdown-button").dropdown({ hover: false });
});
