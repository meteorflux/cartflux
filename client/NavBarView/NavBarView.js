Template.NavBarView.events({
  'keyup #search': function(event,template){
    Dispatcher.dispatch({
      actionType: "USER_HAS_SEARCHED_PRODUCTS",
      search: event.target.value
    });
  }
});