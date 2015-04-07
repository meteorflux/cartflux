Template.AddProductView.helpers({
  catalog_error: function(){
    // process the error in the frontend
    var adding_product = CatalogStore.getUserIsAddingProduct();
    if (adding_product === false){
      $('#product_name').val('');
      $('#product_price').val('');
      return "";
    } else {
      return adding_product.reason;
    }
  }
});

Template.AddProductView.events({
  'click .open-add-product': function(){
    Dispatcher.dispatch({actionType: "USER_IS_ADDING_PRODUCT"});
  },
  'click .close-add-product': function(){
    Dispatcher.dispatch({actionType: "USER_CANCELED"});
  },
  'click .add_product': function(){
    Dispatcher.dispatch({ actionType: "ADD_PRODUCT", product: {
      name: $('#product_name').val(), price: $('#product_price').val() }});
  },
  'click .add_another_product': function(){
    Dispatcher.dispatch({ actionType: "ADD_ANOTHER_PRODUCT" });
  },
  'click .add_another_10_products': function(){
    Dispatcher.dispatch({ actionType: "ADD_ANOTHER_10_PRODUCTS" });
  }
});

Template.AddProductView.onCreated(function(){
  this.autorun(function(){
    var adding_product = CatalogStore.getUserIsAddingProduct();
    if (adding_product === true) {
      $('#AddProductModal').openModal({dismissible: false});
    } else if (adding_product === false) {
      $('#AddProductModal').closeModal();
    }
    $('#lean-overlay').click(function(){
      Dispatcher.dispatch({actionType: "USER_CANCELED"});
    });
  });
});
