// CatalogView Helpers
Template.CatalogView.helpers({
  catalog_products: function(){
    return CatalogStore.getSearchedProducts();
  }
});

// CatalogView Events
Template.CatalogView.events({
  'click .add_cart_item': function(){
    Dispatcher.dispatch({ actionType: "ADD_CART_ITEM", item: this });
  },
  'click .remove_product': function(){
    Dispatcher.dispatch({ actionType: "REMOVE_PRODUCT", product: this });
  }
});

// CatalogView Subscriptions
Template.CatalogView.onCreated(function () {
  CatalogStore.subSearchedProducts(this);
});
