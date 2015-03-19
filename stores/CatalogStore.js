// CatalogStore Collections
Catalog = new Mongo.Collection('catalog');

// Local Reactive Vars
var adding_product = new ReactiveVar(false);
var search_query = new ReactiveVar("");

// CatalogStore Methods
CatalogStore = {
  // Callbacks
  onAddProduct: function(name,price){
    if (name === '') {
      adding_product.set("wrong-name");
    } else if ((price === '')||(!$.isNumeric(price))){
      adding_product.set("wrong-price");
    } else {
      Catalog.insert({name:name, price:price});
      adding_product.set(false);
    }
  },
  onAddAnotherProduct: function(){
    var number = Catalog.find().count() + 1;
    CatalogStore.onAddProduct("Product "+number, number);
  },
  onRemoveProduct: function(id){
    Catalog.remove(id);
  },
  onUserIsAddingProduct: function(state){
    adding_product.set(state);
  },
  onUserHasPressedEsc: function(){
    adding_product.set(false);
  },
  onSearchProducts: function(search){
    search_query.set(search);
  },
  
  // Getters
  getSearchedProducts: function(){
    var regexp = new RegExp(search_query.get(), 'i');
    return Catalog.find({name: regexp});
  },
  getOneProduct: function(id){
    return Catalog.findOne(id);
  },
  getUserIsAddingProduct: function(){
    return adding_product.get();
  },
  
  // Subscriptions
  subsSearchedProducts: function(template){
    template.autorun(function(){
      template.subscribe("Catalog.searchedProducts", search_query.get());
    });
  }
};

// CatalogStore Publications
if (Meteor.isServer) {
  Meteor.publish('Catalog.searchedProducts', function(search) {
    //Meteor._sleepForMs(500);
    var regexp = new RegExp(search, 'i');
    return Catalog.find({name: regexp});
  });
}

// CatalogStore Callbacks
CatalogStore.tokenId = Dispatcher.register(function(payload){
  switch(payload.actionType){
    case "ADD_PRODUCT":
      CatalogStore.onAddProduct(payload.product.name, payload.product.price);
      break;
    case "REMOVE_PRODUCT":
      CatalogStore.onRemoveProduct(payload.product._id);
      break;
    case "ADD_ANOTHER_PRODUCT":
      CatalogStore.onAddAnotherProduct();
      break;
    case "USER_IS_ADDING_PRODUCT":
      CatalogStore.onUserIsAddingProduct(true);
      break;
    case "USER_IS_NOT_ADDING_PRODUCT":
      CatalogStore.onUserIsAddingProduct(false);
      break;
    case "USER_HAS_SEARCHED_PRODUCTS":
      CatalogStore.onSearchProducts(payload.search);
      break;
    case "USER_HAS_PRESSED_ESC":
      CatalogStore.onUserHasPressedEsc();
      break;
  }
});
