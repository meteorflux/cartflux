// Dependencies
var catalogStore, cartStore;
Dependency.autorun(function(){
  catalogStore = Dependency.get('CatalogStore');
  cartStore    = Dependency.get('CartStore');
});

// CartView helpers
Template.CartView.helpers({
  cart_items: function(){
    return cartStore.getItems();
  },
  product: function(){
    return catalogStore.getOneProduct(this.product_id);
  },
  total_item_price: function(){
    var unit_price = catalogStore.getOneProduct(this.product_id).price;
    return this.quantity * unit_price;
  },
  total_cart_price: function(){
    var total = 0;
    cartStore.getItems().forEach(function(cart_item){
      var unit_price = catalogStore.getOneProduct(cart_item.product_id).price;
      total = total + unit_price * cart_item.quantity;
    });
    return total;
  },
  cart_items_count: function(){
    return cartStore.getItems().count();
  }
});

// CartView events
Template.CartView.events({
  'click .increase': function(){
    Dispatcher.dispatch({ actionType: "INCREASE_CART_ITEM", item: this });
  },
  'click .decrease': function(){
    Dispatcher.dispatch({ actionType: "DECREASE_CART_ITEM", item: this });
  },
  'click .remove': function(){
    Dispatcher.dispatch({ actionType: "REMOVE_CART_ITEM", item: this });
  }
});

// CartView subscriptions
Template.CartView.onCreated(function () {
  var self = this;
  self.autorun(function(){
    self.subscribe("CatalogStore.productsInCart", cartStore.getProductsInCart());
    self.subscribe("CartStore.userCart", cartStore.getCartId());
  });
});
