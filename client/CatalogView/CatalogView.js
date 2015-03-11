// CatalogView Helpers
Template.CatalogView.helpers({
  catalog_products: function(){
    return Catalog.find();
  },
  catalog_products_count: function(){
    return Catalog.find().count();
  },
  catalog_error: function(){
    // process the error in the frontend
    if (Session.get("Catalog.AddProductError") === false){
      $('#product_name').val('');
      $('#product_price').val('');
      return "";
    } else if (Session.get("Catalog.AddProductError") === "wrong-name") {
      return "Please provide a valid name.";
    } else if (Session.get("Catalog.AddProductError") === "wrong-price") {
      return "Please provide a valid price.";
    }
  }
});

// CatalogView Events
Template.CatalogView.events({
  'click .add_cart_item': function(){
    Dispatcher.dispatch({ actionType: "ADD_CART_ITEM", item: this });
  },
  'click .add_product': function(){
    Dispatcher.dispatch({ actionType: "ADD_PRODUCT", product: {
      name: $('#product_name').val(), price: $('#product_price').val() }});
  },
  'click .remove_product': function(){
    Dispatcher.dispatch({ actionType: "REMOVE_PRODUCT", product: this });
  },
  'click .add_another_product': function(){
    Dispatcher.dispatch({ actionType: "ADD_ANOTHER_PRODUCT" });
  }
});
