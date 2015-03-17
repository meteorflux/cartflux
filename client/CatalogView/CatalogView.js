// CatalogView Helpers
Template.CatalogView.helpers({
  catalog_products: function(){
    var regexp = new RegExp(Session.get("Catalog.searchProductsQuery"), 'i');
    return Catalog.find({name: regexp});
  },
  catalog_products_not_loaded: function(){
    return !Session.get("Catalog.searchProductsLoaded");
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
