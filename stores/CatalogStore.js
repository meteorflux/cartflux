// CatalogStore Collections
Catalog = new Mongo.Collection('catalog');

// CatalogStore Methods
CatalogStore = {
  addProduct: function(name,price){
    if (name === '') {
      CatalogStore.userIsAddingProduct("wrong-name");
    } else if ((price === '')||(!$.isNumeric(price))){
      CatalogStore.userIsAddingProduct("wrong-price");
    } else {
      Catalog.insert({name:name, price:price});
      CatalogStore.userIsAddingProduct(false);
    }
  },
  addAnotherProduct: function(){
    var number = Catalog.find().count() + 1;
    CatalogStore.addProduct("Product "+number, number);
  },
  removeProduct: function(id){
    Catalog.remove(id);
  },
  userIsAddingProduct: function(state){
    Session.set("Catalog.userIsAddingProduct", state);
  },
  searchProducts: function(search){
    Session.set("Catalog.searchProductsQuery", search);
  },
  userHasPressedEsc: function(){
    Session.set("Catalog.userIsAddingProduct", false);
  }
};

// CatalogStore Publications
if (Meteor.isServer) {
  Meteor.publish('Catalog.catalogSearch', function(search) {
    var regexp = new RegExp(search || "", 'i');
    return Catalog.find({name: regexp});
  });
}

// CatalogStore Callbacks
CatalogStore.tokenId = Dispatcher.register(function(payload){
  switch(payload.actionType){
    case "ADD_PRODUCT":
      CatalogStore.addProduct(payload.product.name, payload.product.price);
      break;
    case "REMOVE_PRODUCT":
      CatalogStore.removeProduct(payload.product._id);
      break;
    case "ADD_ANOTHER_PRODUCT":
      CatalogStore.addAnotherProduct();
      break;
    case "USER_IS_ADDING_PRODUCT":
      CatalogStore.userIsAddingProduct(true);
      break;
    case "USER_IS_NOT_ADDING_PRODUCT":
      CatalogStore.userIsAddingProduct(false);
      break;
    case "USER_HAS_SEARCHED_PRODUCTS":
      CatalogStore.searchProducts(payload.search);
      break;
    case "USER_HAS_PRESSED_ESC":
      CatalogStore.userHasPressedEsc();
      break;
  }
});
