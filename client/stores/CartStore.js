// REACTIVE SINGLETONS.
// They need to be outside because Meteor throws a duplicate error if you
// create a second CartStore object (for example, in testing).
var reactive = new ReactiveDict('CartStore');


CartStore = function () {
  var self = this;

  // REACTIVE VARS
  reactive.setDefault('cartId', Meteor.userId() || Random.id());

  // CALLBACKS
  // Take a product id and add that product to the cart. If the product is
  // already in the cart, it calls a method to increase the quantity.
  var onAddCartItem = function (product_id) {
    var cart_id   = reactive.get("cartId");
    var cart_item = Cart.findOne({product_id: product_id, cart_id: cart_id });
    if ( !cart_item ) {
      // The cart item doesn't exist, so we are going to add it
      Meteor.call('CartStore.addCartItem', product_id, reactive.get('cartId'));
    } else {
      // The cart item exists, so we are going to increase it
      onIncreaseCartItem(cart_item._id);
    }
  };

  // Take a cart item id and increase its quantity by one
  var onIncreaseCartItem = function (id) {
    Meteor.call('CartStore.increaseCartItem', id);
  };

  // Take a cart item id and decrease its quantity by one
  var onDecreaseCartItem = function (id) {
    var cart_item = Cart.findOne(id);
    if ( cart_item.quantity === 1 ) {
      onRemoveCartItem(id);
    } else {
      Meteor.call('CartStore.decreaseCartItem', id);
    }
  };

  // Take a cart item id and remove it from the cart
  var onRemoveCartItem = function (id) {
    Meteor.call('CartStore.removeCartItem', id);
  };

  // Take a product id which has been removed and remove that cart item
  // from the cart.
  var onRemoveProduct = function (product_id) {
    Meteor.call('CartStore.removeProduct', product_id);
  };

  // When the user logs in, we change all the cartId values of the cart
  // items, from the initial random id generated for the anonymous user to
  // the id of the current user.
  var onLoginSucceed = function () {
    Meteor.call('CartStore.updateAllCartIds', self.getCartId());
    // Then, update our cartId to the userId
    reactive.set("cartId", Meteor.userId());
  };

  // GETTERS
  // Return all the cart items with the cartId of the user.
  self.getItems = function () {
    return Cart.find({cart_id: self.getCartId()});
  };

  // Return the items of cart. This is used to suscribe to those products
  // so their info is in the minimongo.
  self.getProductsInCart = function () {
    return self.getItems().fetch();
  };

  // Return the cartId. This is a random Id if the user is not logged in
  // and the user id if the user is logged in.
  self.getCartId = function () {
    return reactive.get("cartId");
  };

  // Register
  self.tokenId = Dispatcher.register(function (payload) {
    switch(payload.actionType) {
      case "ADD_CART_ITEM":
        onAddCartItem(payload.item._id);
        break;
      case "INCREASE_CART_ITEM":
        onIncreaseCartItem(payload.item._id);
        break;
      case "DECREASE_CART_ITEM":
        onDecreaseCartItem(payload.item._id);
        break;
      case "REMOVE_CART_ITEM":
        onRemoveCartItem(payload.item._id);
        break;
      case "REMOVE_PRODUCT":
        onRemoveProduct(payload.product._id);
        break;
      case "LOGIN_SUCCEED":
        onLoginSucceed();
        break;
      case "CREATE_ACCOUNT_SUCCEED":
        onLoginSucceed();
        break;
    }
  });

  return self;
};

// Initialize
Dependency.add('CartStore', new CartStore());
