Template.AddProductView.events({
  'click .open-add-product': function(evt, tpl){
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

Template.AddProductView.helpers({
  catalog_error: function(){
    // process the error in the frontend
    if (Session.get("Catalog.userIsAddingProduct") === false){
      $('#product_name').val('');
      $('#product_price').val('');
      return "";
    } else if (Session.get("Catalog.userIsAddingProduct") === "wrong-name") {
      return "Please provide a valid name.";
    } else if (Session.get("Catalog.userIsAddingProduct") === "wrong-price") {
      return "Please provide a valid price.";
    }
  }
});

Template.AddProductView.onRendered(function(){
  Tracker.autorun(function(){
    if (Session.get("Catalog.userIsAddingProduct") === true) {
      $('#modal1').openModal({dismissible: false});
    } else if (Session.get("Catalog.userIsAddingProduct") === false) {
      $('#modal1').closeModal();
    }
    $('#lean-overlay').click(function(){
      Dispatcher.dispatch({actionType: "USER_IS_NOT_ADDING_PRODUCT"});
    });
  });
  
});