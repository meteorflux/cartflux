// Add collection for catalog and cart
Catalog = new Mongo.Collection('catalog');
Cart = new Mongo.Collection(null); // client side only

// For debugging purposes
Dispatcher.register(function(payload){
  console.log("Dispatcher received action with payload: ", payload);
});
