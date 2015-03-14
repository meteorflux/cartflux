// CatalogView Helpers
Template.CatalogView.helpers({
  catalog_products: function(){
    return Catalog.find();
  },
  catalog_products_count: function(){
    return Catalog.find().count();
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
