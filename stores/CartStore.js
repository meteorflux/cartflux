// CartStore Collections
Cart = new Mongo.Collection(null); // client side only

// CartStore Methods
CartStore = {
  // Callbacks
  onAddCartItem: function(product_id){
    var cart_item = Cart.findOne({product_id: product_id});
    if ( !cart_item ) {
      Cart.insert({quantity: 1, product_id: product_id});
    } else {
      CartStore.onIncreaseCartItem(cart_item._id);
    }
  },
  onIncreaseCartItem: function(id){
    Cart.update(id, {$inc: {quantity: 1}});
  },
  onDecreaseCartItem: function(id){
    var cart_item = Cart.findOne(id);
    if ( cart_item.quantity === 1 ){
      CartStore.onRemoveCartItem(id);
    } else {
      Cart.update(id, {$inc: {quantity: -1}});
    }
  },
  onRemoveCartItem: function(id){
    Cart.remove(id);
  },
  onRemoveProduct: function(product_id){
    CartStore.onRemoveCartItem(Cart.findOne({product_id: product_id}));
  },
  
  // Getters
  getItems: function(){
    return Cart.find();
  },
  
  // Subscriptions
  subsProductsInCart: function(template){
    template.autorun(function(){
      template.subscribe("Cart.productsInCart", CartStore.getItems().fetch());
    });
  }
};

// CatalogStore Publications
if (Meteor.isServer) {
  Meteor.publish('Cart.productsInCart', function(products) {
    return Catalog.find({_id: {$in: _.pluck(products, 'product_id')}});
  });
}

// CartStore Callbacks
CartStore.tokenId = Dispatcher.register(function(payload){
  switch(payload.actionType){
    case "ADD_CART_ITEM":
      CartStore.onAddCartItem(payload.item._id);
      break;
    case "INCREASE_CART_ITEM":
      CartStore.onIncreaseCartItem(payload.item._id);
      break;
    case "DECREASE_CART_ITEM":
      CartStore.onDecreaseCartItem(payload.item._id);
      break;
    case "REMOVE_CART_ITEM":
      CartStore.onRemoveCartItem(payload.item._id);
      break;
    case "REMOVE_PRODUCT":
      CartStore.onRemoveProduct(payload.product._id);
      break;
  }
});
