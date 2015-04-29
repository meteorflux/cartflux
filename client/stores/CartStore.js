// Creator
CartStore = function () {
  var self = this;

  // Reactive Vars
  var reactive = new ReactiveDict('CartStore'); // persist HCP
  reactive.setDefault('cartId', Meteor.userId() || Random.id());

  // Callbacks
  self.on = {
    // Take a product id and add that product to the cart. If the product is
    // already in the cart, it calls a method to increase the quantity.
    addCartItem: function (product_id) {
      var cart_id   = reactive.get("cartId");
      var cart_item = Cart.findOne({product_id: product_id, cart_id: cart_id });
      if ( !cart_item ) {
        // The cart item doesn't exist, so we are going to add it
        Meteor.call('CartStore.addCartItem', product_id, reactive.get('cartId'));
      } else {
        // The cart item exists, so we are going to increase it
        self.on.increaseCartItem(cart_item._id);
      }
    },
    // Take a cart item id and increase its quantity by one
    increaseCartItem: function (id) {
      Meteor.call('CartStore.increaseCartItem', id);
    },
    // Take a cart item id and decrease its quantity by one
    decreaseCartItem: function (id) {
      var cart_item = Cart.findOne(id);
      if ( cart_item.quantity === 1 ) {
        self.on.removeCartItem(id);
      } else {
        Meteor.call('CartStore.decreaseCartItem', id);
      }
    },
    // Take a cart item id and remove it from the cart
    removeCartItem: function (id) {
      Meteor.call('CartStore.removeCartItem', id);
    },
    // Take a product id which has been removed and remove that cart item
    // from the cart.
    removeProduct: function (product_id) {
      Meteor.call('CartStore.removeProduct', product_id);
    },
    // When the user logs in, we change all the cartId values of the cart
    // items, from the initial random id generated for the anonymous user to
    // the id of the current user.
    loginSucceed: function () {
      Meteor.call('CartStore.updateAllCartIds', reactive.get("cartId"));
      // Then, update our cartId to the userId
      reactive.set("cartId", Meteor.userId());
    }
  };

  // Getters
  self.get = {
    // Return all the cart items with the cartId of the user.
    items: function () {
      return Cart.find({cart_id: reactive.get("cartId")});
    },
    // Return the items of cart. This is used to suscribe to those products
    // so their info is in the minimongo.
    productsInCart: function () {
      return self.get.items().fetch();
    },
    // Return the cartId. This is a random Id if the user is not logged in
    // and the user id if the user is logged in.
    cartId: function () {
      return reactive.get("cartId");
    }
  };

  // Register
  self.tokenId = Dispatcher.register(function (payload) {
    switch(payload.actionType) {
      case "ADD_CART_ITEM":
        self.on.addCartItem(payload.item._id);
        break;
      case "INCREASE_CART_ITEM":
        self.on.increaseCartItem(payload.item._id);
        break;
      case "DECREASE_CART_ITEM":
        self.on.decreaseCartItem(payload.item._id);
        break;
      case "REMOVE_CART_ITEM":
        self.on.removeCartItem(payload.item._id);
        break;
      case "REMOVE_PRODUCT":
        self.on.removeProduct(payload.product._id);
        break;
      case "LOGIN_SUCCEED":
        self.on.loginSucceed();
        break;
      case "CREATE_ACCOUNT_SUCCEED":
        self.on.loginSucceed();
        break;
    }
  });

  return self;
};

// Initialize
Dependency.add('CartStore', new CartStore());
