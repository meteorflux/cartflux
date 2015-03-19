Template.AddProductView.helpers({
  catalog_error: function(){
    // process the error in the frontend
    var adding_product = CatalogStore.getUserIsAddingProduct();
    if (adding_product === false){
      $('#product_name').val('');
      $('#product_price').val('');
      return "";
    } else if (adding_product === "wrong-name") {
      return "Please provide a valid name.";
    } else if (adding_product === "wrong-price") {
      return "Please provide a valid price.";
    }
  }
});

Template.AddProductView.events({
  'click .open-add-product': function(){
    Dispatcher.dispatch({actionType: "USER_IS_ADDING_PRODUCT"});
  },
  'click .close-add-product': function(){
    Dispatcher.dispatch({actionType: "USER_IS_NOT_ADDING_PRODUCT"});
  },
  'click .add_product': function(){
    Dispatcher.dispatch({ actionType: "ADD_PRODUCT", product: {
      name: $('#product_name').val(), price: $('#product_price').val() }});
  },
  'click .add_another_product': function(){
    Dispatcher.dispatch({ actionType: "ADD_ANOTHER_PRODUCT" });
  }
});

Template.AddProductView.onCreated(function(){
  this.autorun(function(){
    var adding_product = CatalogStore.getUserIsAddingProduct();
    if (adding_product === true) {
      $('#modal1').openModal({dismissible: false});
    } else if (adding_product === false) {
      $('#modal1').closeModal();
    }
    $('#lean-overlay').click(function(){
      Dispatcher.dispatch({actionType: "USER_IS_NOT_ADDING_PRODUCT"});
    });
  });
});
