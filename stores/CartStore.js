// CartStore Collections
Cart = new Mongo.Collection(null); // client side only

// CartStore Methods
CartStore = {
  addCartItem: function(product_id){
    var cart_item = Cart.findOne({product_id: product_id});
    if ( !cart_item ) {
      Cart.insert({quantity: 1, product_id: product_id});
    } else {
      CartStore.increaseCartItem(cart_item._id);
    }
  },
  increaseCartItem: function(id){
    Cart.update(id, {$inc: {quantity: 1}});
  },
  decreaseCartItem: function(id){
    var cart_item = Cart.findOne(id);
    if ( cart_item.quantity === 1 ){
      CartStore.removeCartItem(id);
    } else {
      Cart.update(id, {$inc: {quantity: -1}});
    }
  },
  removeCartItem: function(id){
    Cart.remove(id);
  },
  removeProduct: function(product_id){
    CartStore.removeCartItem(Cart.findOne({product_id: product_id}));
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
      CartStore.addCartItem(payload.item._id);
      break;
    case "INCREASE_CART_ITEM":
      CartStore.increaseCartItem(payload.item._id);
      break;
    case "DECREASE_CART_ITEM":
      CartStore.decreaseCartItem(payload.item._id);
      break;
    case "REMOVE_CART_ITEM":
      CartStore.removeCartItem(payload.item._id);
      break;
    case "REMOVE_PRODUCT":
      CartStore.removeProduct(payload.product._id);
      break;
  }
});
