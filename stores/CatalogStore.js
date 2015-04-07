// CatalogStore Collections
Catalog = new Mongo.Collection('catalog');

// CatalogStore Creator
var newCatalogStore = function(Catalog){

  // Reactive Vars
  var adding_product = new ReactiveVar(false);
  var search_query = new ReactiveVar("");

  // CatalogStore Object
  var CatalogStore = {
    // Callbacks
    onAddProduct: function(name,price){
      // some validation in the Store side
      var error = false;
      if (name === '') {
        error = new Meteor.Error("wrong-name","Please provide a valid name.");
      } else if ((price === '')||(!$.isNumeric(price))){
        error = new Meteor.Error("wrong-price","Please provide a valid price.");
      } else {
        Meteor.call('CatalogStore.addProduct', {name:name, price:price});
      }
      adding_product.set(error);
    },
    onAddAnotherProduct: function(){
      var number = Catalog.find().count() + 1;
      CatalogStore.onAddProduct("Product "+number, number);
    },
    onRemoveProduct: function(id){
      Meteor.call('CatalogStore.removeProduct', id);
    },
    onUserIsAddingProduct: function(state){
      adding_product.set(state);
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
    subSearchedProducts: function(template){
      template.autorun(function(){
        template.subscribe("Catalog.searchedProducts", search_query.get());
      });
    }
  };

  // CatalogStore Meteor Methods
  Meteor.methods({
    'CatalogStore.addProduct': function(product){
      Catalog.insert({name:product.name, price:product.price});
    },
    'CatalogStore.removeProduct': function(id){
      Catalog.remove(id);
    }
  });

  // CatalogStore Publications
  if (Meteor.isServer) {
    Meteor.publish('Catalog.searchedProducts', function(search) {
      var regexp = new RegExp(search, 'i');
      return Catalog.find({name: regexp});
    });
    Meteor.publish('Catalog.productsInCart', function(products) {
      return Catalog.find({_id: {$in: _.pluck(products, 'product_id')}});
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
      case "USER_CANCELED":
        CatalogStore.onUserIsAddingProduct(false);
        break;
      case "USER_HAS_SEARCHED_PRODUCTS":
        CatalogStore.onSearchProducts(payload.search);
        break;
    }
  });

  return CatalogStore;
};

// Create the instance and pass Collections
CatalogStore = newCatalogStore(Catalog);
