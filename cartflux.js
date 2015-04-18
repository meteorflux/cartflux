if (Meteor.isClient){
  Template.body.onRendered(function(){
    // On ESC dispatch USER_CANCELED
    $('body').on('keydown',function(event) {
      if (event.which === 27){
        Dispatcher.dispatch({actionType: "USER_CANCELED"});
      }
    });
  });
}

// For debugging purposes
Dispatcher.register(function(payload){
  console.log("Dispatcher received action with payload: ", payload);
});
