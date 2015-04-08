// CatalogStore Collections
Catalog = new Mongo.Collection('catalog');

// CatalogStore Creator
var newCatalogStore = function(Catalog){

  // Reactive Vars
  var adding_product    = new ReactiveVar(false);
  var search_query      = new ReactiveVar("");

  // CatalogStore Object
  var CatalogStore = {
    // Callbacks
    on: {
      addProduct: function(name,price){
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
      addAnotherProduct: function(){
        var number = CatalogStore.get.numberOfProducts() + 1;
        CatalogStore.on.addProduct("Product "+ number, number);
      },
      addAnother10Products: function(){
        var number = CatalogStore.get.numberOfProducts() + 1;
        for (var i=number; i < number+10; i++){
          CatalogStore.on.addProduct("Product "+ i, i);
        }
      },
      removeProduct: function(id){
        Meteor.call('CatalogStore.removeProduct', id);
      },
      userIsAddingProduct: function(state){
        adding_product.set(state);
      },
      searchProducts: function(search){
        search_query.set(search);
      }
    },

    // Getters
    get: {
      searchedProducts: function(){
        var regexp = new RegExp(search_query.get(), 'i');
        return Catalog.find({name: regexp}, {sort: {date: 1}, limit: CatalogRouter.get.productsPerPage()});
      },
      searchQuery: function(){
        return search_query.get();
      },
      oneProduct: function(id){
        return Catalog.findOne(id);
      },
      userIsAddingProduct: function(){
        return adding_product.get();
      },
      numberOfProducts: function(){
        return CollectionCountersStore.get.numberOfProducts();
      }
    },

    // Subscriptions
    subscriptions: {
      searchedProducts: function(template){
        template.autorun(function(){
          template.subscribe("Catalog.searchedProducts",
            search_query.get(), CatalogRouter.get.productsPerPage(), CatalogRouter.get.actualPage());
        });
      }
    }
  };

  // CatalogStore Meteor Methods
  Meteor.methods({
    'CatalogStore.addProduct': function(product){
      var date = Date.now();
      Catalog.insert({name:product.name, price:product.price, date:date});
    },
    'CatalogStore.removeProduct': function(id){
      Catalog.remove(id);
    }
  });

  // CatalogStore Publications
  if (Meteor.isServer) {
    Meteor.publish('Catalog.searchedProducts', function(search, products_per_page, page) {
      var skip = (page - 1) * products_per_page;
      var regexp = new RegExp(search, 'i');
      return Catalog.find({name: regexp}, {limit: products_per_page, sort: {date:1}, skip: skip});
    });
    Meteor.publish('Catalog.productsInCart', function(products) {
      return Catalog.find({_id: {$in: _.pluck(products, 'product_id')}});
    });
  }

  // CatalogStore Callbacks
  CatalogStore.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "ADD_PRODUCT":
        CatalogStore.on.addProduct(payload.product.name, payload.product.price);
        break;
      case "REMOVE_PRODUCT":
        CatalogStore.on.removeProduct(payload.product._id);
        break;
      case "ADD_ANOTHER_PRODUCT":
        CatalogStore.on.addAnotherProduct();
        break;
      case "ADD_ANOTHER_10_PRODUCTS":
        CatalogStore.on.addAnother10Products();
        break;
      case "USER_IS_ADDING_PRODUCT":
        CatalogStore.on.userIsAddingProduct(true);
        break;
      case "USER_CANCELED":
        CatalogStore.on.userIsAddingProduct(false);
        break;
      case "USER_HAS_SEARCHED_PRODUCTS":
        CatalogStore.on.searchProducts(payload.search);
        break;
    }
  });

  return CatalogStore;
};

// Create the instance and pass Collections
CatalogStore = newCatalogStore(Catalog);
